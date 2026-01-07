import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: "sm" | "md" | "lg";
    label?: string;
}

export function Spinner({ size = "md", label, className, ...props }: SpinnerProps) {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
    };

    return (
        <div className={cn("flex flex-col items-center justify-center gap-2", className)} {...props}>
            <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
            {label && <span className="text-sm font-medium text-primary">{label}</span>}
        </div>
    );
}
