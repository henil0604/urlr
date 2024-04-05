import { NextResponse } from "next/server";
import { prisma } from "@/db";

export async function POST(req: Request) {
  const { url } = await req.json();

  return NextResponse.json({}, { status: 200 });
}
