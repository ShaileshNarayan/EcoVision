import { useEffect, useState } from "react";
import { fetchDriverReports } from "../services/driverReportService";
import type { DriverReport } from "../types/driverReport";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "../components/ui/badge";
import { MapPin } from "lucide-react";
import Header from "@/components/Header";

export default function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null;

  const navigate = useNavigate();

  const [reports, setReports] = useState<DriverReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const driverDocumentId = user.documentId;

  useEffect(() => {
    if (!driverDocumentId) return;

    const load = async () => {
      try {
        const data = await fetchDriverReports(driverDocumentId);
        setReports(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [driverDocumentId]);

  const today = new Date().toISOString().split("T")[0];

  const activeTasks = reports.filter(
    (r) => r.reportstatus === "assigned"
  );

  const completedToday = reports.filter(
    (r) =>
      r.reportstatus === "resolved" &&
      r.assignedAt?.startsWith(today)
  );

  if (loading) return <p className="p-4">Loading dashboard…</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-xl mx-auto space-y-8">
          <Header title="Driver Dashboard" />

        {/* ACTIVE TASKS */}
        <section className="space-y-4 mb-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Active Tasks
          </h2>

          {activeTasks.length === 0 && (
            <Card className="p-4 text-sm text-muted-foreground">
              No active tasks assigned
            </Card>
          )}

          {activeTasks.map((task) => (
            <Card key={task.documentId} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium leading-snug">
                  {task.title}
                </h3>
                <Badge variant="assigned">Assigned</Badge>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{task.location}</span>
              </div>

              <Button
                className="w-full"
                size="sm"
                onClick={() => navigate(`/tasks/${task.documentId}`)}
              >
                View Task
              </Button>
            </Card>
          ))}
        </section>

        {/* COMPLETED TODAY */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Completed Today
          </h2>

          {completedToday.length === 0 && (
            <Card className="p-4 text-sm text-muted-foreground">
              No tasks completed today
            </Card>
          )}

          {completedToday.map((task) => (
            <Card
              key={task.documentId}
              className="p-4 flex items-center justify-between gap-3"
            >
              <div>
                <p className="font-medium leading-snug">
                  {task.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {task.location}
                </p>
              </div>
              <Badge variant="resolved">Resolved</Badge>
            </Card>
          ))}
        </section>

      </div>
      </div>

  );
}
