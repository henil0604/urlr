import { prisma } from "@/db";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  linkId: string;
};

export const GET = async (req: NextRequest, ctx: { params: Params }) => {
  const { linkId } = ctx.params;

  const link = await prisma.link.findFirst({
    where: {
      id: linkId,
    },
  });

  // if not link
  if (!link) {
    return new NextResponse("Link not found", { status: 404 });
  }

  await prisma.linkRedirects.create({
    data: {
      ip: req.ip,
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
