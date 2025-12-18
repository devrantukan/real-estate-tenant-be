"use client";
import { TrashIcon } from "@heroicons/react/16/solid";
import { EyeIcon, PencilIcon } from "@heroicons/react/16/solid";
import {
  Tooltip,
  Switch,
  Button,
} from "@heroui/react";
import { Prisma, Property } from "@prisma/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updatePublishingStatus } from "@/app/actions/updatePropertyStatus";
import { revalidateProperty } from "@/lib/actions/property";
import { toast } from "react-toastify";
import { Input } from "@heroui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { useState, useEffect } from "react";

type SortDirection = "asc" | "desc";

type Props = {
  properties: Prisma.PropertyGetPayload<{
    include: {
      status: true;
      images: true;
      type: true;
      agent: true;
    };
  }>[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
  searchTerm: string;
};

const PropertiesTable = ({
  properties,
  totalPages,
  currentPage,
  totalCount,
  searchTerm: initialSearchTerm,
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [sortKey, setSortKey] = useState<string>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Update search term when initialSearchTerm changes
  useEffect(() => {
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  const handleSort = (key: string) => {
    const newDirection =
      key === sortKey && sortDirection === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortDirection(newDirection);

    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", key);
    params.set("direction", newDirection);
    router.push(`/user/properties?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", value);
    params.set("pagenum", "1"); // Reset to first page when searching
    router.push(`/user/properties?${params.toString()}`);
  };

  const handlePublishChange = async (
    propertyId: number,
    isPublished: boolean
  ) => {
    try {
      const result = await updatePublishingStatus(
        propertyId.toString(),
        isPublished ? "PUBLISHED" : "PENDING"
      );

      if (!result) {
        throw new Error("Failed to update status");
      }

      // Update Typesense index
      const typesenseResponse = await fetch("/api/typesense/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId,
          isPublished,
        }),
      });

      if (!typesenseResponse.ok) {
        console.error(
          "Failed to update Typesense:",
          await typesenseResponse.text()
        );
        // Don't throw here, just log the error
      }

      // Revalidate using server-side function
      await revalidateProperty(propertyId.toString());

      toast.success(
        isPublished ? "İlan yayınlandı!" : "İlan yayından kaldırıldı!"
      );
      router.refresh();
    } catch (error) {
      console.error("Error updating property status:", error);
      toast.error("Bir hata oluştu!");
    }
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pagenum", page.toString());
    router.push(`/user/properties?${params.toString()}`);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full mt-8">
      <div className="w-full max-w-md mb-4 relative">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" />
        <Input
          placeholder="İlan adı, danışman adı veya ID ile arama yapın..."
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
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => handleSort("id")}
              >
                <div className="flex items-center gap-1">
                  ID
                  {sortKey === "id" && (
                    <span className="text-xs">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1">
                  BAŞLIK
                  {sortKey === "name" && (
                    <span className="text-xs">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => handleSort("price")}
              >
                <div className="flex items-center gap-1 justify-end">
                  FİYAT
                  {sortKey === "price" && (
                    <span className="text-xs">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => handleSort("type")}
              >
                <div className="flex items-center gap-1 justify-center">
                  TİP
                  {sortKey === "type" && (
                    <span className="text-xs">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-1 justify-center">
                  DURUM
                  {sortKey === "status" && (
                    <span className="text-xs">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yayın Durumu</th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => handleSort("agent")}
              >
                <div className="flex items-center gap-1">
                  DANIŞMAN
                  {sortKey === "agent" && (
                    <span className="text-xs">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center gap-1 justify-center">
                  OLUŞTURMA TARİHİ
                  {sortKey === "createdAt" && (
                    <span className="text-xs">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => handleSort("updatedAt")}
              >
                <div className="flex items-center gap-1 justify-center">
                  SON GÜNCELLEME TARİHİ
                  {sortKey === "updatedAt" && (
                    <span className="text-xs">{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İŞLEMLER</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {properties.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-4 text-center text-sm text-gray-500">
                  İlan bulunamadı
                </td>
              </tr>
            ) : (
              properties.map((property) => {
                const isPublished = property.publishingStatus === "PUBLISHED";
                return (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{property.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{property.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {new Intl.NumberFormat("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(property.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{property.type.value}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{property.status.value}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={isPublished ? "text-green-600" : "text-yellow-600"}>
                          {isPublished ? "Yayında" : "Beklemede"}
                        </span>
                        <Switch
                          isSelected={isPublished}
                          onChange={(checked) =>
                            handlePublishChange(property.id, checked)
                          }
                          size="sm"
                          color="success"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {property.agent?.name} {property.agent?.surname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {new Date(property.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {new Date(property.updatedAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center justify-end gap-4">
                        <Tooltip >
                          <Link href={`/property/${property.id}`}>
                            <EyeIcon className="w-5 text-slate-500" />
                          </Link>
                        </Tooltip>
                        <Tooltip  color="warning">
                          <Link href={`/user/properties/${property.id}/edit`}>
                            <PencilIcon className="w-5 text-yellow-500" />
                          </Link>
                        </Tooltip>
                        <Tooltip  variant="danger">
                          <Link href={`/user/properties/${property.id}/delete`}>
                            <TrashIcon className="w-5 text-red-500" />
                          </Link>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })
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

export default PropertiesTable;

type Props2 = {
  properties: Prisma.PropertyGetPayload<{
    include: {
      type: true;
      status: true;
    };
  }>[];
  totalPages: number;
  currentPage: number;
};
