import strapiClient from "@/services/strapiClient";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ComplaintCard } from "@/components/ComplaintCard";
import { LogOut, Mail } from "lucide-react";

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

export default function Profile() {
  const { user, logout, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  useEffect(() => {
  if ( !isAuthenticated || !user || !user.name ) return; // wait until user is fully loaded

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
      console.error("❌ Failed to fetch reports from Strapi:", error);
    } finally {
      setLoading(false);
    }
  };

  // slight delay ensures AuthContext is ready before first fetch
  const timer = setTimeout(fetchReports, 200);
  return () => clearTimeout(timer);
}, [user]);



  const reportsCount = reports.length;
  const resolvedCount = reports.filter((r) => r.status === "closed" || r.status === "resolved").length;

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1
            className="font-heading text-3xl md:text-4xl font-bold"
            data-testid="text-page-title"
          >
            Profile & Settings
          </h1>

          <Card className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {user?.name
                    ? user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="font-heading text-2xl font-semibold">
                    {user?.name || "User"}
                  </h2>
                  <div className="flex flex-wrap gap-4 mt-2 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{user?.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-8">
                  <div>
                    <p className="text-2xl font-bold">{reportsCount}</p>
                    <p className="text-sm text-muted-foreground">Total Reports</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{resolvedCount}</p>
                    <p className="text-sm text-muted-foreground">Resolved</p>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </Card>

          <div>
            <h2 className="font-heading text-2xl font-semibold mb-6">
              Submission History
            </h2>

            {loading ? (
              <p>Loading reports...</p>
            ) : reports.length === 0 ? (
              <p className="text-muted-foreground">
                No reports submitted yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reports.map((report) => (
                  <ComplaintCard key={report.id} {...report} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}