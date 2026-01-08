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
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>AD</TableHead>
            <TableHead>SLUG</TableHead>
            <TableHead>AÇIKLAMA</TableHead>
            <TableHead>OLUŞTURULMA TARİHİ</TableHead>
            <TableHead>İŞLEMLER</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500">
                Organizasyon bulunamadı
              </TableCell>
            </TableRow>
          ) : (
            organizations.map((organization) => (
              <TableRow key={organization.id}>
                <TableCell className="font-medium">{organization.name}</TableCell>
                <TableCell className="text-gray-500">{organization.slug}</TableCell>
                <TableCell className="text-gray-500 max-w-md truncate">
                  {organization.description || "-"}
                </TableCell>
                <TableCell className="text-gray-500">
                  {new Date(organization.createdAt).toLocaleDateString("tr-TR")}
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
                              router.push(
                                `/admin/organizations/edit/${organization.id}`
                              )
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
                            onClick={() => handleDelete(organization.id)}
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

