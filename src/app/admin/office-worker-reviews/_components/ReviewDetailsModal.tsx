import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

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
  kvkkConsent: number;
  marketingConsent: number;
}

interface Props {
  review: Review | null;
  onClose: () => void;
}

export default function ReviewDetailsModal({ review, onClose }: Props) {
  if (!review) return null;

  return (
    <Dialog open={!!review} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Değerlendirme Detayları</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div>
            <h3 className="font-semibold mb-2">Değerlendirilen Danışman</h3>
            <p>{`${review.officeWorker.firstName} ${review.officeWorker.lastName}`}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Değerlendiren Kişi</h3>
            <p>{`${review.firstName} ${review.lastName}`}</p>
            <p>{review.email}</p>
            <p>{review.phone}</p>
          </div>
          <div className="col-span-2">
            <h3 className="font-semibold mb-2">Puanlar</h3>
            <div className="grid grid-cols-3 gap-2">
              <p>
                <span className="font-medium">İletişim:</span> {review.score1}
                /5
              </p>
              <p>
                <span className="font-medium">Profesyonellik:</span>{" "}
                {review.score2}/5
              </p>
              <p>
                <span className="font-medium">Bilgi:</span> {review.score3}/5
              </p>
              <p>
                <span className="font-medium">Çözüm Odaklılık:</span>{" "}
                {review.score4}/5
              </p>
              <p>
                <span className="font-medium">Güvenilirlik:</span>{" "}
                {review.score5}/5
              </p>
              <p>
                <span className="font-medium">Genel:</span> {review.score6}/5
              </p>
            </div>
            <p className="mt-2">
              <span className="font-medium">Ortalama Puan:</span> {review.avg}
              /5
            </p>
          </div>
          <div className="col-span-2">
            <h3 className="font-semibold mb-2">Değerlendirme</h3>
            <p>{review.review}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">İzinler</h3>
            <p>
              <span className="font-medium">KVKK İzni:</span>{" "}
              {review.kvkkConsent ? "Evet" : "Hayır"}
            </p>
            <p>
              <span className="font-medium">Pazarlama İzni:</span>{" "}
              {review.marketingConsent ? "Evet" : "Hayır"}
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Diğer Bilgiler</h3>
            <p>
              <span className="font-medium">Tarih:</span>{" "}
              {formatDate(review.createdAt)}
            </p>
            <p>
              <span className="font-medium">Onay Durumu:</span>{" "}
              {review.isApproved ? "Onaylı" : "Onay Bekliyor"}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Kapat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
