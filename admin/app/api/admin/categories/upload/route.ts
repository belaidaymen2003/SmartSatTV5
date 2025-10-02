import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData(); 
    console.log(formData);
       const file = formData.get("file");     // This will be a Blob or string
    const fileName = formData.get("fileName") as string; // base64 string or remote URL
     // original file name
    console.log( file, fileName);
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

        let fileData: string;
    if (file instanceof Blob) {
      const buffer = Buffer.from(await file.arrayBuffer());
      fileData = buffer.toString("base64");
    } else {
      fileData = file.toString();
    }
    const uploadResponse = await imagekit.upload({
      file: fileData,   // base64 string or URL
      fileName,
      folder: "/projects/SmartSatTV/channelsIPTV/IPTVLogo",      // optional
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
