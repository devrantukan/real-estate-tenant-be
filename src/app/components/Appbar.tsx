"use client";
import { HomeModernIcon } from "@heroicons/react/16/solid";
import {
  Navbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  Button,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import Link from "next/link";
import React, { ReactNode } from "react";
import Image from "next/image";

interface Props {
  children: ReactNode;
}

const Appbar = ({ children }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  return (
    <Navbar
      className="shadow-md"
      onMenuOpenChange={setIsMenuOpen}
      maxWidth={"full"}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link
            href={"/"}
            className="flex items-center gap-3 text-primary-400 hover:text-primary-600 transition-colors"
          >
            <Image
              src={"/real-estate-tenant-logo.png"}
              alt="Real Estate Tenant Panel Logo"
              width={0}
              height={60}
              style={{ width: "auto", height: "60px" }}
              loading="eager"
              priority
            />
            <span className="hidden sm:block text-lg font-semibold text-gray-800">
              Real Estate Tenant Panel
            </span>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex gap-4"
        justify="center"
      ></NavbarContent>
      <NavbarContent justify="end">{children}</NavbarContent>
      <NavbarMenu></NavbarMenu>
    </Navbar>
  );
};

export default Appbar;
