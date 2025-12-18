"use client";
import {
  Button,
  Chip,
  Tooltip,
} from "@heroui/react";
import { formatDate } from "@/lib/utils";
import { deleteProspect } from "@/lib/actions/prospect";
import { toast } from "react-toastify";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useRouter } from "next/navigation";

import ProspectDetailsModal from "@/app/admin/prospect-customers/_components/ProspectDetailsModal";

interface Prospect {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  district: string;
  streetAddress: string;
  contractType: string;
  propertyType: string;
  notes: string;
  kvkkConsent: number;
  marketingConsent: number;
  createdAt: Date;
}

export default function ProspectsTable({
  prospects,
}: {
  prospects: Prospect[];
}) {
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(
    null
  );
  const router = useRouter();

  const handleDelete = async (id: number) => {
    if (confirm("Bu müşteri adayını silmek istediğinizden emin misiniz?")) {
      try {
        const response = await fetch(`/api/prospect-customers/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete prospect");
        }

        toast.success("Müşteri adayı başarıyla silindi!");
        router.refresh();
      } catch (error) {
        console.error("Error deleting prospect:", error);
        toast.error("Müşteri adayı silinirken bir hata oluştu");
      }
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AD SOYAD</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İLETİŞİM</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KONUM</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TERCİHLER</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TARİH</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İŞLEMLER</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {prospects.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  Müşteri adayı bulunamadı
                </td>
              </tr>
            ) : (
              prospects.map((prospect) => (
                <tr key={prospect.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {`${prospect.firstName} ${prospect.lastName}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>{prospect.email}</div>
                      <div className="text-gray-500">{prospect.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>{prospect.city}</div>
                      <div className="text-gray-500">{prospect.district}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>{prospect.propertyType}</div>
                      <div className="text-gray-500">{prospect.contractType}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(prospect.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <Tooltip >
                        <Button
                          isIconOnly
                          size="sm"
                          variant="ghost"
                          onPress={() => setSelectedProspect(prospect)}
                        >
                          <EyeIcon className="h-5 w-5" />
                        </Button>
                      </Tooltip>
                      <Tooltip >
                        <Button
                          isIconOnly
                          size="sm"
                          variant="danger-soft"
                          onClick={() => handleDelete(prospect.id)}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </Button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ProspectDetailsModal
        prospect={selectedProspect}
        onClose={() => setSelectedProspect(null)}
      />
    </>
  );
}
