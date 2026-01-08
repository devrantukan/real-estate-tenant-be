"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import {
  ShareIcon,
  EyeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/16/solid";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface Project {
  id: number;
  name: string;
  description: string;
  catalogUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  location: {
    city: string;
    district: string;
    neighborhood: string;
  } | null;
}

interface ProjectShareProps {
  user: {
    id: string;
    officeWorkerId: number;
    slug: string;
  };
  initialData?: {
    projects: Project[];
    totalPages: number;
    currentPage: number;
    totalCount: number;
    searchTerm: string;
  };
}

export default function ProjectShare({ user, initialData }: ProjectShareProps) {
  const [projects, setProjects] = useState<Project[]>(
    initialData?.projects || []
  );
  const [loading, setLoading] = useState(!initialData);
  const [currentPage, setCurrentPage] = useState(initialData?.currentPage || 1);
  const [totalPages, setTotalPages] = useState(initialData?.totalPages || 1);
  const [totalCount, setTotalCount] = useState(initialData?.totalCount || 0);
  const [searchValue, setSearchValue] = useState(initialData?.searchTerm || "");
  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/projects?page=${currentPage}&search=${searchValue}`
      );
      if (!response.ok) throw new Error("Projeler yüklenemedi");
      const data = await response.json();
      if (data.success) {
        setProjects(data.data);
        setTotalPages(Math.ceil(data.total / 10));
        setTotalCount(data.total);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error("Projeler yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchValue]);

  useEffect(() => {
    if (!initialData) {
      fetchProjects();
    }
  }, [fetchProjects, initialData]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.set("pagenum", "0");
    router.push(`/user/project-property-share?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pagenum", page.toString());
    router.push(`/user/project-property-share?${params.toString()}`);
  };

  const handleShare = async (projectId: number) => {
    try {
      const project = projects.find((p) => p.id === projectId);
      if (!project) {
        toast.error("Proje bulunamadı!");
        return;
      }

      // Convert project name to slug format
      const projectSlug = project.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const shareUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/projelerimiz/${projectSlug}/${user.officeWorkerId}/${user.slug}/`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Proje linki kopyalandı!");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast.error("Link kopyalanırken bir hata oluştu!");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full mt-8">
      {totalCount > 0 ? (
        <>
          <div className="w-full max-w-md mb-4 relative">
            <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
            <Input
              placeholder="Proje adı ile arama yapın..."

              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-8"
            />
          </div>
          <div className="w-full text-sm text-gray-500 mb-4">
            {searchValue ? (
              <p>{totalCount} kayıt bulundu</p>
            ) : (
              <p>Toplam {totalCount} kayıt</p>
            )}
          </div>
          <div className="overflow-x-auto w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BAŞLIK</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AÇIKLAMA</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">KONUM</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">OLUŞTURMA TARİHİ</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">SON GÜNCELLEME TARİHİ</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İŞLEMLER</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      Proje bulunamadı
                    </td>
                  </tr>
                ) : (
                  projects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{project.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{project.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {project.location
                          ? `${project.location.city} / ${project.location.district} / ${project.location.neighborhood}`
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {new Date(project.createdAt).toLocaleDateString("tr-TR")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {new Date(project.updatedAt).toLocaleDateString("tr-TR")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center justify-end gap-4">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button onClick={() => handleShare(project.id)}>
                                  <ShareIcon className="w-5 text-blue-500" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Paylaş</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
              >
                Önceki
              </Button>
              <span className="text-sm text-gray-600">
                Sayfa {currentPage + 1} / {totalPages}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage >= totalPages - 1}
              >
                Sonraki
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            Size atanmış herhangi bir proje bulunmamaktadır.
          </p>
        </div>
      )}
    </div>
  );
}
