import { Card } from "../ui/card";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
};

export function StatCard({ icon: Icon, label, value, hint }: StatCardProps) {
  return (
    <Card
     className="flex flex-1 gap-4 p-4 dark:bg-[#333333]">
      <div className="min-w-0">
        <h1 className="truncate text-xl font-medium uppercase tracking-wide text-primary text-center">
          {label}
        </h1>
        <p className="text-3xl font-semibold leading-tight text-primary text-center">{value}</p>
      </div>
    </Card>
  );
}
