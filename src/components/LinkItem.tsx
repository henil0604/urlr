"use client";

import { GetLinkDataApiResponse, GetLinkDataApiResponseData } from "@/types";
import { Suspense, useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { ChartLineUp } from "@phosphor-icons/react";
import QRCode from "react-qr-code";
import { useAtom } from "jotai";
import { overallEngagementGraphDataAtom } from "@/lib/store";

type Props = {
  id: string;
  identifierHash: string;
};

function SkeletonItem() {
  return (
    <div className="p-3 w-full flex gap-4 rounded-lg border border-gray-400 ">
      {/* QR */}
      <div className="min-w-fit flex flex-col gap-2">
        <Skeleton className="aspect-square min-w-40 bg-gray-200" />
        <div className="flex gap-2">
          <Skeleton className="w-[70%] h-5 bg-gray-200" />
        </div>
      </div>
      {/* Link */}
      <div className="flex-grow flex flex-col py-0 w-full gap-4 pr-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="w-[15%] h-4 bg-gray-200" />
          <Skeleton className="w-[55%] h-5 bg-gray-200" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="w-[25%] h-4 bg-gray-200" />
          <Skeleton className="w-[85%] h-5 bg-gray-200" />
        </div>

        <div className="grid grid-cols-2">
          <div className="flex flex-col gap-2">
            <Skeleton className="w-[70%] h-4 bg-gray-200" />
            <Skeleton className="w-[20%] h-5 bg-gray-200" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="w-[70%] h-4 bg-gray-200" />
            <Skeleton className="w-[20%] h-5 bg-gray-200" />
          </div>
        </div>
        {/* <div className="flex flex-col w-full">
		<div className="font-semibold text-sm">Original URL</div>

		<a
		  href="https://drive.google.com/drive/folders/1awtqAclDKijQE0V0Zek0-B78a8F9uNX0"
		  target="_blank"
		  className="w-[70%] h-fit text-sm underline underline-offset-4 text-ellipsis overflow-hidden whitespace-nowrap"
		>
		  https://drive.google.com/drive/folders/1awtqAclDKijQE0V0Zek0-B78a8F9uNX0
		</a>
	  </div> */}
      </div>
      <div className="flex flex-col">
        <Skeleton className="w-10 h-10 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}

export function LinkItem(props: Props): React.ReactNode {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<GetLinkDataApiResponseData | null>(null);
  const hasFetched = useRef(false);
  const [overallEngagementGraphData, setOverallEngagementGraphData] = useAtom(
    overallEngagementGraphDataAtom
  );

  useEffect(() => {
    if (hasFetched.current) {
      return;
    }

    setLoading(true);

    fetch(`/api/get?id=${props.id}&hash=${props.identifierHash}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then(async (response: GetLinkDataApiResponse) => {
        if (response.error === true) {
          // TODO: handle error
          return;
        }

        setData({
          ...response.data,
        });

        setLoading(false);

        console.log(response.data);
        setOverallEngagementGraphData((data) => {
          return [
            ...data,
            ...response.data.stats.totalRedirects.map((e) => {
              return {
                ...e,
                timestamp: new Date(e.timestamp),
              };
            }),
            ...response.data.stats.uniqueRedirects.map((e) => {
              return {
                ...e,
                timestamp: new Date(e.timestamp),
              };
            }),
          ];
        });

        hasFetched.current = true;
      });
  }, []);

  return loading || !data ? (
    <SkeletonItem />
  ) : (
    <div className="p-3 w-full flex gap-4 rounded-lg border border-gray-400 text-black">
      {/* QR */}
      <div className="flex-grow-0 min-w-fit flex flex-col gap-2">
        <div className="aspect-square max-w-40">
          <QRCode
            value={`${location.origin}/${data.id}`}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          />
        </div>
        <div className="flex gap-2">
          <span className="text-muted-foreground italic text-sm">
            {moment(data.createdAt).fromNow()}
          </span>
        </div>
      </div>
      <div className="flex-grow flex flex-col py-0 w-fit gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold">Shorten Link</p>
          <a
            href={`${location.origin}/${data.id}`}
            target="_blank"
            className="w-[70%] h-fit text-sm underline underline-offset-4 text-ellipsis overflow-hidden whitespace-nowrap"
          >
            {`${location.origin}/${data.id}`}
          </a>
        </div>

        <div className="w-[250px] flex flex-col gap-1">
          <p className="text-xs font-semibold w-fit">Original URL</p>
          <a
            href={data.url}
            target="_blank"
            className="w-full h-fit text-sm underline underline-offset-4 overflow-hidden text-nowrap text-ellipsis"
          >
            {data.url}
          </a>
        </div>

        <div className="grid grid-cols-2">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold">Redirects</p>
            <p>{data.stats.totalCounts}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold">Unique Visitors</p>
            <p>{data.stats.uniqueCounts}</p>
          </div>
        </div>
      </div>
      <div className="flex-grow-0 flex flex-col">
        <Button variant="outline" className="w-fit h-fit rounded-full p-2">
          <ChartLineUp size={20} />
        </Button>
      </div>
    </div>
  );
}
