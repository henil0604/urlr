"use client";
// TODO: Loading State

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  FormEvent,
  FormEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { randomString, validateURL } from "@/lib/utils";
import { Shuffle } from "@phosphor-icons/react";
import { toast } from "sonner";

export function CreateForm(props: {
  addLinkToLocalStorage: (id: string, identifierHash: string) => any;
}): React.ReactNode {
  const inputRef = useRef<HTMLInputElement>(null);
  const [urlId, setUrlId] = useState("");

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

    const response = await fetch("/api/create", {
      method: "POST",
      body: JSON.stringify({
        url: value,
        urlId: urlId,
      }),
    });

    type APIResponseData =
      | {
          error: true;
          message: string;
        }
      | {
          error: false;
          message: string;
          data: {
            id: string;
            url: string;
            identifierHash: string;
          };
        };

    const responseData: APIResponseData = await response.json();

    if (responseData.error === true) {
      toast.error(responseData.message, {});
      return;
    }

    props.addLinkToLocalStorage(
      responseData.data.id,
      responseData.data.identifierHash
    );

    toast.success("Link created successfully", {
      dismissible: true,
    });
  }

  function setRandomURLId() {
    setUrlId(randomString(4));
  }

  return (
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
              placeholder="Tailor your link ID"
              value={urlId}
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
  );
}
