import { PrismaClient } from "@/lib/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
    function monthsToDurationPlan(n: number) {
      if (n <= 1) return "ONE_MONTH";
      if (n <= 6) return "SIX_MONTHS";
      if (n <= 12) return "ONE_YEAR";
      return undefined;
    }
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get("channelId");
    const id = searchParams.get("id");
    if (id) {
      try {
        const sub = await prisma.subscription.findUnique({
          where: { id: Number(id) } as any,
          include: { user: true, channel: true },
        });
        if (!sub)
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({ subscription: sub });
      } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
      }
    }

    if (channelId) {
      const cid = Number(channelId);
      try {
        const subs = await prisma.subscription.findMany({
          where: { channelId: cid },
          include: { user: true },
        });
        return NextResponse.json({ subscriptions: subs });
      } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
      }
    }

    try {
      const subs = await prisma.subscription.findMany({
        include: { user: true, channel: true },
        orderBy: { startDate: "desc" },
      });
      return NextResponse.json({ subscriptions: subs });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();


    console.log(body)
    if (!body || !Array.isArray(body))
      return NextResponse.json(
        { error: "channelId required" },
        { status: 400 }
      );
    // const channelIdNum = Number(channelId);
    // if (!Number.isFinite(channelIdNum))
    //   return NextResponse.json({ error: "Invalid channelId" }, { status: 400 });

    // const durationNum = Number(durationMonths ?? 1);
    // if (!Number.isFinite(durationNum) || durationNum <= 0)
    //   return NextResponse.json(
    //     { error: "Invalid durationMonths" },
    //     { status: 400 }
    //   );

    // const start = providedStart ? new Date(providedStart) : new Date();
    // const end = new Date(start);
    // end.setMonth(end.getMonth() + durationNum);


    // const durationEnum = monthsToDurationPlan(durationNum);

    // resolve user from Authorization header (do NOT accept userId/userEmail from request body)
     // data: {
        //   channelId: channelIdNum,
        //   credit: typeof credit === "number" ? credit : Number(credit ?? 0),
        //   code: providedCode,
        //   duration: durationEnum as any,
        //   startDate: start,
        //   endDate: end,

        // },
    try {
      const created = await prisma.subscription.createMany({
        data: body.map((e) => {
          const durationNum = Number(e.durationMonths ?? 1);
          if (!Number.isFinite(durationNum) || durationNum <= 0) {
            throw new Error("Invalid durationMonths");
          }
          const channelIdNum = Number(e.channelId);
          if (!Number.isFinite(channelIdNum)) {
            throw new Error("Invalid channelId");
          }
          const start = new Date();
          const end = new Date(start);
          end.setMonth(end.getMonth() + durationNum);
          const durationEnum = monthsToDurationPlan(durationNum);

          return {
            channelId: channelIdNum,
            credit: typeof e.credit === "number" ? e.credit : Number(e.credit ?? 0),
            code: e.code,
            duration: durationEnum as any,
            startDate: start,
            endDate: end,
            // userId: resolved userId, add if needed
          };
        }),
      });
      return NextResponse.json({ createdCount: created.count }, { status: 201 });
    } catch (err: any) {
      console.log(err);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  } catch (err: any) {
    console.log(err)
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, code, credit, durationMonths, startDate, endDate, status } =
      body || {};
       const durationEnum = monthsToDurationPlan(durationMonths);
    const subId = Number(id);
    if (!Number.isFinite(subId))
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    try {
      const updateData: any = {};
      if (typeof code === "string") updateData.code = code;
      if (typeof credit !== "undefined") updateData.credit = Number(credit);
      if (typeof durationMonths !== "undefined") {
        const end = new Date(startDate ? new Date(startDate) : new Date());
        end.setMonth(end.getMonth() + Number(durationMonths));
        updateData.endDate = end;
        updateData.duration = durationEnum as any;
      }
      if (typeof status === "string") updateData.status = status;

      const updated = await prisma.subscription.update({
        where: { id: subId } as any,
        data: updateData,
      });
      return NextResponse.json({ subscription: updated });
    } catch (err: any) {

      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("id");
    const codeParam = searchParams.get("code");
    if (!idParam && !codeParam)
      return NextResponse.json(
        { error: "id or code required" },
        { status: 400 }
      );

    try {
      if (idParam)
        await prisma.subscription.delete({
          where: { id: Number(idParam) } as any,
        });
      else
        await prisma.subscription.delete({
          where: { code: codeParam as string } as any,
        });
      return NextResponse.json({ message: "Deleted" });
    } catch (err: any) {

      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
