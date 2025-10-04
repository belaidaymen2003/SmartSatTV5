import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();
const GIFT_TAG = "GIFT CARDS";

async function ensureGiftTag() {
  return prisma.tag.upsert({
    where: { name: GIFT_TAG },
    create: { name: GIFT_TAG },
    update: {},
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const q = searchParams.get("q") || undefined;

    if (id) {
      const item = await prisma.catalogItem.findUnique({ where: { id: Number(id) }, include: { tags: { include: { tag: true } } } });
      if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
      const hasGift = item.tags.some((t) => t.tag.name === GIFT_TAG);
      if (!hasGift) return NextResponse.json({ error: "Not a gift card" }, { status: 404 });
      return NextResponse.json({ item });
    }

    const items = await prisma.catalogItem.findMany({
      where: {
        ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
        tags: { some: { tag: { name: GIFT_TAG } } },
      },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, description: true, coverUrl: true, createdAt: true },
    });

    return NextResponse.json({ items });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, coverUrl } = body || {};
    if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

    const tag = await ensureGiftTag();

    const created = await prisma.catalogItem.create({
      data: {
        title,
        category: "STREAMING",
        description: description ?? null,
        coverUrl: coverUrl ?? null,
        actors: [],
        genres: {}, // leave empty
        tags: { create: [{ tag: { connect: { id: tag.id } } }] },
      },
    });

    return NextResponse.json({ item: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, coverUrl } = body || {};
    const itemId = Number(id);
    if (!Number.isFinite(itemId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const updated = await prisma.catalogItem.update({
      where: { id: itemId },
      data: {
        ...(typeof title === "string" ? { title } : {}),
        ...(typeof description === "string" ? { description } : {}),
        ...(typeof coverUrl === "string" || coverUrl === null ? { coverUrl } : {}),
      },
      select: { id: true, title: true, description: true, coverUrl: true, createdAt: true },
    });

    return NextResponse.json({ item: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");
    const body = await request.json().catch(() => null);
    const itemId = Number(idParam || (body && body.id));
    if (!Number.isFinite(itemId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    await prisma.itemTag.deleteMany({ where: { itemId } });
    await prisma.catalogItem.delete({ where: { id: itemId } });

    return NextResponse.json({ message: "Deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
