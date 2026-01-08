"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>DEĞERLENDİRİLEN</TableHead>
              <TableHead>DEĞERLENDİREN</TableHead>
              <TableHead>ORTALAMA PUAN</TableHead>
              <TableHead>TARİH</TableHead>
              <TableHead>ONAY DURUMU</TableHead>
              <TableHead>İŞLEMLER</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  Değerlendirme bulunamadı
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium text-gray-900">
                    {`${review.officeWorker.firstName} ${review.officeWorker.lastName}`}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      <div>{`${review.firstName} ${review.lastName}`}</div>
                      <div className="text-gray-500">{review.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {review.avg}/5
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {formatDate(review.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={review.isApproved === 1}
                      onCheckedChange={() =>
                        handleApprovalChange(review.id, review.isApproved)
                      }
                      aria-label="Onay Durumu"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => setSelectedReview(review)}
                            >
                              <EyeIcon className="h-5 w-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>İncele</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => handleDelete(review.id)}
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
