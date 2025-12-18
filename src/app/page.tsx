import prisma from "@/lib/prisma";
import Image from "next/image";
import PropertyCard from "./components/PropertyCard";
import PropertyContainer from "./components/PropertyContainer";
import Search from "./components/Search";
import { getUser } from "@/lib/supabase/server";

import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  } else {
    redirect("/user/properties");
  }

  return (
    <div>
      <ul>
        <li>İlan Yönetimi</li>
      </ul>
    </div>
  );
}
