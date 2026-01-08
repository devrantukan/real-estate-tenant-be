import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";

interface ProspectAgent {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  district: string;
  educationLevel: string;
  occupation: string;
  kvkkConsent: number;
  marketingConsent: number;
  createdAt: Date;
}

interface Props {
  agent: ProspectAgent | null;
  onClose: () => void;
}

export default function ProspectAgentDetailsModal({ agent, onClose }: Props) {
  return (
    <Dialog open={!!agent} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Müşteri Adayı Detayları</DialogTitle>
        </DialogHeader>
        {agent && (
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <h3 className="font-semibold mb-2">Kişisel Bilgiler</h3>
              <p>
                <span className="font-medium">İsim:</span> {agent.firstName}{" "}
                {agent.lastName}
              </p>
              <p>
                <span className="font-medium">E-posta:</span> {agent.email}
              </p>
              <p>
                <span className="font-medium">Telefon:</span> {agent.phone}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Konum</h3>
              <p>
                <span className="font-medium">Şehir:</span> {agent.city}
              </p>
              <p>
                <span className="font-medium">İlçe:</span> {agent.district}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Profesyonel Geçmiş</h3>
              <p>
                <span className="font-medium">Eğitim:</span> {agent.educationLevel}
              </p>
              <p>
                <span className="font-medium">Meslek:</span> {agent.occupation}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">İzinler</h3>
              <p>
                <span className="font-medium">KVKK:</span>{" "}
                {agent.kvkkConsent ? "Evet" : "Hayır"}
              </p>
              <p>
                <span className="font-medium">Pazarlama:</span>{" "}
                {agent.marketingConsent ? "Evet" : "Hayır"}
              </p>
            </div>
            <div className="col-span-2 text-sm text-gray-500 mt-2">
              Kayıt Tarihi: {formatDate(agent.createdAt)}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
