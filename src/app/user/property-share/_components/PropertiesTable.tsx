"use client";
import { ShareIcon } from "@heroicons/react/16/solid";
import { EyeIcon } from "@heroicons/react/16/solid";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Prisma, Property } from "@prisma/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { useState } from "react";

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
  user: {
    officeWorkerId: number;
    slug: string;
  };
};

const PropertiesTable = ({
  properties,
  totalPages,
  currentPage,
  totalCount,
  searchTerm,
  user,
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchTerm);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.set("pagenum", "0");
    router.push(`/user/property-share?${params.toString()}`);
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
    const params = new URLSearchParams(searchParams.toString());
    params.set("pagenum", page.toString());
    router.push(`/user/property-share?${params.toString()}`);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full mt-8">
      <div className="w-full max-w-md mb-4 relative">
        <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
        <Input
          placeholder="İlan adı veya danışman adı ile arama yapın..."
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
                <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                  İlan bulunamadı
                </td>
              </tr>
            ) : (
              properties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50">
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
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={`/property/${property.id}`}>
                              <EyeIcon className="w-5 text-slate-500" />
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
                            <button onClick={() => handleShare(property.id)}>
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
    </div>
  );
};

export default PropertiesTable;
