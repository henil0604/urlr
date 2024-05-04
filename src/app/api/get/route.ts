import { prisma } from '@/db';
import { NextRequest, NextResponse } from 'next/server';
import { calculateLinkStatistics } from '@/lib/server-utils';
import { GetLinkDataApiResponse } from '@/types';

export const GET = async (req: NextRequest) => {
	const id = req.nextUrl.searchParams.get('id');
	const identifierHash = req.nextUrl.searchParams.get('hash');

	if (!id) {
		return NextResponse.json(
			{
				error: true,
				message: 'ID not found in query params',
			},
			{
				status: 400,
			},
		);
	}

	if (!identifierHash) {
		return NextResponse.json(
			{
				error: true,
				message: 'Hash not found in query params',
			},
			{
				status: 400,
			},
		);
	}

	const link = await prisma.link.findFirst({
		where: {
			id,
			identifierHash,
		},
	});

	if (!link) {
		return NextResponse.json(
			{
				error: true,
				message: 'Link not found',
			},
			{
				status: 404,
			},
		);
	}

	const stats = await calculateLinkStatistics(id);

	return NextResponse.json(
		{
			error: false,
			message: 'Link found',
			data: {
				id: link.id,
				url: link.url,
				stats: stats,
				createdAt: link.createdAt.getTime(),
			},
		} as GetLinkDataApiResponse,
		{
			headers: {
				'Cache-Control': 'no-store, max-age=0',
			},
		},
	);
};
