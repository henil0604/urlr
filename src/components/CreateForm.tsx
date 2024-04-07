"use client";
// TODO: Loading State

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { randomString, validateURL } from "@/lib/utils";
import { Shuffle } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useLinksStore } from "@/lib/store";
import { CreateLinkApiResponse } from "@/types";
import { LoadingSpinner } from "./LoadingSpinner";

export function CreateForm(): React.ReactNode {
  const inputRef = useRef<HTMLInputElement>(null);
  const urlIdRef = useRef<HTMLInputElement>(null);
  const { add: addLinkToLocalStorage } = useLinksStore();
  const [urlId, setUrlId] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleOnCreate() {
    const value = inputRef.current!.value.trim();

    inputRef.current!.value = value;

    if (validateURL(value) == false) {
      toast.error("Invalid URL", {
        dismissible: true,
        duration: 2000,
      });
      return;
    }

    if (urlId.trim() === "") {
      toast.error("Please Enter ", {
        dismissible: true,
        duration: 2000,
      });
      return;
    }

    setLoading(true);

    const response = await fetch("/api/create", {
      method: "POST",
      body: JSON.stringify({
        url: value,
        urlId: urlId,
      }),
    });

    const responseData: CreateLinkApiResponse = await response.json();

    if (responseData.error === true) {
      toast.error(responseData.message, {});
      setLoading(false);
      return;
    }

    addLinkToLocalStorage(
      responseData.data.id,
      responseData.data.identifierHash
    );

    toast.success("Link created successfully", {
      dismissible: true,
    });

    inputRef.current!.value = "";
    urlIdRef.current!.value = "";
    setUrlId("");

    setLoading(false);
  }

  function setRandomURLId() {
    setUrlId(randomString(4));
  }

  return (
    <>
      {loading && (
        <div className="absolute bg-white z-[100] flex flex-col gap-2 justify-center items-center top-0 left-0 w-full h-full">
          <LoadingSpinner />
          <div>Working on it...</div>
        </div>
      )}
      <div className="max-w-fit max-lg:min-w-full flex justify-center items-center">
        <div className="w-full flex justify-center items-center flex-col gap-6">
          {/* url input */}
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="url">URL</Label>
            <Input
              ref={inputRef}
              type="url"
              id="url"
              placeholder="Enter your loooong looooong url"
              className="w-[400px] max-lg:w-full"
            />
          </div>

          {/* id */}
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="urlId">id</Label>
            <div className="relative">
              <Input
                type="text"
                id="urlId"
                placeholder="Tailor your link ID (eg. my-link)"
                value={urlId}
                ref={urlIdRef}
                className="w-[400px] max-lg:w-full"
                onInput={(event) => {
                  setUrlId((event.target as HTMLInputElement).value);
                }}
              />

              <div className="absolute top-0 right-0 h-full p-1">
                <Button
                  onClick={setRandomURLId}
                  variant="default"
                  className="w-fit h-full p-2"
                >
                  <Shuffle />
                </Button>
              </div>
            </div>
            {urlId.trim() !== "" && (
              <Label className="text-muted-foreground text-sm">
                {location.origin}/{urlId}
              </Label>
            )}
          </div>

          {/* submit button */}
          <Button className="w-full" onClick={handleOnCreate}>
            Create
          </Button>
        </div>
      </div>
    </>
  );
}
