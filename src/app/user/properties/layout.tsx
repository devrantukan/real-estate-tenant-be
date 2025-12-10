"use client";

import { Button } from "@nextui-org/react";
import Link from "next/link";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  modalDelete: ReactNode;
}

const PropertiesLayout = ({ children, modalDelete }: Props) => {
  return (
    <div>
      <div className="bg-primary-400 flex justify-between items-center px-4 py-2">
        <h2 className="text-white text-xl font-semibold px-2">İlanlarınız</h2>
        <Button color="secondary" className="bg-blue-950 text-white" as={Link} href="/user/properties/add">
          <span className="font-bold">İlan Ekle</span>
        </Button>
      </div>
      {children}
      <div>{modalDelete}</div>
    </div>
  );
};

export default PropertiesLayout;
