import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import { PrismaClient } from "@/lib/generated/prisma";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

const prisma = new PrismaClient();
const FOLDER = "/projects/SmartSatTV/channelsIPTV/IPTVLogo";

async function toBase64FromFormFile(file: FormDataEntryValue | null): Promise<string> {
  if (!file) throw new Error("No file provided");
  if (file instanceof Blob) {
    const buffer = Buffer.from(await file.arrayBuffer());
    return buffer.toString("base64");
  }
  return file.toString();
}

function fileNameFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/");
    return parts[parts.length - 1] || null;
  } catch {
    return null;
  }
}

async function resolveFileId({ fileId, logoUrl }: { fileId?: string | null; logoUrl?: string | null }) {
  if (fileId) return fileId;
  if (!logoUrl) return null;
  const name = fileNameFromUrl(logoUrl);
  if (!name) return null;
  const found = await imagekit.listFiles({
    path: FOLDER.replace(/^\//, ""),
    name,
    limit: 1,
  });
  return found && found.length ? found[0].fileId : null;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const fileName = (formData.get("fileName") as string) || `logo_${Date.now()}.png`;

    const fileData = await toBase64FromFormFile(file);
    const uploadResponse = await imagekit.upload({
      file: fileData,
      fileName,
      folder: FOLDER,
    });

    return NextResponse.json({
      message: "Uploaded successfully",
      logoUrl: uploadResponse.url,
      fileId: uploadResponse.fileId,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const channelId = Number(formData.get("channelId"));
    if (!Number.isFinite(channelId)) {
      return NextResponse.json({ error: "Invalid channelId" }, { status: 400 });
    }
    const file = formData.get("file");
    const fileName = (formData.get("fileName") as string) || `logo_${channelId}_${Date.now()}.png`;
    const oldFileId = (formData.get("oldFileId") as string) || undefined;
    const oldLogoUrl = (formData.get("oldLogoUrl") as string) || undefined;

    const fileData = await toBase64FromFormFile(file);
    const uploadResponse = await imagekit.upload({ file: fileData, fileName, folder: FOLDER });

    const updated = await prisma.iPTVChannel.update({
      where: { id: channelId },
      data: { logo: uploadResponse.url },
    });

    try {
      const resolvedId = await resolveFileId({ fileId: oldFileId, logoUrl: oldLogoUrl || updated.logo || undefined });
      if (resolvedId) await imagekit.deleteFile(resolvedId);
    } catch {}

    return NextResponse.json({ message: "Logo updated", logoUrl: uploadResponse.url, fileId: uploadResponse.fileId, channel: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const idParam = url.searchParams.get("channelId");
    const body = await request.json().catch(() => null);
    const channelId = Number(idParam || (body && body.channelId));
    const fileId = (url.searchParams.get("fileId") || (body && body.fileId)) as string | undefined;
    const logoUrl = (url.searchParams.get("logoUrl") || (body && body.logoUrl)) as string | undefined;

    let toDeleteId: string | null = null;
    if (fileId) toDeleteId = fileId;

    let channelLogoUrl: string | null = null;
    if (Number.isFinite(channelId)) {
      const channel = await prisma.iPTVChannel.findUnique({ where: { id: channelId } });
      channelLogoUrl = channel?.logo || null;
    }
    const resolvedId = await resolveFileId({ fileId: toDeleteId || undefined, logoUrl: logoUrl || channelLogoUrl || undefined });
    if (resolvedId) await imagekit.deleteFile(resolvedId);

    if (Number.isFinite(channelId)) {
      await prisma.iPTVChannel.update({ where: { id: channelId }, data: { logo: null } });
    }

    return NextResponse.json({ message: "Logo deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
