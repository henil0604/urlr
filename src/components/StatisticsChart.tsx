"use client";

import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { type ApexOptions } from "apexcharts";
import moment from "moment";
import { useEffect } from "react";

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
      .format("MMM DD");
    labels.push(label);
  }

  return labels.reverse();
}

type TransformedData = {
  name: string;
  data: number[];
}[];

function transformDataByDayWise(
  data: Props["data"],
  minimumDataArrayLength: number
): TransformedData {
  "use client";

  data = data.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  const transformedData: {
    [key: string]: /* name */ {
      [key: number]: /* date */ number /* count */;
    };
  } = {};

  for (const entity of data) {
    const momentTime = moment(entity.timestamp);

    if (!transformedData[entity.name]) {
      transformedData[entity.name] = [];
    }

    if (!transformedData[entity.name][momentTime.date()]) {
      transformedData[entity.name][momentTime.date()] = 0;
    }

    transformedData[entity.name][momentTime.date()] += 1;
  }

  const filteredTransformData: TransformedData = [];

  for (const name in transformedData) {
    const data: number[] = [];
    for (const date in transformedData[name]) {
      data.push(transformedData[name][date]);
    }
    filteredTransformData.push({ name, data });
  }

  for (const entity of filteredTransformData) {
    if (entity.data.length < minimumDataArrayLength === false) {
      continue;
    }

    const diff = minimumDataArrayLength - entity.data.length;

    for (let i = 0; i < diff; i++) {
      entity.data.unshift(0);
    }
  }

  return filteredTransformData;
}

export function StatisticsChart(
  props: Props = {
    data: [],
    height: "100%",
  }
) {
  const DAYS = 7;

  const xAxis = generateXAxis(DAYS);

  const data = transformDataByDayWise(props.data, DAYS) || [];

  const options: ApexOptions = {
    chart: {
      height: props.height,
      type: "line",
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true,
      },
      toolbar: {
        autoSelected: "pan",
      },
    },
    stroke: {
      curve: "straight",
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
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
    },
    dataLabels: {
      enabled: false,
    },
  };

  return (
    <div className="min-w-full">
      <ApexChart
        options={options}
        series={data}
        width={props.width || "100%"}
        height={props.height || "100%"}
        type={options.chart?.type}
      />
    </div>
  );
}
