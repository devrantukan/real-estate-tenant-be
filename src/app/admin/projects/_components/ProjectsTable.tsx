"use client";

import { TrashIcon } from "@heroicons/react/16/solid";
import { EyeIcon, PencilIcon } from "@heroicons/react/16/solid";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
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
      <div className="border rounded-lg w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PROJE ADI</TableHead>
              <TableHead>KONUM</TableHead>
              <TableHead>ÖZELLİKLER</TableHead>
              <TableHead>BİRİM BÜYÜKLÜKLERİ</TableHead>
              <TableHead>YAYIN DURUMU</TableHead>
              <TableHead>OLUŞTURMA TARİHİ</TableHead>
              <TableHead>İŞLEMLER</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500">
                  Proje bulunamadı
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">
                    {project.name}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {project.location?.city}, {project.location?.district}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {project.feature?.bedrooms} Yatak Odası, {project.feature?.bathrooms} Banyo
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {project.unitSizes.map((size: any) => size.value).join(", ")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {project.publishingStatus === "PUBLISHED" ? "Yayında" : "Taslak"}
                      </span>
                      <Switch
                        checked={project.publishingStatus === "PUBLISHED"}
                        onCheckedChange={async (checked) => {
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
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500 text-center">
                    {new Date(project.createdAt).toLocaleDateString("tr-TR")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={`/admin/projects/${project.id}`}>
                              <Button size="icon" variant="ghost">
                                <EyeIcon className="w-5 text-slate-500" />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Görüntüle</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={`/admin/projects/${project.id}/edit`}>
                              <Button size="icon" variant="ghost">
                                <PencilIcon className="w-5 text-yellow-500" />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Düzenle</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon" variant="ghost" onClick={() => handleDelete(project.id)}>
                              <TrashIcon className="w-5 text-red-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Sil</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Önceki
          </Button>
          <span className="text-sm text-gray-600">
            Sayfa {currentPage} / {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Sonraki
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjectsTable;
