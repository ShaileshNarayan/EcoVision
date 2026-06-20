import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchReportByDocumentId } from "../services/driverReportService";

import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

export default function TaskDetailsPage() {
  const { documentId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!documentId) return;

    fetchReportByDocumentId(documentId).then((data) => {
      setTask(data);
      setLoading(false);
    });
  }, [documentId]);

  if (loading) return <p className="p-4">Loading task…</p>;
  if (!task) return <p className="p-4">Task not found</p>;

  return (
    <div className="min-h-screen pb-24 p-4 md:p-6">
      <div className="max-w-xl mx-auto space-y-6">

        {/* HEADER */}
        <Header title="Task Details" showBack/>

        {/* TASK SUMMARY */}
        <Card className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-lg font-semibold leading-snug">
              {task.title}
            </h2>
            <Badge variant="assigned">Assigned</Badge>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{task.location}</span>
          </div>
        </Card>

        {/* DETAILS */}
        <Card className="p-4 space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              Waste Type
            </p>
            <Badge variant="outline">{task.wasteType}</Badge>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">
              Description
            </p>
            <p className="text-sm leading-relaxed">
              {task.description}
            </p>
          </div>
        </Card>

        {/* IMAGE */}
        {task.photoUrls?.length > 0 && (
          <Card className="overflow-hidden">
            <img
              src={task.photoUrls[0]}
              alt="Reported waste"
              className="w-full aspect-video object-cover"
            />
          </Card>
        )}
      </div>

      {/* STICKY BOTTOM ACTIONS */}
      <div
            className="fixed bottom-0 left-0 right-0 border-t"
            style={{
              borderColor: "hsl(var(--border))",
              backgroundColor: "hsl(var(--background))",
            }}
          >
            <div className="max-w-xl mx-auto p-4 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => startNavigation(task.location)}
          >
            Start Navigation
          </Button>

          <Button
            className="flex-1"
            onClick={() =>
              navigate(`/tasks/${task.documentId}/finish`)
            }
          >
            Finish Task
          </Button>
        </div>
      </div>
    </div>
  );
}

function startNavigation(address: string) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    address
  )}&travelmode=driving`;

  window.open(url, "_blank");
}
