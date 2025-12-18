import {
  Button,
} from "@heroui/react";
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

export default function CityTable({
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Şehir Adı</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ülke</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  Şehir bulunamadı
                </td>
              </tr>
            ) : (
              data.map((city) => (
                <tr key={city.city_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{city.city_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{city.country_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{city.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        variant="ghost"
                        onPress={() => onEdit(city)}
                      >
                        <PencilSimple size={20} />
                      </Button>
                      <Button
                        isIconOnly
                        variant="danger-soft"
                        onPress={() => onDelete(city.city_id)}
                      >
                        <Trash size={20} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
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
        <div className="flex gap-2 items-center">
          <Button
            isDisabled={page === 1}
            onPress={() => onPageChange(page - 1)}
            size="sm"
            variant="ghost"
          >
            Önceki
          </Button>
          <span className="text-sm text-gray-600">
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
