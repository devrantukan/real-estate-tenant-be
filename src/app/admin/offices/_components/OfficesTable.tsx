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
import { deleteOffice } from "@/lib/actions/office";
import { toast } from "react-toastify";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>OFİS</TableHead>
            <TableHead>İLETİŞİM</TableHead>
            <TableHead>KONUM</TableHead>
            <TableHead>ÇALIŞAN SAYISI</TableHead>
            <TableHead>İŞLEMLER</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {offices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500">
                Ofis bulunamadı
              </TableCell>
            </TableRow>
          ) : (
            offices.map((office) => (
              <TableRow key={office.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src={office.avatarUrl || "/placeholder.png"}
                        alt={office.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{office.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-900">
                    <div>{office.email}</div>
                    <div className="text-gray-500">{office.phone}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-900">
                    <div>{office.city.name}</div>
                    <div className="text-gray-500">{office.district.name}</div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {office.workers.length}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              router.push(`/admin/offices/edit/${office.id}`)
                            }
                          >
                            <PencilIcon className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Düzenle</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => handleDelete(office.id)}
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
  );
}
