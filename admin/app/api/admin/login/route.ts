import { NextResponse } from 'next/server'

const ADMIN_EMAIL = 'admin@hotflix.local'
const ADMIN_PASSWORD = 'admin123'

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}))
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const res = NextResponse.json({ ok: true })
    res.cookies.set('admin_session', 'ok', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 })
    return res
  }
  return NextResponse.json({ ok: false, message: 'Invalid credentials' }, { status: 401 })
}


export async function GET(req: Request) {

  return NextResponse.json({  })
}