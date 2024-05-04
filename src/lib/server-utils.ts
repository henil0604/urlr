import { prisma } from '@/db';

export async function calculateLinkStatistics(id: string) {
	const totalRedirects = await prisma.linkRedirects.findMany({
		where: {
			linkId: id,
		},
		select: {
			ip: true,
			createdAt: true,
		},
	});

	const uniqueRedirects = Array.from(
		totalRedirects
			.filter((e) => e.ip !== null)
			.reduce((uniq, curr) => {
				const ip = curr['ip'];
				if (!ip) {
					return uniq;
				}
				if (!uniq.has(ip)) {
					uniq.set(ip, curr);
				}
				return uniq;
			}, new Map<string, (typeof totalRedirects)[number]>()),
	).map((e) => e[1]);

	return {
		totalRedirects: totalRedirects.map((e) => {
			return {
				name: 'Redirects',
				timestamp: e.createdAt.getTime(),
			};
		}),
		uniqueRedirects: uniqueRedirects.map((e) => {
			return {
				name: 'Unique Visitors',
				timestamp: e.createdAt.getTime(),
			};
		}),
		totalCounts: totalRedirects.length,
		uniqueCounts: uniqueRedirects.length,
	};
}
