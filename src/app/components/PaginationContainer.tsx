"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Props {
  totalPages: number;
  currentPage: number;
  route?: string;
}
const PaginationContainer = ({ totalPages, currentPage, route = "/" }: Props) => {
  const router = useRouter();
  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    router.push(`${route}?pagenum=${page}`);
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        Önceki
      </Button>
      <span className="text-sm text-gray-600">
        Sayfa {currentPage} / {totalPages}
      </span>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        Sonraki
      </Button>
    </div>
  );
};

export default PaginationContainer;
