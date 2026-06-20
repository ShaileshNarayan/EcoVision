import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";

interface ComplaintCardProps {
  id: string;
  documentId: string;
  title: string;
  description: string;
  wasteType: string;
  status: "pending" | "assigned" | "resolved" | "closed";
  location: string;
  imageUrl?: string;
  createdAt: string;
}

const statusColors = {
  pending: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  assigned: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  resolved: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  closed: "bg-slate-500/10 text-slate-600 border-slate-500/20",
};

export function ComplaintCard({
  id,
  documentId,
  title,
  description,
  wasteType,
  status,
  location,
  imageUrl,
  createdAt,
}: ComplaintCardProps) {
  return (
    <Link href={`/complaint/${documentId}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer" data-testid={`card-complaint-${id}`}>
        {imageUrl && (
          <div className="aspect-video overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
              data-testid={`img-complaint-${id}`}
            />
          </div>
        )}
        <div className="p-6 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg line-clamp-1" data-testid={`text-complaint-title-${id}`}>
              {title}
            </h3>
            <Badge className={statusColors[status]} data-testid={`badge-status-${id}`}>
              {status.replace("-", " ")}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-complaint-description-${id}`}>
            {description}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20" data-testid={`badge-waste-type-${id}`}>
              {wasteType}
            </Badge>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1" data-testid={`text-location-${id}`}>{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span data-testid={`text-date-${id}`}>{createdAt}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
