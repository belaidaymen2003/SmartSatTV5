import { PrismaClient } from '@/lib/generated/prisma'
import { PrismaClient } from '@/lib/generated/prisma'
import { NextRequest, NextResponse } from 'next/server'

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
    if (channelId) {
      const subs = await prisma.subscription.findMany({ where: { channelId: Number(channelId) }, include: { user: true } })
      return NextResponse.json({ subscriptions: subs })
    }

    const subs = await prisma.subscription.findMany({ include: { user: true, channel: true }, orderBy: { startDate: 'desc' } })
    return NextResponse.json({ subscriptions: subs })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId: maybeUserId,
      userEmail,
      userName,
      channelId,
      durationMonths,
      credit,
      code: providedCode,
      startDate: providedStart,
    } = body || {}

    if (!channelId) return NextResponse.json({ error: 'channelId required' }, { status: 400 })
    const channelIdNum = Number(channelId)
    if (!Number.isFinite(channelIdNum)) return NextResponse.json({ error: 'Invalid channelId' }, { status: 400 })

    const durationNum = Number(durationMonths ?? 1)
    if (!Number.isFinite(durationNum) || durationNum <= 0) return NextResponse.json({ error: 'Invalid durationMonths' }, { status: 400 })

    // Resolve or create user
    let userId: number | null = null
    if (maybeUserId) {
      const u = await prisma.user.findUnique({ where: { id: Number(maybeUserId) } })
      if (!u) return NextResponse.json({ error: 'User not found' }, { status: 404 })
      userId = u.id
    } else if (userEmail) {
      // Upsert by email
      const username = userName || userEmail.split('@')[0]
      const up = await prisma.user.upsert({
        where: { email: userEmail },
        update: {},
        create: { email: userEmail, username: username, name: userName || username, passwordHash: 'admin-created', credits: 0 },
      })
      userId = up.id
    } else {
      return NextResponse.json({ error: 'userId or userEmail required' }, { status: 400 })
    }

    // Compute dates
    const start = providedStart ? new Date(providedStart) : new Date()
    const end = new Date(start)

    // map numeric months to DurationPlan enum
    function monthsToDurationPlan(n: number) {
      if (n <= 1) return 'ONE_MONTH'
      if (n <= 3) return 'THREE_MONTHS'
      if (n <= 6) return 'SIX_MONTHS'
      return 'TWELVE_MONTHS'
    }
    const durationEnum = monthsToDurationPlan(durationNum)
    end.setMonth(end.getMonth() + durationNum)

    // handle code uniqueness
    let code = providedCode && String(providedCode).trim() ? String(providedCode).trim() : randomCode(10)
    let tries = 0
    while (tries < 5) {
      const existing = await prisma.subscription.findUnique({ where: { code } as any }).catch(() => null)
      if (!existing) break
      code = randomCode(10)
      tries++
    }

    const created = await prisma.subscription.create({
      data: {
        userId,
        channelId: channelIdNum,
        credit: typeof credit === 'number' ? credit : Number(credit ?? 0),
        code,
        duration: durationEnum as any,
        startDate: start,
        endDate: end,
        status: 'ACTIVE',
      },
      include: { user: true, channel: true },
    })

    return NextResponse.json({ subscription: created }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
