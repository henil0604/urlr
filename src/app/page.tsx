"use client";

import { CreateForm } from "@/components/CreateForm";
import { LinkItem } from "@/components/LinkItem";
import { StatisticsChart } from "@/components/StatisticsChart";
import { LocalStorageKeyName } from "@/const";
import { overallEngagementGraphDataAtom } from "@/lib/store";
// import useLocalStorage from "@/lib/useLocalStorage";
import { useMediaQuery, useLocalStorageValue } from "@react-hookz/web";
import { useAtom } from "jotai";
import { Suspense, useCallback, useEffect, useState } from "react";

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

  const [links, setLinks] = useState<Record<string, string>>({});

  //   const {
  //     value: linksFromLocalStorage,
  //     set: setLinksToLocalStorage,
  //     fetch: fetchLinks,
  //   } = useLocalStorageValue<{ [key: string]: string }>(LocalStorageKeyName, {
  //     defaultValue: {},
  //     initializeWithValue: true,
  //   });

  //   const links: { [key: string]: string } = {
  //     drive: "sgQ0rfPMcpRLvo4SHenFoOa15AovAYf5i8LesaABZvSGtQ0wkcmDVLdTobPXh1jy",
  //   };

  const fetchLinksFromLocalStorage = () => {
    initLocalStorage();

    const localLinks = localStorage.getItem(LocalStorageKeyName) || "{}";

    return JSON.parse(localLinks) as Record<string, string>;
  };

  const initLocalStorage = () => {
    if (!localStorage.getItem(LocalStorageKeyName)) {
      localStorage.setItem(LocalStorageKeyName, "{}");
    }
  };

  useEffect(() => {
    initLocalStorage();
    setLinks(fetchLinksFromLocalStorage());
  }, []);

  const [overallEngagementGraphData, setOverallEngagementGraphData] = useAtom(
    overallEngagementGraphDataAtom
  );

  const isMediumDevice = useMediaQuery("only screen and (max-width : 992px)");
  function addLinkToLocalStorage(id: string, identifierHash: string) {
    initLocalStorage();
    const newLinks = structuredClone(links) || {};
    newLinks[id] = identifierHash;
    localStorage.setItem(LocalStorageKeyName, JSON.stringify(newLinks));
    setLinks(fetchLinksFromLocalStorage());
  }

  return (
    <main className="w-screen flex gap-10 max-lg:flex-col py-20 px-32 max-lg:py-10 max-lg:px-6">
      {/* Sidebar */}
      <div className="w-fit pt-11 max-lg:w-full h-fit">
        <Sidebar addLinkToLocalStorage={addLinkToLocalStorage} />
      </div>

      <div className="flex-grow">
        <div className="w-full h-fit">
          <Suspense fallback={<div>Loading...</div>}>
            <StatisticsChart
              title="Overall Engagement"
              height={isMediumDevice ? 250 : 500}
              data={overallEngagementGraphData}
            />
          </Suspense>
          <div className="font-semibold text-md">Your Links</div>
          <div className="my-2"></div>
          <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-4">
            <>
              {Object.keys(links).map((id) => {
                return (
                  <Suspense key={links[id]} fallback={<div>Loading...</div>}>
                    <LinkItem id={id} identifierHash={links[id]} />
                  </Suspense>
                );
              })}
            </>
          </div>
        </div>
      </div>
    </main>
  );
}
