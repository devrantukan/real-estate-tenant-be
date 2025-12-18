"use client";
import { HomeModernIcon } from "@heroicons/react/16/solid";
import { Button } from "@heroui/react";
import Link from "next/link";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Appbar = ({ children }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  return (
    <nav className="shadow-md bg-white w-full">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href={"/"}
              className="flex flex-col items-start text-primary-400 hover:text-primary-600 transition-colors"
            >
              <span className="text-lg font-semibold">Real Estate</span>
              <span className="text-sm">Tenant Panel</span>
            </Link>
          </div>
          <div className="hidden sm:flex sm:items-center sm:gap-4"></div>
          <div className="flex items-center justify-end">{children}</div>
        </div>
      </div>
    </nav>
  );
};

export default Appbar;
