"use client";

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

export function CreateForm(): React.ReactNode {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleInput(event: FormEvent<HTMLInputElement>) {
    const element = event.target as HTMLInputElement;
    // setUrl(element.value);
  }

  function handleOnCreate() {
    const value = inputRef.current!.value;

    console.log(value);
  }

  return (
    <div className="flex gap-2 min-w-full justify-center items-center">
      {/* url input */}
      <Input
        ref={inputRef}
        type="url"
        id="url"
        placeholder="Enter your loooong looooong url"
        className="w-[400px] max-md:w-[90%]"
        onInput={handleInput}
      />

      {/* submit button */}
      <Button onClick={handleOnCreate}>Create</Button>
    </div>
  );
}
