import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrencyDT } from "@/utils/formatters";
import { cn } from "@/lib/utils";
import { usePrivacy } from "@/context/PrivacyContext";

interface KPICardProps {
  title: string;
  value: number;
  icon: any;
  color: string;
  description?: string;
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, icon: Icon, color, description }) => {
  const { isPrivate } = usePrivacy();

  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110", color)}>
            <Icon size={24} className="text-white" />
          </div>
          {description && (
            <span className="text-xs font-medium text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-full">
              {description}
            </span>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            {isPrivate ? "*****" : formatCurrencyDT(value)}
          </h3>
        </div>
      </CardContent>
      <div className={cn("h-1.5 w-full opacity-20", color)} />
    </Card>
  );
};