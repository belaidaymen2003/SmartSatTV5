import { NextResponse, userAgent } from 'next/server'
import { PrismaClient } from "@prisma/client";
const prisma  = new PrismaClient()
export async function POST(req: Request, res: Response) {
  //const result = await req.json().catch(() => ({}))
    const body = await req.json();

    const { emailorusername, password } = body;
    if (!emailorusername || !password) {
      return NextResponse.json({ message: 'Email/Username and password are required' }, { status: 400 });
    }

    const user = await prisma.User.findUnique({
      where: {
        role: 'ADMIN',
        username: emailorusername ,
        passwordHash: password

      },
    });
  return NextResponse.json(user);
  

}

export async function GET(req: Request) {

  return NextResponse.json({  })
}