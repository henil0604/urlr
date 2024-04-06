import { prisma } from "@/db";
import { NextResponse } from "next/server";

type Params = {
  linkId: string;
};

export const GET = async (req: Request, ctx: { params: Params }) => {
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

  return NextResponse.redirect(link.url, { status: 301 });
};
