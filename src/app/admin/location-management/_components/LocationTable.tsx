import {
  Button,
} from "@heroui/react";
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

  return (
    <div className="mt-4">
      <div className="flex justify-end mb-4">
        <Button variant="primary" onPress={onAdd}>
          Yeni Ekle
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {column}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İŞLEMLER</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-sm text-gray-500">
                  Veri bulunamadı
                </td>
              </tr>
            ) : (
              data.map((item: any) => {
                const itemKey = item.id ||
                  item.country_id ||
                  item.city_id ||
                  item.district_id ||
                  item.neighborhood_id;
                return (
                  <tr key={itemKey} className="hover:bg-gray-50">
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
                        <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {value}
                        </td>
                      );
                    })}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2 justify-end">
                        <Button
                          isIconOnly
                          variant="ghost"
                          onPress={() => onEdit(item)}
                        >
                          <PencilSimple size={20} />
                        </Button>
                        <Button
                          isIconOnly
                          variant="danger-soft"
                          onPress={() => onDelete(item.id)}
                        >
                          <Trash size={20} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="flex w-full justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sayfa başına:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="border rounded p-1 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button
            isDisabled={page === 1}
            onPress={() => onPageChange(page - 1)}
            size="sm"
            variant="ghost"
          >
            Önceki
          </Button>
          <span className="text-sm text-gray-600 flex items-center">
            Sayfa {page} / {Math.ceil(total / rowsPerPage)}
          </span>
          <Button
            isDisabled={page >= Math.ceil(total / rowsPerPage)}
            onPress={() => onPageChange(page + 1)}
            size="sm"
            variant="ghost"
          >
            Sonraki
          </Button>
        </div>
      </div>
    </div>
  );
}
