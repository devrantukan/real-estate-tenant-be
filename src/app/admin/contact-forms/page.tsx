import { getContactForms } from "@/lib/actions/contact-form";
import { getUser } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import ContactFormsTable from "./_components/ContactFormsTable";

export default async function ContactFormsPage({
  searchParams,
}: {
  searchParams: Promise<{ pagenum?: string }>;
}) {
  const user = await getUser();
  if (!user) {
    redirect("/");
  }

  const role = await getUserRole(user.id);
  console.log("role is:", role);
  if (role !== "site-admin") {
    redirect("/");
  }

  const params = await searchParams;
  const page = params.pagenum ? parseInt(params.pagenum) : 1;
  const { contactForms, total, totalPages } = await getContactForms(page);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">İletişim Formları</h1>
      <ContactFormsTable
        contactForms={contactForms}
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  );
}
