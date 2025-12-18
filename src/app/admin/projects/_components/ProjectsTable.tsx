"use client";

import { TrashIcon } from "@heroicons/react/16/solid";
import { EyeIcon, PencilIcon } from "@heroicons/react/16/solid";
import {
  Tooltip,
  Switch,
  Button,
} from "@heroui/react";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { Input } from "@heroui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { useState, useEffect } from "react";
import { deleteProject } from "@/app/actions/project";

type Props = {
  projects: {
    id: number;
    name: string;
    description: string;
    officeId: number;
    assignedAgents: string;
    publishingStatus: string;
    startDate: Date;
    endDate: Date;
    deedInfo: string;
    landArea: string;
    nOfUnits: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
    location: {
      id: number;
      streetAddress: string;
      city: string;
      state: string;
      zip: string;
      country: string;
      landmark: string;
      district: string;
      neighborhood: string;
      projectId: number;
    } | null;
    feature: {
      id: number;
      bedrooms: number;
      bathrooms: number;
      floor: number;
      totalFloor: number;
      area: number;
      hasSwimmingPool: boolean;
      hasGardenYard: boolean;
      hasBalcony: boolean;
      projectId: number;
    } | null;
    unitSizes: {
      id: number;
      value: string;
      projectId: number;
    }[];
    socialFeatures: {
      id: number;
      value: string;
      projectId: number;
    }[];
    images: {
      id: number;
      url: string;
      projectId: number;
    }[];
  }[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
  searchTerm: string;
};

const ProjectsTable = ({
  projects,
  totalPages,
  currentPage,
  totalCount,
  searchTerm: initialSearchTerm,
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  useEffect(() => {
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", value);
    params.set("pagenum", "1");
    router.push(`/admin/projects?${params.toString()}`);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu projeyi silmek istediğinizden emin misiniz?")) {
      return;
    }

    const result = await deleteProject(id);
    if (result.success) {
      toast.success("Proje başarıyla silindi");
      router.refresh();
    } else {
      toast.error(result.error || "Proje silinirken bir hata oluştu");
    }
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pagenum", page.toString());
    router.push(`/admin/projects?${params.toString()}`);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full mt-8">
      <div className="w-full max-w-md mb-4 relative">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" />
        <Input
          placeholder="Proje adı veya konum ile arama yapın..."
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10"
        />
      </div>
      <div className="w-full text-sm text-gray-500 mb-4">
        Toplam {totalCount} kayıt bulundu
      </div>
      <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PROJE ADI</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KONUM</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ÖZELLİKLER</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BİRİM BÜYÜKLÜKLERİ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">YAYIN DURUMU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OLUŞTURMA TARİHİ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İŞLEMLER</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  Proje bulunamadı
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {project.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.location?.city}, {project.location?.district}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.feature?.bedrooms} Yatak Odası, {project.feature?.bathrooms} Banyo
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {project.unitSizes.map((size: any) => size.value).join(", ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Switch
                      isSelected={project.publishingStatus === "PUBLISHED"}
                      onChange={async (checked) => {
                        try {
                          const response = await fetch(`/api/projects/${project.id}`, {
                            method: "PATCH",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              publishingStatus: checked ? "PUBLISHED" : "DRAFT",
                            }),
                          });

                          if (response.ok) {
                            router.refresh();
                          } else {
                            toast.error("Yayın durumu güncellenirken bir hata oluştu");
                          }
                        } catch (error) {
                          toast.error("Yayın durumu güncellenirken bir hata oluştu");
                        }
                      }}
                      size="sm"
                    >
                      {project.publishingStatus === "PUBLISHED" ? "Yayında" : "Taslak"}
                    </Switch>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {new Date(project.createdAt).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center justify-end gap-4">
                      <Tooltip >
                        <Link href={`/admin/projects/${project.id}`}>
                          <EyeIcon className="w-5 text-slate-500" />
                        </Link>
                      </Tooltip>
                      <Tooltip>
                        <Link href={`/admin/projects/${project.id}/edit`}>
                          <PencilIcon className="w-5 text-yellow-500" />
                        </Link>
                      </Tooltip>
                      <Tooltip>
                        <button onClick={() => handleDelete(project.id)}>
                          <TrashIcon className="w-5 text-red-500" />
                        </button>
                      </Tooltip>
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
            onPress={() => handlePageChange(Math.max(1, currentPage - 1))}
            isDisabled={currentPage === 1}
          >
            Önceki
          </Button>
          <span className="text-sm text-gray-600">
            Sayfa {currentPage} / {totalPages}
          </span>
          <Button
            size="sm"
            variant="ghost"
            onPress={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            isDisabled={currentPage === totalPages}
          >
            Sonraki
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjectsTable;
