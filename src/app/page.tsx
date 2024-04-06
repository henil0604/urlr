"use client";

import { CreateForm } from "@/components/CreateForm";
import { LocalStorageKeyName } from "@/const";
import { useLocalStorage } from "@uidotdev/usehooks";

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
    <div className="border border-gray-300 rounded-lg shadow px-4 pt-14 pb-8 max-md:py-8 max-w-fit max-md:min-w-full">
      <Header />
      <div className="my-8" />

      <CreateForm addLinkToLocalStorage={props.addLinkToLocalStorage} />
    </div>
  );
}

export default function Home() {
  "use client";
  const [links, setLinks] = useLocalStorage<
    { id: string; identifierHash: string }[]
  >(LocalStorageKeyName, []);

  function addLinkToLocalStorage(id: string, identifierHash: string) {
    const previousItems = links;

    previousItems.push({
      id,
      identifierHash,
    });

    setLinks(previousItems);
  }

  return (
    <main className="w-screen flex max-md:flex-col py-28 px-32 max-md:py-10 max-md:px-6">
      {/* Sidebar */}
      <Sidebar addLinkToLocalStorage={addLinkToLocalStorage} />
    </main>
  );
}
