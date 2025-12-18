"use client";
import {
  Button,
  Tooltip,
  Switch,
} from "@heroui/react";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { toast } from "react-toastify";
import { formatDate } from "@/lib/utils";
import ReviewDetailsModal from "./ReviewDetailsModal";
import {
  updateReviewApproval,
  deleteReview,
} from "@/lib/actions/office-worker-review";

interface Review {
  id: number;
  review: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  score1: number;
  score2: number;
  score3: number;
  score4: number;
  score5: number;
  score6: number;
  avg: number;
  isApproved: number;
  officeWorker: {
    id: number;
    firstName: string;
    lastName: string;
  };
  createdAt: Date;
}

export default function ReviewsTable({ reviews }: { reviews: Review[] }) {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const handleDelete = async (id: number) => {
    if (confirm("Bu değerlendirmeyi silmek istediğinizden emin misiniz?")) {
      try {
        await deleteReview(id);
        toast.success("Değerlendirme başarıyla silindi!");
        window.location.reload();
      } catch (error) {
        toast.error("Değerlendirme silinirken bir hata oluştu");
      }
    }
  };

  const handleApprovalChange = async (id: number, isApproved: number) => {
    try {
      await updateReviewApproval(id, isApproved === 1 ? 0 : 1);
      toast.success("Onay durumu güncellendi!");
      window.location.reload();
    } catch (error) {
      toast.error("Onay durumu güncellenirken bir hata oluştu");
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DEĞERLENDİRİLEN</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DEĞERLENDİREN</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ORTALAMA PUAN</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TARİH</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ONAY DURUMU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İŞLEMLER</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  Değerlendirme bulunamadı
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {`${review.officeWorker.firstName} ${review.officeWorker.lastName}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>{`${review.firstName} ${review.lastName}`}</div>
                      <div className="text-gray-500">{review.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {review.avg}/5
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(review.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Switch
                      isSelected={review.isApproved === 1}
                      onChange={() =>
                        handleApprovalChange(review.id, review.isApproved)
                      }
                      aria-label="Onay Durumu"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <Tooltip>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="ghost"
                          onPress={() => setSelectedReview(review)}
                        >
                          <EyeIcon className="h-5 w-5" />
                        </Button>
                      </Tooltip>
                      <Tooltip >
                        <Button
                          isIconOnly
                          size="sm"
                          variant="danger-soft"
                          onPress={() => handleDelete(review.id)}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </Button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedReview && (
        <ReviewDetailsModal
          review={{
            ...selectedReview,
            kvkkConsent: selectedReview.isApproved === 1 ? 1 : 0,
            marketingConsent: selectedReview.isApproved === 1 ? 1 : 0,
          }}
          onClose={() => setSelectedReview(null)}
        />
      )}
    </>
  );
}
