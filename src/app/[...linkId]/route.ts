import { prisma } from "@/db";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  linkId: string;
};

export const GET = async (req: NextRequest, ctx: { params: Params }) => {
  let { linkId } = ctx.params;

  linkId = Array.isArray(linkId) ? linkId.join("/") : linkId;

  const link = await prisma.link.findFirst({
    where: {
      id: linkId,
    },
  });

  // if not link
  if (!link) {
    return new NextResponse("Link not found", { status: 404 });
  }

  const ip = (req.headers.get("x-forwarded-for") ?? "127.0.0.1").split(",")[0];

  console.log("ip?", ip);
  await prisma.linkRedirects.create({
    data: {
      ip: ip,
      link: {
        connect: {
          id: linkId,
        },
      },
    },
  });

  return NextResponse.redirect(link.url, {
    status: 301,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
};
