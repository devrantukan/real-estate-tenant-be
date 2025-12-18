"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deleteOfficeWorker } from "@/lib/actions/office-worker";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { PencilSimple, Trash } from "@phosphor-icons/react";

type OfficeWorker = {
  id: number;
  name: string;
  surname: string;
  email: string;
  office: { name: string };
  role: { title: string };
};

export function OfficeWorkerList() {
  const [workers, setWorkers] = useState<OfficeWorker[]>([]);
  const router = useRouter();

  const fetchWorkers = async () => {
    try {
      const res = await fetch("/api/admin/office-workers");
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error fetching workers:", errorText);
        throw new Error(errorText);
      }
      const data = await res.json();
      setWorkers(data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Çalışanlar yüklenirken bir hata oluştu");
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Bu personeli silmek istediğinizden emin misiniz?")) {
      try {
        await deleteOfficeWorker(id);
        toast.success("Personel başarıyla silindi!");
        window.location.reload();
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Personel silinirken bir hata oluştu!");
      }
    }
  };
  const columns = [
    { name: "AD SOYAD", uid: "fullName" },
    { name: "E-POSTA", uid: "email" },
    { name: "OFİS", uid: "office" },
    { name: "ROL", uid: "role" },
    { name: "İŞLEMLER", uid: "actions" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th key={column.uid} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {workers.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                Çalışan bulunamadı
              </td>
            </tr>
          ) : (
            workers.map((worker) => (
              <tr key={worker.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {`${worker.name} ${worker.surname}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {worker.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {worker.office.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {worker.role.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Link href={`/admin/office-workers/edit/${worker.id}`}>
                    <Button variant="outline" size="sm">
                      <PencilSimple size={16} weight="bold" />
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(worker.id)}
                  >
                    <Trash size={16} weight="bold" />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
