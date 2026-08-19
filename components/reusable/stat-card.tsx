import { Card } from "../ui/card";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  porcent?: string;
  hint?: string;
  className?: string;
  iconClassName?: string;
  textColor?: string;
  valueColor?: string;
};

export function StatCard({ icon: Icon, label, value, porcent, hint, className, iconClassName, textColor, valueColor }: StatCardProps) {
  return (
    <Card
     className={`flex flex-1 gap-4 p-4 shadow-md ${className || ''}`}>
      <div className="min-w-0">
        <div className="flex flex-col-reverse">
          <h1 className={`truncate text-base font-medium uppercase tracking-wide ${textColor || 'text-primary'} text-center`}>
          {label}
        </h1>
        <Icon className={`mx-auto my-2 size-8 ${iconClassName || 'text-primary'}`} />
        </div>
        <div className="flex flex-col items-center">
          <p className={`text-3xl font-semibold leading-tight ${valueColor || 'text-primary'} text-center`}>{value}</p>
          <span className="text-sm text-center bg-black text-white p-0.5 px-4 rounded-md">{porcent}</span>
        </div>
      </div>
    </Card>
  );
}
