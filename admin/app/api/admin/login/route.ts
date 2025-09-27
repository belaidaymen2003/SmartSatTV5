import { NextResponse, userAgent } from 'next/server'
import { PrismaClient } from "@/lib/generated/prisma";
const prisma  = new PrismaClient()
export async function POST(req: Request, res: Response) {
  //const result = await req.json().catch(() => ({}))
    const body = await req.json();

    const { emailorusername, password } = body;
    if (!emailorusername || !password) {
      return NextResponse.json({ message: 'Email/Username and password are required' }, { status: 400 });
    }
    function isEmail(input: string): boolean {
        return input.includes('@');
    }
    const user = await prisma.user.findFirst({
      where: {
        ...(isEmail(emailorusername)
          ? { email: emailorusername }
          : { username: emailorusername }),
        passwordHash: password,
        role: 'ADMIN',
      }
    });
    return NextResponse.json(user ? { message: 'Login successful', user } : { message: 'Invalid credentials' }, { status: user ? 200 : 401 });
  

}

export async function GET(req: Request) {

  return NextResponse.json({  })
}