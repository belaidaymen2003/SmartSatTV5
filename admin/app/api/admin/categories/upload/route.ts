import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import { PrismaClient } from "@/lib/generated/prisma";


const hasImagekit = Boolean(process.env.IMAGEKIT_PRIVATE_KEY && process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_URL_ENDPOINT)
let imagekit: any = null
if (hasImagekit) {
  imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
  });
}

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
  if (!hasImagekit) return null;
  const name = fileNameFromUrl(logoUrl);
  if (!name) return null;
  const found = await imagekit.listFiles({
    path: FOLDER.replace(/^\//, ""),
    name,
    limit: 1,
  });
    if (found && found.length) {
    const file = found[0];
    if ('fileId' in file) {
      return file.fileId;
    }
  }

  return false;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const fileName = (formData.get("fileName") as string) || `logo_${Date.now()}.png`;

    const fileData = await toBase64FromFormFile(file);
    if (hasImagekit && imagekit) {
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
    }

    // fallback: return data URL and store minimal record in mock DB
    const dataUrl = `data:image/png;base64,${fileData}`

    // no tracking of files for now
    return NextResponse.json({ message: 'Uploaded (mock)', logoUrl: dataUrl, fileId: null })
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
    console.log("formData",formData)
    const fileData = await toBase64FromFormFile(file);
    if (hasImagekit && imagekit) {
      const uploadResponse = await imagekit.upload({ file: fileData, fileName, folder: FOLDER });
      

      // const updated = await prisma.iPTVChannel.update({
      //   where: { id: channelId },
      //   data: { logo: uploadResponse.url },
      // });

      try {
        const resolvedId = await resolveFileId({ fileId: oldFileId, logoUrl: oldLogoUrl});
        if (resolvedId) await imagekit.deleteFile(resolvedId);
      } catch(err: any) {
        console.log(err)

      }

      return NextResponse.json({
        message: "Logo updated",
        logoUrl: uploadResponse.url,
        fileId: uploadResponse.fileId,
        // channel: updated,
      });
    }

    // fallback: store data URL in mock DB and update channel record in mock
    const dataUrl = `data:image/png;base64,${fileData}`
    try {
      const updated = await prisma.iPTVChannel.update({ where: { id: channelId }, data: { logo: dataUrl } })
      return NextResponse.json({ message: 'Logo updated (db)', logoUrl: dataUrl, fileId: null, channel: updated })
    } catch (err: any) {
 
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
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
      try {
        const channel = await prisma.iPTVChannel.findUnique({ where: { id: channelId } });
        channelLogoUrl = channel?.logo || null;
      } catch (_) {

      }
    }

    if (hasImagekit && imagekit) {
      const resolvedId = await resolveFileId({ fileId: toDeleteId || undefined, logoUrl: logoUrl || channelLogoUrl || undefined });
      if (resolvedId) await imagekit.deleteFile(resolvedId);

      if (Number.isFinite(channelId)) {
        await prisma.iPTVChannel.update({ where: { id: channelId }, data: { logo: null } });
      }

      return NextResponse.json({ message: "Logo deleted" });
    }

    // fallback mock delete
    try {
      if (Number.isFinite(channelId)) {
        const updated = await prisma.iPTVChannel.update({ where: { id: channelId }, data: { logo: null } })
        return NextResponse.json({ message: 'Logo deleted (db)' })
      }
    } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Nothing deleted' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

}
