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
  columns: string[];
  onAdd: () => void;
  onEdit: (item: any) => void;
  onDelete: (id: number) => void;
  page: number;
  total: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
};

export default function LocationTable({
  data,
  columns,
  onAdd,
  onEdit,
  onDelete,
  page,
  total,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: Props) {
  // Debug logs
  console.log("Columns:", columns);
  console.log("Data:", data);

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
              {columns.map((column) => (
                <TableHead key={column}>
                  {column}
                </TableHead>
              ))}
              <TableHead>İŞLEMLER</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center text-gray-500">
                  Veri bulunamadı
                </TableCell>
              </TableRow>
            ) : (
              data.map((item: any) => {
                const itemKey = item.id ||
                  item.country_id ||
                  item.city_id ||
                  item.district_id ||
                  item.neighborhood_id;
                return (
                  <TableRow key={itemKey}>
                    {columns.map((column) => {
                      const key = column.toLowerCase().replace(/\s+/g, "_");
                      let value = "";

                      switch (key) {
                        case "ülke_adı":
                          value = item.country_name;
                          break;
                        case "şehir_adı":
                          value = item.city_name;
                          break;
                        case "ilçe_adı":
                          value = item.district_name;
                          break;
                        case "mahalle_adı":
                          value = item.neighborhood_name;
                          break;
                        case "slug":
                          value = item.slug;
                          break;
                        default:
                          value = item[key] || "-";
                      }

                      return (
                        <TableCell key={column}>
                          {value}
                        </TableCell>
                      );
                    })}
                    <TableCell>
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onEdit(item)}
                        >
                          <PencilSimple size={20} />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => onDelete(item.id)}
                        >
                          <Trash size={20} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
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
        <div className="flex gap-2">
          <Button
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            size="sm"
            variant="outline"
          >
            Önceki
          </Button>
          <span className="text-sm text-gray-600 flex items-center">
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
