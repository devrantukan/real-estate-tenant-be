import { getUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserById } from "@/lib/actions/user";

export default async function PropertyShareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">İlan Paylaş</h1>
      {children}
    </div>
  );
}
