import { NextResponse } from "next/server";
import { prisma } from "@/db";
import { randomString, validateURL } from "@/lib/utils";

async function generateId(length: number, tries: number = 0) {
  if (tries > 3) {
    length++;
  }

  const id = randomString(length);

  const link = await prisma.link.findFirst({
    where: {
      id: id,
    },
  });

  if (link !== null) {
    // id already exists
    return await generateId(length, tries + 1);
  }

  // id is unique
  return id;
}

async function isUrlIdAvailable(id: string) {
  const link = await prisma.link.findFirst({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (link) {
    return false;
  }

  return true;
}

export async function POST(req: Request) {
  const {
    url,
    urlId,
  }: {
    url: string;
    urlId: string;
  } = await req.json();

  if (!urlId.trim()) {
    return NextResponse.json(
      {
        error: true,
        message: "Invalid URL Id",
      },
      {
        status: 400,
      }
    );
  }

  if (validateURL(url) == false) {
    return NextResponse.json(
      {
        error: true,
        message: "Invalid URL",
      },
      {
        status: 400,
      }
    );
  }

  if ((await isUrlIdAvailable(urlId)) === false) {
    return NextResponse.json({
      error: true,
      message: "URL Id is not available, please choose another ID",
    });
  }

  const link = await prisma.link.create({
    data: {
      url: url,
      id: urlId,
      identifierHash: randomString(64),
    },
  });

  return NextResponse.json(
    {
      error: false,
      message: "Link created successfully",
      data: {
        id: link.id,
        url: link.url,
        identifierHash: link.identifierHash,
      },
    },
    { status: 200 }
  );
}
