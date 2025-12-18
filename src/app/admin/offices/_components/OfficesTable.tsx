"use client";
import {
  Button,
  Tooltip,
} from "@heroui/react";
import { deleteOffice } from "@/lib/actions/office";
import { toast } from "react-toastify";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface Office {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: any;
  district: any;
  workers: any[];
  avatarUrl?: string | null;
}

export default function OfficesTable({ offices }: { offices: Office[] }) {
  const router = useRouter();

  const handleDelete = async (id: number) => {
    if (confirm("Bu ofisi silmek istediğinizden emin misiniz?")) {
      try {
        await deleteOffice(id);
        toast.success("Ofis başarıyla silindi!");
        router.refresh();
      } catch (error) {
        toast.error("Ofis silinirken bir hata oluştu");
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OFİS</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İLETİŞİM</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KONUM</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ÇALIŞAN SAYISI</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İŞLEMLER</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {offices.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                Ofis bulunamadı
              </td>
            </tr>
          ) : (
            offices.map((office) => (
              <tr key={office.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <img
                      src={office.avatarUrl || "/placeholder.png"}
                      alt={office.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-gray-900">{office.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div>{office.email}</div>
                    <div className="text-gray-500">{office.phone}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div>{office.city.name}</div>
                    <div className="text-gray-500">{office.district.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {office.workers.length}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <Tooltip >
                      <Button
                        isIconOnly
                        size="sm"
                        variant="ghost"
                        onPress={() =>
                          router.push(`/admin/offices/edit/${office.id}`)
                        }
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Button>
                    </Tooltip>
                    <Tooltip >
                      <Button
                        isIconOnly
                        size="sm"
                          variant="danger-soft"
                          onPress={() => handleDelete(office.id)}
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
  );
}
