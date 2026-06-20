import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { ComplaintCard } from "@/components/ComplaintCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import strapiClient from "@/services/strapiClient";

interface Report {
  id: string;
  documentId: string;
  title: string;
  description: string;
  wasteType: string;
  status: "pending" | "assigned" | "resolved" | "closed";
  location: string;
  imageUrl: string;
  createdAt: string;
}

export default function MyComplaints() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
      return;
    }

    if (!user?.name) return;

    const fetchReports = async () => {
      try {
        const response = await strapiClient.get(
          `http://localhost:1337/api/reports?filters[submittedBy][$eqi]=${encodeURIComponent(
            user.name
          )}&populate=photo`
        );

        const mappedReports = response.data.data.map((item: any) => {
          const attr = item;
          const photo = attr.photo?.[0];

          return {
            id: item.id,
            documentId: item.documentId,
            title: attr.title,
            description: attr.description,
            wasteType: attr.wasteType,
            status: attr.reportstatus || "pending",
            location: attr.location,
            createdAt: new Date(attr.createdAt).toLocaleDateString(),
            imageUrl: photo
              ? `http://localhost:1337${photo.url}`
              : "https://placehold.co/600x400?text=No+Image",
          };
        });

        setReports(mappedReports);
      } catch (error) {
        console.error("❌ Failed to fetch user reports:", error);
      } finally {
        setLoading(false);
      }
    };

    // slight delay ensures user context is ready
    const timer = setTimeout(fetchReports, 200);
    return () => clearTimeout(timer);
  }, [user, isAuthenticated, setLocation]);

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1
                className="font-heading text-3xl md:text-4xl font-bold mb-2"
                data-testid="text-page-title"
              >
                My Complaints
              </h1>
              <p
                className="text-muted-foreground"
                data-testid="text-page-subtitle"
              >
                Track and manage your submitted waste reports
              </p>
            </div>
            <Link href="/report">
              <Button className="gap-2" data-testid="button-new-report">
                <Plus className="h-4 w-4" />
                New Report
              </Button>
            </Link>
          </div>

          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-chart-2/10 text-chart-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-chart-2" />
                Pending
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-sm">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                Assigned
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-chart-1/10 text-chart-1 text-sm">
                <div className="w-2 h-2 rounded-full bg-chart-1" />
                Resolved
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-500/10 text-slate-600 text-sm">
                <div className="w-2 h-2 rounded-full bg-slate-500" />
                Closed
              </div>
            </div>
          </div>

          {loading ? (
            <p>Loading complaints...</p>
          ) : reports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report) => (
                <ComplaintCard key={report.id} {...report} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No complaints submitted yet
              </p>
              <Link href="/report">
                <Button>Submit Your First Report</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
