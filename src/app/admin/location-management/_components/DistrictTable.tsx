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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İlçe Adı</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Şehir</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ülke</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  İlçe bulunamadı
                </td>
              </tr>
            ) : (
              data.map((district) => (
                <tr key={district.district_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{district.district_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{district.city_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{district.country_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{district.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        variant="ghost"
                        onPress={() => onEdit(district)}
                      >
                        <PencilSimple size={20} />
                      </Button>
                      <Button
                        isIconOnly
                        variant="danger-soft"
                        onPress={() => onDelete(district.district_id)}
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
