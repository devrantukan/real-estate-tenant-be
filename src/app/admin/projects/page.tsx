import { getProjects } from "@/app/actions/project";
import ProjectsTable from "./_components/ProjectsTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/16/solid";
import { getUser } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProjectsPage({
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

  const result = await getProjects(page, search);

  if (!result.success) {
    return <div>Bir hata oluştu: {result.error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projeler</h1>
        <Link href="/admin/projects/new">
          <Button>
            <PlusIcon className="w-5 h-5 mr-2" />
            Yeni Proje
          </Button>
        </Link>
      </div>

      <ProjectsTable
        projects={(result.data as any) || []}
        totalPages={result.totalPages || 1}
        currentPage={result.currentPage || 1}
        totalCount={result.total || 0}
        searchTerm={search}
      />
    </div>
  );
}
