"use client";

interface DataTableProps<TData> {
  columns: {
    key: string;
    label: string;
    render?: (item: TData) => React.ReactNode;
  }[];
  data: TData[];
  isLoading?: boolean;
  searchKey?: string;
}

export function DataTable<TData>({
  columns,
  data,
  isLoading,
}: DataTableProps<TData>) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                Yükleniyor...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                Veri bulunamadı
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={(item as any).id} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.render
                      ? column.render(item)
                      : (item as any)[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
