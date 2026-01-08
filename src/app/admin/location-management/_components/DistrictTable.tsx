import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PencilSimple, Trash } from "@phosphor-icons/react";

type Props = {
  data: any[];
  onAdd: () => void;
  onEdit: (item: any) => void;
  onDelete: (id: number) => void;
  page: number;
  total: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
};

export default function DistrictTable({
  data,
  onAdd,
  onEdit,
  onDelete,
  page,
  total,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: Props) {
  const totalPages = Math.ceil(total / rowsPerPage);

  return (
    <div className="mt-4 space-y-4">
      <div className="flex justify-end">
        <Button onClick={onAdd}>
          Yeni Ekle
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>İlçe Adı</TableHead>
              <TableHead>Şehir</TableHead>
              <TableHead>Ülke</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  İlçe bulunamadı
                </TableCell>
              </TableRow>
            ) : (
              data.map((district) => (
                <TableRow key={district.district_id}>
                  <TableCell>{district.district_name}</TableCell>
                  <TableCell>{district.city_name}</TableCell>
                  <TableCell>{district.country_name}</TableCell>
                  <TableCell>{district.slug}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onEdit(district)}
                      >
                        <PencilSimple size={20} />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => onDelete(district.district_id)}
                      >
                        <Trash size={20} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row w-full justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sayfa başına:</span>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={(value) => onRowsPerPageChange(Number(value))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder={rowsPerPage.toString()} />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 items-center">
          <Button
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            size="sm"
            variant="outline"
          >
            Önceki
          </Button>
          <span className="text-sm text-gray-600">
            Sayfa {page} / {totalPages || 1}
          </span>
          <Button
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            size="sm"
            variant="outline"
          >
            Sonraki
          </Button>
        </div>
      </div>
    </div>
  );
}
