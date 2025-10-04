import { NextRequest, NextResponse } from "next/server";
 import ImageKit from "imagekit";

 import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export async function POST(request: NextRequest) {
  try {
    const {title, category, cost, description, url, logoUrl} = await request.json();
prisma
    await prisma.iPTVChannel.create({
      data: {
        name: title,
        category: category,
        cost: cost,
        description: description,
        url :url,
        logo: logoUrl,
      },
    });

    return NextResponse.json({ message: "Category created successfully" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
