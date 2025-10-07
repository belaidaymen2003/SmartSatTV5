import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@/lib/generated/prisma";
import { readDb, writeDb } from '@/lib/mockDb'
const prisma = new PrismaClient();

// Helper to map known slugs to categories
function categoryFromSlug(slug?: string | null): string | undefined {
  if (!slug) return undefined;
  if (slug.toLowerCase() === "iptv") return "Live TV";
  return undefined;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");
    if (id) {
      const channelId = Number(id);
      if (!Number.isFinite(channelId)) {
        return NextResponse.json({ error: "Invalid id" }, { status: 400 });
      }
      try {
        const channel = await prisma.iPTVChannel.findUnique({
          where: { id: channelId },
        });
        if (!channel) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({ channel });
      } catch (err) {
        // fallback to mock db
        const db = readDb()
        const ch = db.channels.find(c => c.id === channelId)
        if (!ch) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({ channel: ch })
      }
    }

    try {
      const channels = await prisma.iPTVChannel.findMany()
      return NextResponse.json({ channels });
    } catch (err) {
      const db = readDb()
      return NextResponse.json({ channels: db.channels })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, category, cost, description, url, logoUrl } =
      await request.json();

    try {
      const created = await prisma.iPTVChannel.create({
        data: {
          name: title,
          category,
          cost,
          description,
          url,
          logo: logoUrl,
        },
      });

      return NextResponse.json(
        { message: "Created", channel: created },
        { status: 201 }
      );
    } catch (err) {
      const db = readDb()
      const id = db.channels.length ? Math.max(...db.channels.map(c=>c.id)) + 1 : 1
      const now = new Date().toISOString()
      const ch = { id, name: title, category, cost: cost ?? 0, description: description ?? null, url: url ?? '', logo: logoUrl ?? null, createdAt: now, updatedAt: now }
      db.channels.unshift(ch as any)
      writeDb(db)
      return NextResponse.json({ message: 'Created (mock)', channel: ch }, { status: 201 })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, title, url, logo, logoUrl, description, category, cost } =
      body || {};
    const channelId = Number(id);
    if (!Number.isFinite(channelId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    try {
      const updated = await prisma.iPTVChannel.update({
        where: { id: channelId },
        data: {
          ...(name || title ? { name: name ?? title } : {}),
          ...(typeof url === "string" ? { url } : {}),
          ...(typeof description === "string" ? { description } : {}),
          ...(typeof category === "string" ? { category } : {}),
          ...(typeof cost !== "undefined" ? { cost: Number(cost) } : {}),
          ...(logo || logoUrl ? { logo: logo ?? logoUrl } : {}),
        },
      });

      return NextResponse.json({ message: "Updated", channel: updated });
    } catch (err) {
      const db = readDb()
      const i = db.channels.findIndex(c => c.id === channelId)
      if (i === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      const updated = { ...db.channels[i], name: name ?? title ?? db.channels[i].name, url: typeof url === 'string' ? url : db.channels[i].url, description: typeof description === 'string' ? description : db.channels[i].description, category: typeof category === 'string' ? category : db.channels[i].category, cost: typeof cost !== 'undefined' ? Number(cost) : db.channels[i].cost, logo: logo ?? logoUrl ?? db.channels[i].logo, updatedAt: new Date().toISOString() }
      db.channels[i] = updated as any
      writeDb(db)
      return NextResponse.json({ message: 'Updated (mock)', channel: updated })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");
    let channelId: number | null = idParam ? Number(idParam) : null;

    if (!channelId) {
      try {
        const body = await request.json();
        if (body && body.id) channelId = Number(body.id);
      } catch {}
    }

    if (!channelId || !Number.isFinite(channelId)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    try {
      await prisma.iPTVChannel.delete({ where: { id: channelId } });
      return NextResponse.json({ message: "Deleted" });
    } catch (err) {
      const db = readDb()
      db.channels = db.channels.filter(c => c.id !== channelId)
      writeDb(db)
      return NextResponse.json({ message: 'Deleted (mock)' })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
