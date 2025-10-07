import { PrismaClient } from '@/lib/generated/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { readDb, writeDb } from '@/lib/mockDb'

const prisma = new PrismaClient()

function randomCode(len = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let s = ''
  for (let i = 0; i < len; i++) s += chars.charAt(Math.floor(Math.random() * chars.length))
  return s
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const channelId = searchParams.get('channelId')
    const id = searchParams.get('id')
    if (id) {
      try {
        const sub = await prisma.subscription.findUnique({ where: { id: Number(id) } as any, include: { user: true, channel: true } })
        if (!sub) return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json({ subscription: sub })
      } catch (_) {
        const db = readDb()
        const sub = db.subscriptions.find(s => s.id === Number(id))
        if (!sub) return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json({ subscription: sub })
      }
    }

    if (channelId) {
      const cid = Number(channelId)
      try {
        const subs = await prisma.subscription.findMany({ where: { channelId: cid }, include: { user: true } })
        return NextResponse.json({ subscriptions: subs })
      } catch (_) {
        const db = readDb()
        const subs = db.subscriptions.filter(s => s.channelId === cid)
        return NextResponse.json({ subscriptions: subs })
      }
    }

    try {
      const subs = await prisma.subscription.findMany({ include: { user: true, channel: true }, orderBy: { startDate: 'desc' } })
      return NextResponse.json({ subscriptions: subs })
    } catch (_) {
      const db = readDb()
      return NextResponse.json({ subscriptions: db.subscriptions })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { channelId, durationMonths, credit, code: providedCode, startDate: providedStart } = body || {}
    if (!channelId) return NextResponse.json({ error: 'channelId required' }, { status: 400 })
    const channelIdNum = Number(channelId)
    if (!Number.isFinite(channelIdNum)) return NextResponse.json({ error: 'Invalid channelId' }, { status: 400 })

    const durationNum = Number(durationMonths ?? 1)
    if (!Number.isFinite(durationNum) || durationNum <= 0) return NextResponse.json({ error: 'Invalid durationMonths' }, { status: 400 })

    const start = providedStart ? new Date(providedStart) : new Date()
    const end = new Date(start)
    end.setMonth(end.getMonth() + durationNum)

    function monthsToDurationPlan(n: number) {
      if (n <= 1) return 'ONE_MONTH'
      if (n <= 3) return 'THREE_MONTHS'
      if (n <= 6) return 'SIX_MONTHS'
      return 'TWELVE_MONTHS'
    }
    const durationEnum = monthsToDurationPlan(durationNum)

    let code = providedCode && String(providedCode).trim() ? String(providedCode).trim() : randomCode(10)
    let tries = 0
    while (tries < 5) {
      let exists = false
      try {
        const existing = await prisma.subscription.findUnique({ where: { code } as any })
        if (existing) exists = true
      } catch (_) {
        const db = readDb()
        if (db.subscriptions.some(s => s.code === code)) exists = true
      }
      if (!exists) break
      code = randomCode(10)
      tries++
    }

    // resolve user from Authorization header (do NOT accept userId/userEmail from request body)
    let userId: number | null = null
    let prismaAvailable = true

    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization') || ''
    try {
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7).trim()
        // token as numeric user id
        if (/^\d+$/.test(token)) {
          const id = Number(token)
          const u = await prisma.user.findUnique({ where: { id } })
          if (!u) return NextResponse.json({ error: 'User not found' }, { status: 404 })
          userId = u.id
        } else if (token.startsWith('email:')) {
          const email = token.slice(6)
          const username = email.split('@')[0]
          const up = await prisma.user.upsert({ where: { email }, update: {}, create: { email, username, name: username, passwordHash: 'admin-created', credits: 0 } })
          userId = up.id
        } else {
          // unsupported token format - treat as unauthenticated
        }
      }
    } catch (err) {
      // Prisma unavailable or error resolving user -- fallback to mock DB
      prismaAvailable = false
    }

    if (prismaAvailable && userId === null) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
    }

    try {
      if (prismaAvailable) {
        const created = await prisma.subscription.create({ data: { userId: userId!, channelId: channelIdNum, credit: typeof credit === 'number' ? credit : Number(credit ?? 0), code, duration: durationEnum as any, startDate: start, endDate: end, status: 'ACTIVE' }, include: { user: true, channel: true } })
        return NextResponse.json({ subscription: created }, { status: 201 })
      }

      // mock fallback when Prisma is not available
      const db = readDb()
      let mockUserId = null
      if (db.users && db.users.length) mockUserId = db.users[0].id
      if (!mockUserId) {
        const id = 1
        db.users = db.users || []
        db.users.push({ id, email: 'mock@local', username: 'mock', name: 'Mock User' })
        mockUserId = id
        writeDb(db)
      }

      const id = db.subscriptions.length ? Math.max(...db.subscriptions.map(s=>s.id)) + 1 : 1
      const now = new Date().toISOString()
      const sub = { id, userId: mockUserId, channelId: channelIdNum, credit: Number(credit ?? 0), code, duration: durationEnum, startDate: start.toISOString(), endDate: end.toISOString(), status: 'ACTIVE', updatedAt: now }
      db.subscriptions.unshift(sub as any)
      writeDb(db)
      return NextResponse.json({ subscription: sub, message: 'Created (mock)' }, { status: 201 })
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, code, credit, durationMonths, startDate, endDate, status } = body || {}
    const subId = Number(id)
    if (!Number.isFinite(subId)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

    try {
      const updateData: any = {}
      if (typeof code === 'string') updateData.code = code
      if (typeof credit !== 'undefined') updateData.credit = Number(credit)
      if (typeof durationMonths !== 'undefined') { const end = new Date(startDate ? new Date(startDate) : new Date()); end.setMonth(end.getMonth() + Number(durationMonths)); updateData.endDate = end }
      if (typeof status === 'string') updateData.status = status

      const updated = await prisma.subscription.update({ where: { id: subId } as any, data: updateData })
      return NextResponse.json({ subscription: updated })
    } catch (_) {
      const db = readDb()
      const i = db.subscriptions.findIndex(s => s.id === subId)
      if (i === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      const existing = db.subscriptions[i]
      const updated = { ...existing, code: code ?? existing.code, credit: typeof credit !== 'undefined' ? Number(credit) : existing.credit, updatedAt: new Date().toISOString() }
      db.subscriptions[i] = updated as any
      writeDb(db)
      return NextResponse.json({ subscription: updated })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const idParam = searchParams.get('id')
    const codeParam = searchParams.get('code')
    if (!idParam && !codeParam) return NextResponse.json({ error: 'id or code required' }, { status: 400 })

    try {
      if (idParam) await prisma.subscription.delete({ where: { id: Number(idParam) } as any })
      else await prisma.subscription.delete({ where: { code: codeParam as string } as any })
      return NextResponse.json({ message: 'Deleted' })
    } catch (_) {
      const db = readDb()
      if (idParam) db.subscriptions = db.subscriptions.filter(s => s.id !== Number(idParam))
      else db.subscriptions = db.subscriptions.filter(s => s.code !== codeParam)
      writeDb(db)
      return NextResponse.json({ message: 'Deleted (mock)' })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
