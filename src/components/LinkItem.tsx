"use client";

import { GetLinkDataApiResponse, GetLinkDataApiResponseData } from "@/types";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { ChartLineUp } from "@phosphor-icons/react";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import { useLinksStore, useOverallEngagementGraphDataStore } from "@/lib/store";

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
      </div>
      <div className="flex flex-col">
        <Skeleton className="w-10 h-10 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}

async function fetchLinkData(id: string, hash: string) {
  const response = await fetch(`/api/get?id=${id}&hash=${hash}`, {
    method: "GET",
  });

  const responseData: GetLinkDataApiResponse = await response.json();

  return responseData;
}

export function LinkItem(props: Props): React.ReactNode {
  const [loading, setLoading] = useState(true);
  const { remove: removeLinkFromLocalStorage } = useLinksStore();
  const [data, setData] = useState<GetLinkDataApiResponseData | null>(null);
  const hasFetched = useRef(false);
  const [lastFetchTime, setLastFetchTime] = useState(0);

  const { add: addToOverallEngagementGraphData } =
    useOverallEngagementGraphDataStore();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (hasFetched.current) {
      return;
    }

    (async () => {
      setLoading(true);

      const responseData = await fetchLinkData(props.id, props.identifierHash);

      if (responseData.error) {
        removeLinkFromLocalStorage(props.id);
        toast.warning(`Removed dummy link (ID: ${props.id})`, {
          duration: 3000,
        });
        setLoading(false);
        return;
      }

      setData({
        ...responseData.data,
      });

      addToOverallEngagementGraphData([
        ...responseData.data.stats.totalRedirects.map((e) => {
          return {
            ...e,
            timestamp: new Date(e.timestamp),
          };
        }),
        ...responseData.data.stats.uniqueRedirects.map((e) => {
          return {
            ...e,
            timestamp: new Date(e.timestamp),
          };
        }),
      ]);

      setLastFetchTime(Date.now());

      hasFetched.current = true;
      setLoading(false);
    })(); // end of immediate function
  }, []); // end of useEffect

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        if (!data) return;

        const responseData = await fetchLinkData(
          props.id,
          props.identifierHash
        );

        if (responseData.error) return;

        const responseStats = {
          ...responseData.data.stats,
          totalRedirects: responseData.data.stats.totalRedirects.map(
            (entity) => {
              return {
                ...entity,
                timestamp: new Date(entity.timestamp),
              };
            }
          ),
          uniqueRedirects: responseData.data.stats.uniqueRedirects.map(
            (entity) => {
              return {
                ...entity,
                timestamp: new Date(entity.timestamp),
              };
            }
          ),
        };

        const stats = [
          ...responseStats.totalRedirects,
          ...responseStats.uniqueRedirects,
        ].filter((entity) => {
          return entity.timestamp.getTime() >= lastFetchTime;
        });

        setData({
          ...data,
          stats: { ...responseData.data.stats },
        });

        addToOverallEngagementGraphData(stats);

        setLastFetchTime(Date.now());
      } catch {}
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  });

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
