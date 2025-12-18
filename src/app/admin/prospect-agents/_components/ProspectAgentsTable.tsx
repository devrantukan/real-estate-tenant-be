"use client";
import {
  Button,
  Tooltip,
} from "@heroui/react";
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
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AD SOYAD</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İLETİŞİM</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KONUM</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ARKA PLAN</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TARİH</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İŞLEMLER</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {prospectAgents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  Danışman adayı bulunamadı
                </td>
              </tr>
            ) : (
              prospectAgents.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {`${agent.firstName} ${agent.lastName}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>{agent.email}</div>
                      <div className="text-gray-500">{agent.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>{agent.city}</div>
                      <div className="text-gray-500">{agent.district}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>{agent.educationLevel}</div>
                      <div className="text-gray-500">{agent.occupation}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(agent.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <Tooltip >
                        <Button
                          isIconOnly
                          size="sm"
                          variant="ghost"
                          onPress={() => setSelectedAgent(agent)}
                        >
                          <EyeIcon className="h-5 w-5" />
                        </Button>
                      </Tooltip>
                      <Tooltip >
                        <Button
                          isIconOnly
                          size="sm"
                          variant="danger-soft"
                          onClick={() => handleDelete(agent.id)}
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

      <ProspectAgentDetailsModal
        agent={selectedAgent}
        onClose={() => setSelectedAgent(null)}
      />
    </>
  );
}
