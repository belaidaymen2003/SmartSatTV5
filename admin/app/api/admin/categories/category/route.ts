import { NextRequest, NextResponse } from "next/server";

 import { PrismaClient } from "@/lib/generated/prisma";
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
     const categoryParam = searchParams.get("category");
     const q = searchParams.get("q") || undefined;

     if (id) {
       const channelId = Number(id);
       if (!Number.isFinite(channelId)) {
         return NextResponse.json({ error: "Invalid id" }, { status: 400 });
       }
       const channel = await prisma.iPTVChannel.findUnique({ where: { id: channelId } });
       if (!channel) return NextResponse.json({ error: "Not found" }, { status: 404 });
       return NextResponse.json({ channel });
     }

     const category = categoryParam || categoryFromSlug(slug || undefined);

     const channels = await prisma.iPTVChannel.findMany({
       where: {
         ...(category ? { category } : {}),
         ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
       },
       orderBy: { createdAt: "desc" },
     });
     return NextResponse.json({ channels });
   } catch (error: any) {
     return NextResponse.json({ error: error.message }, { status: 500 });
   }
 }

 export async function POST(request: NextRequest) {
   try {
     const { title, category, cost, description, url, logoUrl } = await request.json();

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

     return NextResponse.json({ message: "Created", channel: created }, { status: 201 });
   } catch (error: any) {
     return NextResponse.json({ error: error.message }, { status: 500 });
   }
 }

 export async function PUT(request: NextRequest) {
   try {
     const body = await request.json();
     const { id, name, title, url, logo, logoUrl, description, category, cost } = body || {};
     const channelId = Number(id);
     if (!Number.isFinite(channelId)) {
       return NextResponse.json({ error: "Invalid id" }, { status: 400 });
     }

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

     await prisma.iPTVChannel.delete({ where: { id: channelId } });
     return NextResponse.json({ message: "Deleted" });
   } catch (error: any) {
     return NextResponse.json({ error: error.message }, { status: 500 });
   }
 }
