import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, User, Clock, ArrowLeft } from "lucide-react";
import strapiClient from "@/services/strapiClient";

interface Driver {
  id: string | number;
  name: string;
}

interface UpdateItem {
  id: string;
  actor: string;
  message: string;
  timestamp: string;
}

interface Report {
  id: string;
  title: string;
  description: string;
  wasteType: string;
  status: "pending" | "assigned" | "resolved" | "closed";
  location: string;
  imageUrl?: string;
  createdAt: string;
  submittedBy?: string;

  assignedDriver?: {
    id: string | number;
    name: string;
    phone?: string;
    email?: string;
  } | null;
  assignedAt?: string | null;
  updates?: UpdateItem[];
}

export default function ComplaintDetail() {
  const [, params] = useRoute("/complaint/:id");
  const [, setLocation] = useLocation();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  const statusColors = {
    pending: "bg-chart-2/10 text-chart-2 border-chart-2/20",
    assigned: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    resolved: "bg-chart-1/10 text-chart-1 border-chart-1/20",
    closed: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  };

  useEffect(() => {
    if (!params?.id) return;

    const fetchReport = async () => {
      try {
        const res = await strapiClient.get(
          `/reports?filters[documentId][$eqi]=${params.id}&populate=*`
        );
        const item = res.data.data[0];
        if (!item) return;

        const photo = item.photo?.[0];
        const driverRaw = item.driver ?? item.assignedDriver ?? null;
        const assignedDriver = driverRaw
          ? { id: driverRaw.id, name: driverRaw.name ?? driverRaw.attributes?.name, phone: driverRaw.phone || driverRaw.attributes?.phone,
      email: driverRaw.email || driverRaw.attributes?.email, }
          : null;

        const updates = item.updates?.map((u: any) => ({
          id: u.id,
          actor: u.actor || "Admin",
          message: u.message,
          timestamp: u.timestamp || u.createdAt,
        })) ?? [];


        const mapped: Report = {
          id: item.id,
          title: item.title,
          description: item.description,
          wasteType: item.wasteType,
          status: item.reportstatus || "pending",
          location: item.location,
          submittedBy: item.submittedBy,
          assignedDriver,
          assignedAt:item.assignedAt || null,
          updates,
          createdAt: new Date(item.createdAt).toLocaleString(),
          imageUrl: photo
            ? `http://localhost:1337${photo.url}`
            : "https://placehold.co/600x400?text=No+Image",
        };

        setReport(mapped);
      } catch (err) {
        console.error("❌ Failed to load report details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [params?.id]);

  const handleBack = () => {
  if (window.history.length > 1) {
    window.history.back(); // go back to the previous page
  } else {
    setLocation("/profile"); // fallback route if no history exists
  }
};


  if (loading) return <p className="text-center py-20">Loading report details...</p>;
  if (!report) return <p className="text-center py-20">No report found.</p>;

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* 🡐 Back Button */}
          <div className="mb-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-3 py-2 rounded-md border transition-colors
                         bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm
                         text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700
                         hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back</span>
            </button>
          </div>

          {/* HEADER */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="font-heading text-3xl md:text-4xl font-bold">
                {report.title}
              </h1>
              <Badge className={statusColors[report.status]}>
                {report.status.replace("-", " ")}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{report.submittedBy || "Unknown Reporter"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{report.createdAt}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{report.location}</span>
              </div>
            </div>
          </div>

          {/* IMAGE */}
          <Card className="overflow-hidden">
            <img
              src={report.imageUrl}
              alt={report.title}
              className="w-full aspect-video object-cover"
            />
          </Card>

          {/* ISSUE DETAILS */}
          <Card className="p-8">
            <h2 className="font-heading text-2xl font-semibold mb-4">
              Issue Details
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Waste Type</p>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {report.wasteType}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-foreground">{report.description}</p>
              </div>
            </div>
          </Card>

          {/* DRIVER */}
          <Card className="p-8">
            <h2 className="font-heading text-2xl font-semibold mb-4">
              Assigned Driver
            </h2>

            {report.assignedDriver ? (
              <div className="space-y-2">
                <p className="text-lg font-medium">{report.assignedDriver.name}</p>

                {report.assignedDriver.phone && (
                  <p className="text-muted-foreground">
                    📞 {report.assignedDriver.phone}
                  </p>
                )}

                {report.assignedDriver.email && (
                  <p className="text-muted-foreground">
                    ✉️ {report.assignedDriver.email}
                  </p>
                )}

                <p className="text-sm text-muted-foreground">
                  Assigned on: {new Date(report.assignedAt ?? "").toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">No driver assigned yet.</p>
            )}
          </Card>



          {/* TIMELINE */}
          <Card className="p-8 bg-card border border-border">
          <h2 className="font-heading text-2xl font-semibold mb-4">
            Updates & Timeline
          </h2>

            <div className="space-y-4 max-h-72 overflow-auto pr-2">
              <div className="flex gap-4 border-l-4 border-primary pl-4">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">
                    Report submitted by {report.submittedBy || "User"}
                  </p>
                  <p className="text-sm text-muted-foreground">{report.createdAt}</p>
                </div>
              </div>

              {report.assignedDriver && (
                <div className="flex gap-4 border-l-4 border-border pl-4">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Admin</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(report.assignedAt ?? Date.now()).toLocaleString()}
                    </p>
                    <p className="text-foreground">
                      Assigned driver: {report.assignedDriver.name}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>


          {/* ACTION BUTTONS */}
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1">
              Share Report
            </Button>
            <Button className="flex-1">Follow Updates</Button>
          </div>
        </div>
      </div>
    </div>
  );
}


