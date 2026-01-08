"use client";
import { Button } from "@/components/ui/button";
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
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>AD SOYAD</TableHead>
              <TableHead>İLETİŞİM</TableHead>
              <TableHead>KONUM</TableHead>
              <TableHead>TERCİHLER</TableHead>
              <TableHead>TARİH</TableHead>
              <TableHead>İŞLEMLER</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prospects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  Müşteri adayı bulunamadı
                </TableCell>
              </TableRow>
            ) : (
              prospects.map((prospect) => (
                <TableRow key={prospect.id}>
                  <TableCell className="font-medium text-gray-900">
                    {`${prospect.firstName} ${prospect.lastName}`}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      <div>{prospect.email}</div>
                      <div className="text-gray-500">{prospect.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      <div>{prospect.city}</div>
                      <div className="text-gray-500">{prospect.district}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      <div>{prospect.propertyType}</div>
                      <div className="text-gray-500">{prospect.contractType}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {formatDate(prospect.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => setSelectedProspect(prospect)}
                            >
                              <EyeIcon className="h-5 w-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>İncele</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => handleDelete(prospect.id)}
                            >
                              <TrashIcon className="h-5 w-5" />
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

      <ProspectDetailsModal
        prospect={selectedProspect}
        onClose={() => setSelectedProspect(null)}
      />
    </>
  );
}
