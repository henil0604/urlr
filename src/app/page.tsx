"use client";

import { CreateForm } from "@/components/CreateForm";
import { LinkItem } from "@/components/LinkItem";
import { StatisticsChart } from "@/components/StatisticsChart";
import { LocalStorageKeyName } from "@/const";
import { overallEngagementGraphDataAtom } from "@/lib/store";
import { useLocalStorage, useMediaQuery } from "@uidotdev/usehooks";
import { timeStamp } from "console";
import { useAtom } from "jotai";
import moment from "moment";
import { useEffect } from "react";

function Header(): React.ReactNode {
  return (
    <div className="w- flex flex-col items-center justify-center">
      <div className="text-3xl font-bold">URL Redirector</div>
      <div className="text-muted-foreground text-sm">
        no more loooooong URLs
      </div>
    </div>
  );
}

function Sidebar(props: {
  addLinkToLocalStorage: (id: string, identifierHash: string) => any;
}): React.ReactNode {
  return (
    <div className="border border-gray-300 rounded-lg shadow px-4 pt-14 pb-8 max-lg:py-8 max-w-fit max-lg:min-w-full">
      <Header />
      <div className="my-8" />

      <CreateForm addLinkToLocalStorage={props.addLinkToLocalStorage} />
    </div>
  );
}

export default function Home() {
  "use client";
  const [links, setLinks] = useLocalStorage<{ [key: string]: string }>(
    LocalStorageKeyName,
    {}
  );

  const [overallEngagementGraphData, setOverallEngagementGraphData] = useAtom(
    overallEngagementGraphDataAtom
  );

  const isMediumDevice = useMediaQuery("only screen and (max-width : 992px)");
  function addLinkToLocalStorage(id: string, identifierHash: string) {
    const previousItems = links;

    previousItems[id] = identifierHash;

    setLinks(previousItems);
  }

  return (
    <main className="w-screen flex gap-10 max-lg:flex-col py-20 px-32 max-lg:py-10 max-lg:px-6">
      {/* Sidebar */}
      <div className="w-fit pt-11 max-lg:w-full h-fit">
        <Sidebar addLinkToLocalStorage={addLinkToLocalStorage} />
      </div>

      <div className="flex-grow">
        <div className="w-full h-fit">
          <StatisticsChart
            title="Overall Engagement"
            height={isMediumDevice ? 250 : 500}
            data={overallEngagementGraphData}
          />
          <div className="font-semibold text-md">Your Links</div>
          <div className="my-2"></div>
          <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-4">
            {Object.keys(links).map((id) => {
              return <LinkItem key={id} id={id} identifierHash={links[id]} />;
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
