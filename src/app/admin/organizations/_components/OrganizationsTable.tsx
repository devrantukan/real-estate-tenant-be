"use client";
import {
  Button,
  Tooltip,
} from "@heroui/react";
import { deleteOrganization } from "@/lib/actions/organization";
import { toast } from "react-toastify";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface Organization {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  createdAt: Date;
}

export default function OrganizationsTable({
  organizations,
}: {
  organizations: Organization[];
}) {
  const router = useRouter();

  const handleDelete = async (id: number) => {
    if (confirm("Bu organizasyonu silmek istediğinizden emin misiniz?")) {
      try {
        await deleteOrganization(id);
        toast.success("Organizasyon başarıyla silindi!");
        router.refresh();
      } catch (error) {
        toast.error("Organizasyon silinirken bir hata oluştu");
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AD</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SLUG</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AÇIKLAMA</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OLUŞTURULMA TARİHİ</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İŞLEMLER</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {organizations.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                Organizasyon bulunamadı
              </td>
            </tr>
          ) : (
            organizations.map((organization) => (
              <tr key={organization.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-semibold text-gray-900">{organization.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{organization.slug}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600 max-w-md truncate">
                    {organization.description || "-"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(organization.createdAt).toLocaleDateString("tr-TR")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <Tooltip >
                      <Button
                        isIconOnly
                        size="sm"
                        variant="ghost"
                        onPress={() =>
                          router.push(`/admin/organizations/edit/${organization.id}`)
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
                          onPress={() => handleDelete(organization.id)}
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

