"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Input,
  Tooltip,
  Button,
} from "@heroui/react";
import { toast } from "react-toastify";
import {
  ShareIcon,
  EyeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/16/solid";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface Property {
  id: number;
  name: string;
  description: string;
  price: number;
  type: {
    value: string;
  };
  status: {
    value: string;
  };
  agent: {
    name: string;
    surname: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  images: any[];
}

interface PropertyShareProps {
  user: {
    id: string;
    officeWorkerId: number;
    slug: string;
  };
}

export default function PropertyShare({ user }: PropertyShareProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchProperties = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/properties?page=${currentPage}&search=${searchValue}`
      );
      if (!response.ok) throw new Error("Emlaklar yüklenemedi");
      const data = await response.json();
      if (data.items) {
        setProperties(data.items);
        setTotalPages(Math.ceil(data.total / 10));
        setTotalCount(data.total);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error("Emlaklar yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchValue]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

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

  const handleShare = async (propertyId: number) => {
    try {
      const shareUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/portfoy/${propertyId}/${user.officeWorkerId}/${user.slug}/`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("İlan linki kopyalandı!");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast.error("Link kopyalanırken bir hata oluştu!");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams.toString());
    params.set("pagenum", (page - 1).toString());
    router.push(`/user/project-property-share?${params.toString()}`);
  };


  return (
    <div className="flex flex-col items-center gap-4 w-full mt-8">
      <div className="w-full max-w-md mb-4">
        <Input
          placeholder="İlan adı veya danışman adı ile arama yapın..."
          
          onChange={(e) => handleSearch(e.target.value)}
          startContent={
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          }
          className="w-full"
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
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BAŞLIK</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">FİYAT</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">TİP</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">DURUM</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DANIŞMAN</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">OLUŞTURMA TARİHİ</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">SON GÜNCELLEME TARİHİ</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İŞLEMLER</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {properties.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                  İlan bulunamadı
                </td>
              </tr>
            ) : (
              properties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{property.id}</td>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {property.agent
                      ? `${property.agent.name} ${property.agent.surname}`
                      : "-"}
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
                      <Tooltip >
                        <button onClick={() => handleShare(property.id)}>
                          <ShareIcon className="w-5 text-blue-500" />
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
}
