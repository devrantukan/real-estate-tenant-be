"use client";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { Input } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useDebouncedCallback } from "use-debounce";

const Search = () => {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();
  const handleChange = useDebouncedCallback((query: string) => {
    const params = new URLSearchParams(searchParams);
    if (query) params.set("query", query);
    else params.delete("query");

    router.replace(`${pathName}?${params.toString()}`);
  }, 1000);

  return (
    <div className="p-4 flex items-center justify-center bg-gradient-to-br from-sky-400 to-indigo-500">
      <div className="relative w-96">
        <Input
          onChange={(e) => handleChange(e.target.value)}
          className="w-full shadow pr-10"
          defaultValue={searchParams.get("query") ?? ""}
        />
        <MagnifyingGlassIcon className="w-4 text-slate-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
};

export default Search;
