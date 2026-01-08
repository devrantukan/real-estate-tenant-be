import { Spinner } from "@/components/ui/spinner";

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
      <Spinner size="lg" label="Yükleniyor..." />
    </div>
  );
}
