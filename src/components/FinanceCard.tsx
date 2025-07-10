import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FinanceCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "glass" | "gradient";
  hover?: boolean;
}

export function FinanceCard({ 
  children, 
  className, 
  variant = "default",
  hover = true 
}: FinanceCardProps) {
  return (
    <Card 
      className={cn(
        "transition-smooth",
        variant === "glass" && "glass-card",
        variant === "gradient" && "bg-gradient-card",
        hover && "hover:shadow-medium hover:-translate-y-1",
        className
      )}
    >
      {children}
    </Card>
  );
}