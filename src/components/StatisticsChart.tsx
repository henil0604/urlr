'use client';

import dynamic from 'next/dynamic';
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { type ApexOptions } from 'apexcharts';
import moment from 'moment';

type Props = {
	data: {
		timestamp: Date;
		name: string;
	}[];
	title?: string;
	width?: string | number;
	height?: string | number;
};

function generateXAxis(days = 7) {
	const labels: string[] = [];

	for (let i = 0; i < days; i++) {
		const label = moment()
			.subtract({
				days: i,
			})
			.format('MMM DD');
		labels.push(label);
	}

	return labels.reverse();
}

type TransformedData = {
	name: string;
	data: number[];
}[];

function transformDataByDayWise(
	data: Props['data'],
	minimumDataArrayLength: number = 7
): TransformedData {
	'use client';

	const transformedData: TransformedData = [];

	for (let i = 0; i < data.length; i++) {
		let entity = data[i];

		let dataPointEntity = transformedData.find(
			(e) => e.name === entity.name
		);

		if (!dataPointEntity) {
			transformedData.push({
				name: entity.name,
				data: new Array(minimumDataArrayLength).fill(0),
			});
			dataPointEntity = transformedData.find(
				(e) => e.name === entity.name
			);
		}
		let timestamp = moment(entity.timestamp);
		let pointIndex = moment().date() - timestamp.date();
		dataPointEntity!.data[minimumDataArrayLength - 1 - pointIndex]++;
	}

	return transformedData;
}

export function StatisticsChart(
	props: Props = {
		data: [],
		height: '100%',
	}
) {
	const DAYS = 7;

	const xAxis = generateXAxis(DAYS);

	const data = transformDataByDayWise(props.data, DAYS) || [];

	const options: ApexOptions = {
		chart: {
			height: props.height,
			type: 'line',
			zoom: {
				type: 'x',
				enabled: true,
				autoScaleYaxis: true,
			},
			toolbar: {
				autoSelected: 'pan',
			},
		},
		stroke: {
			curve: 'straight',
			width: 3,
		},
		title: {
			text: props.title,
		},
		xaxis: {
			categories: xAxis,
		},
		grid: {
			row: {
				colors: ['#f3f3f3', 'transparent'],
				opacity: 0.5,
			},
		},
		dataLabels: {
			enabled: false,
		},
	};

	return (
		<>
			<div className="min-w-full rounded-md">
				{props.data.length === 0 ? (
					<div
						className="border px-2 rounded py-2 flex flex-col gap-4"
						style={{
							width: props.width || '100%',
							height: props.height || '100%',
						}}
					>
						<div className="font-semibold">{props.title}</div>
						<div className="flex justify-center flex-col items-center w-full h-full">
							<div className="text-muted-foreground">
								Not Enough Data
							</div>
							<div className="text-xs text-muted-foreground tracking-tight">
								Start sharing your links
							</div>
						</div>
					</div>
				) : (
					<ApexChart
						options={options}
						series={data}
						width={props.width || '100%'}
						height={props.height || '100%'}
						type={options.chart?.type}
					/>
				)}
			</div>
		</>
	);
}
