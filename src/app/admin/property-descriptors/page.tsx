import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth";
import DescriptorsList from "./_components/DescriptorsList";
import {
  getCategories,
  getDescriptors,
  getPropertyTypes,
} from "@/lib/actions/property-descriptor";

export default async function PropertyDescriptorsPage() {
  const user = await getUser();
  if (!user) {
    redirect("/");
  }

  const role = await getUserRole(user.id);
  console.log("role is:", role);
  if (role !== "site-admin") {
    redirect("/");
  }

  const [categories, descriptors, propertyTypes] = await Promise.all([
    getCategories(),
    getDescriptors(),
    getPropertyTypes(),
  ]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Özellik Tanımlayıcıları Yönetimi
      </h1>
      <DescriptorsList
        initialCategories={categories}
        initialDescriptors={descriptors}
        propertyTypes={propertyTypes}
      />
    </div>
  );
}
