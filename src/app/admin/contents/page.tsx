import { getContents } from "@/app/actions/content";
import ContentsTable from "./_components/ContentsTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/16/solid";
import { getUser } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ContentsPage({
  searchParams,
}: {
  searchParams: Promise<{ pagenum?: string; search?: string }>;
}) {
  const user = await getUser();
  if (!user) {
    redirect("/");
  }

  const role = await getUserRole(user.id);

  if (!user || role !== "site-admin") {
    redirect("/");
  }

  const params = await searchParams;
  const page = Number(params.pagenum) || 1;
  const search = params.search || "";

  const result = await getContents(page, search);

  if (!result.success) {
    return <div>Bir hata oluştu: {result.error}</div>;
  }

  const { data = [], totalPages = 1, currentPage = 1, total = 0 } = result;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">İçerik Yönetimi</h1>
        <Link href="/admin/contents/new">
          <Button>
            <PlusIcon className="w-5 h-5 mr-2" />
            Yeni İçerik
          </Button>
        </Link>
      </div>

      <ContentsTable
        contents={data}
        totalPages={totalPages}
        currentPage={currentPage}
        totalCount={total}
        searchTerm={search}
      />
    </div>
  );
}
