import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
}

export function StatsCard({ title, value, icon: Icon, description }: StatsCardProps) {
  return (
    <Card className="p-8">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Icon className="h-6 w-6 text-primary" data-testid={`icon-${title.toLowerCase().replace(/\s+/g, "-")}`} />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground" data-testid={`text-stat-title-${title.toLowerCase().replace(/\s+/g, "-")}`}>
          {title}
        </p>
        <p className="text-4xl font-bold" data-testid={`text-stat-value-${title.toLowerCase().replace(/\s+/g, "-")}`}>
          {value}
        </p>
        {description && (
          <p className="text-xs text-muted-foreground" data-testid={`text-stat-description-${title.toLowerCase().replace(/\s+/g, "-")}`}>
            {description}
          </p>
        )}
      </div>
    </Card>
  );
}
