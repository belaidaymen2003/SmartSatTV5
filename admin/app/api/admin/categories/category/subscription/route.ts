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
    const { userId: maybeUserId, userEmail, userName, channelId, durationMonths, credit, code: providedCode, startDate: providedStart } = body || {}
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

    // resolve/create user (try prisma then mock)
    let userId: number | null = null
    if (maybeUserId) {
      try {
        const u = await prisma.user.findUnique({ where: { id: Number(maybeUserId) } })
        if (!u) return NextResponse.json({ error: 'User not found' }, { status: 404 })
        userId = u.id
      } catch (_) {
        userId = Number(maybeUserId)
      }
    } else if (userEmail) {
      try {
        const username = userName || userEmail.split('@')[0]
        const up = await prisma.user.upsert({ where: { email: userEmail }, update: {}, create: { email: userEmail, username, name: userName || username, passwordHash: 'admin-created', credits: 0 } })
        userId = up.id
      } catch (_) {
        const db = readDb()
        let u = db.users.find(uu => uu.email === userEmail)
        if (!u) {
          const id = db.users.length ? Math.max(...db.users.map(x=>x.id)) + 1 : 1
          u = { id, email: userEmail, username: userEmail.split('@')[0], name: userName || userEmail.split('@')[0] }
          db.users.push(u)
          writeDb(db)
        }
        userId = u.id
      }
    }

    try {
      if (userId === null) return NextResponse.json({ error: 'userId or userEmail required for DB creation' }, { status: 400 })
      const created = await prisma.subscription.create({ data: { userId, channelId: channelIdNum, credit: typeof credit === 'number' ? credit : Number(credit ?? 0), code, duration: durationEnum as any, startDate: start, endDate: end, status: 'ACTIVE' }, include: { user: true, channel: true } })
      return NextResponse.json({ subscription: created }, { status: 201 })
    } catch (_) {
      const db = readDb()
      const id = db.subscriptions.length ? Math.max(...db.subscriptions.map(s=>s.id)) + 1 : 1
      const now = new Date().toISOString()
      const sub = { id, userId: userId ?? 0, channelId: channelIdNum, credit: Number(credit ?? 0), code, duration: durationEnum, startDate: start.toISOString(), endDate: end.toISOString(), status: 'ACTIVE', updatedAt: now }
      db.subscriptions.unshift(sub as any)
      writeDb(db)
      return NextResponse.json({ subscription: sub, message: 'Created (mock)' }, { status: 201 })
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
