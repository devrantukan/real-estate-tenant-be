"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { deleteProspectAgent } from "@/lib/actions/prospect-agent";
import { toast } from "react-toastify";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import ProspectAgentDetailsModal from "./ProspectAgentDetailsModal";
import { useRouter } from "next/navigation";

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

export default function ProspectAgentsTable({
  prospectAgents,
}: {
  prospectAgents: ProspectAgent[];
}) {
  const [selectedAgent, setSelectedAgent] = useState<ProspectAgent | null>(
    null
  );
  const router = useRouter();

  const handleDelete = async (id: number) => {
    if (confirm("Bu danışman adayını silmek istediğinizden emin misiniz?")) {
      try {
        const response = await fetch(`/api/prospect-agents/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete prospect agent");
        }

        toast.success("Danışman adayı başarıyla silindi!");
        router.refresh();
      } catch (error) {
        console.error("Error deleting prospect agent:", error);
        toast.error("Danışman adayı silinirken bir hata oluştu");
      }
    }
  };

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>AD SOYAD</TableHead>
              <TableHead>İLETİŞİM</TableHead>
              <TableHead>KONUM</TableHead>
              <TableHead>ARKA PLAN</TableHead>
              <TableHead>TARİH</TableHead>
              <TableHead>İŞLEMLER</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prospectAgents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  Danışman adayı bulunamadı
                </TableCell>
              </TableRow>
            ) : (
              prospectAgents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell className="font-medium text-gray-900">
                    {`${agent.firstName} ${agent.lastName}`}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      <div>{agent.email}</div>
                      <div className="text-gray-500">{agent.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      <div>{agent.city}</div>
                      <div className="text-gray-500">{agent.district}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      <div>{agent.educationLevel}</div>
                      <div className="text-gray-500">{agent.occupation}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {formatDate(agent.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => setSelectedAgent(agent)}
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
                              onClick={() => handleDelete(agent.id)}
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

      <ProspectAgentDetailsModal
        agent={selectedAgent}
        onClose={() => setSelectedAgent(null)}
      />
    </>
  );
}
