import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import { PrismaClient } from "@/lib/generated/prisma";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});
const prisma = new PrismaClient();
const FOLDER = "/projects/SmartSatTV/giftCards/covers";

async function toBase64(file: FormDataEntryValue | null): Promise<string> {
  if (!file) throw new Error("No file provided");
  if (file instanceof Blob) {
    const buf = Buffer.from(await file.arrayBuffer());
    return buf.toString("base64");
  }
  return file.toString();
}

function fileNameFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/");
    return parts[parts.length - 1] || null;
  } catch { return null }
}

async function resolveFileId({ fileId, url }: { fileId?: string | null, url?: string | null }) {
  if (fileId) return fileId;
  if (!url) return null;
  const name = fileNameFromUrl(url);
  if (!name) return null;
  const list = await imagekit.listFiles({ path: FOLDER.replace(/^\//, ""), name, limit: 1 });
     if (list && list.length) {
    const file = list[0];
    if ('fileId' in file) {
      return file.fileId;
    }
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const fd = await request.formData();
    const file = fd.get("file");
    const fileName = (fd.get("fileName") as string) || `gift_${Date.now()}.png`;

    const uploaded = await imagekit.upload({ file: await toBase64(file), fileName, folder: FOLDER });
    return NextResponse.json({ message: "Uploaded", url: uploaded.url, fileId: uploaded.fileId });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const fd = await request.formData();
    const itemId = Number(fd.get("itemId"));
    if (!Number.isFinite(itemId)) return NextResponse.json({ error: "Invalid itemId" }, { status: 400 });
    const file = fd.get("file");
    const fileName = (fd.get("fileName") as string) || `gift_${itemId}_${Date.now()}.png`;
    const oldFileId = (fd.get("oldFileId") as string) || undefined;
    const oldUrl = (fd.get("oldUrl") as string) || undefined;

    const uploaded = await imagekit.upload({ file: await toBase64(file), fileName, folder: FOLDER });

    const updated = await prisma.catalogItem.update({ where: { id: itemId }, data: { coverUrl: uploaded.url } });

    try {
      const resolved = await resolveFileId({ fileId: oldFileId, url: oldUrl || updated.coverUrl || undefined });
      if (resolved) await imagekit.deleteFile(resolved);
    } catch {}

    return NextResponse.json({ message: "Updated", url: uploaded.url, fileId: uploaded.fileId, item: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const idParam = url.searchParams.get("itemId");
    const body = await request.json().catch(()=>null);
    const itemId = Number(idParam || (body && body.itemId));
    const fileId = (url.searchParams.get("fileId") || (body && body.fileId)) as string | undefined;
    const current = Number.isFinite(itemId) ? await prisma.catalogItem.findUnique({ where: { id: itemId } }) : null;

    const resolved = await resolveFileId({ fileId, url: current?.coverUrl });
    if (resolved) await imagekit.deleteFile(resolved);

    if (Number.isFinite(itemId)) await prisma.catalogItem.update({ where: { id: itemId }, data: { coverUrl: null } });

    return NextResponse.json({ message: "Deleted" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
