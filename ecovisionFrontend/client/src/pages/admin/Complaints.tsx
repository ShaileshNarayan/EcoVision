import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar } from "lucide-react";
import strapiClient from "@/services/strapiClient";
import { useLocation, Link } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/** Keep types consistent with ComplaintCard / admin card usage */
interface AdminReport {
  id: number;
  documentId?: string;
  title: string;
  description?: string;
  wasteType?: string;
  location?: string;
  submittedBy?: string | null;    // username (from client)
  emailId?: string | null;        // emailId field from Strapi (new)
  createdAt: string;
  reportstatus?: string | null; // raw from Strapi
  status: "pending" | "assigned" | "resolved";
  imageUrl?: string | null;
}
type TimeFilter = "today" | "week" | "month" | "all";
type StatusFilter = "all" | "pending" | "assigned" | "resolved";

export default function Complaints() {
  const [, setLocation] = useLocation();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // client-side pagination
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  const [allReports, setAllReports] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const getTimeBoundary = (filter: TimeFilter): Date | null => {
    const now = new Date();
    if (filter === "all") return null;
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    if (filter === "today") return start;
    if (filter === "week") {
      const day = start.getDay();
      const diff = day === 0 ? 6 : day - 1;
      start.setDate(start.getDate() - diff);
      return start;
    }
    if (filter === "month") {
      start.setDate(1);
      return start;
    }
    return null;
  };
  // Fetch ALL reports from Strapi (no server pagination) and map attributes
  useEffect(() => {
    let mounted = true;

    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);

        // fetch all reports, include media
        const res = await strapiClient.get(
          "http://localhost:1337/api/reports?populate=photo&sort=createdAt:desc"
        );

        const raw = res.data?.data ?? [];
        const mapped: AdminReport[] = raw.map((item: any) => {
  
        const photo = item.photo?.[0] ?? null;

        // Normalize status
        const rawStatus = item.reportstatus;
        const status =
          rawStatus?.toLowerCase() === "assigned"
            ? "assigned"
            : rawStatus?.toLowerCase() === "resolved"
            ? "resolved"
            : "pending";

        return {
          id: item.id,
          documentId: item.documentId,
          title: item.title ?? "Untitled",
          description: item.description ?? "",
          wasteType: item.wasteType ?? "",
          location: item.location ?? "",
          submittedBy: item.submittedBy ?? null,
          emailId: item.emailId ?? null,
          createdAt: item.createdAt,
          reportstatus: item.reportstatus ?? null,
          status,
          imageUrl: photo?.url
            ? `http://localhost:1337${photo.url}`
            : null,
        };
      });
        if (!mounted) return;
        setAllReports(mapped);
        setPage(1); // reset to first page when fresh data loads
      } catch (err: any) {
        console.error("Failed to fetch admin complaints:", err);
        if (!mounted) return;
        setError("Failed to load complaints");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchReports();
    return () => {
      mounted = false;
    };
  }, []);

  // derived pagination values
  // const totalReports = allReports.length;
  // const totalPages = Math.max(1, Math.ceil(totalReports / pageSize));

  // slice for current page
  // const pageReports = useMemo(() => {
  //   const start = (page - 1) * pageSize;
  //   return allReports.slice(start, start + pageSize);
  // }, [allReports, page]);
  const filteredReports = useMemo(() => {
  const boundary = getTimeBoundary(timeFilter);

  let byTime = allReports;
  if (boundary) {
    byTime = allReports.filter((r) => new Date(r.createdAt).getTime() >= boundary.getTime());
  }

  const byStatus =
    statusFilter === "all" ? byTime : byTime.filter((r) => r.status === statusFilter);

  return byStatus;
  }, [allReports, timeFilter, statusFilter]);

  const totalReports = filteredReports.length;
  const totalPages = Math.max(1, Math.ceil(totalReports / pageSize));
  const pageReports = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredReports.slice(start, start + pageSize);
  }, [filteredReports, page]);


  // NAVIGATION: encode the documentId to make route safe for special characters.
  const handleView = (docId?: string | number) => {
    if (!docId) return;
    setLocation(`/admin/complaint/${encodeURIComponent(String(docId))}`);
  };

  const handleAssignDriver = (report: AdminReport) => {
    // keep original assign driver behavior (open modal) — not changed here
    console.log("Open assign driver modal for:", report.id);
    // TODO: call existing modal open function (if available)
  };

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const pagesToShow = useMemo(() => {
    const pages: number[] = [];
    const maxPages = 5;
    let start = Math.max(1, page - Math.floor(maxPages / 2));
    let end = start + maxPages - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxPages + 1);
    }
    for (let p = start; p <= end; p++) pages.push(p);
    return pages;
  }, [page, totalPages]);

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold">Complaints Management</h1>
              <p className="text-muted-foreground">Review, assign, and manage all citizen reports</p>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/admin/report">
                <Button>Report Issue</Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-6">
                {/* Time Filter */}
                <Select value={timeFilter} onValueChange={(v: TimeFilter) => setTimeFilter(v)}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="This Week" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={(v: StatusFilter) => setStatusFilter(v)}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

          {loading ? (
            <Card className="p-8">
              <p className="text-center text-muted-foreground">Loading...</p>
            </Card>
          ) : error ? (
            <Card className="p-8">
              <p className="text-center text-destructive">{error}</p>
            </Card>
          ) : pageReports.length === 0 ? (
            <Card className="p-8">
              <p className="text-center text-muted-foreground">No complaints found.</p>
            </Card>
          ) : (
            <>
              <div className="space-y-6">
                {pageReports.map((r) => (
                  <Card key={r.id} className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-40 flex-shrink-0">
                        {r.imageUrl ? (
                          <img src={r.imageUrl} alt={r.title} className="w-full h-32 object-cover rounded-md" />
                        ) : (
                          <div className="w-full h-32 bg-slate-800 rounded-md flex items-center justify-center text-sm text-muted-foreground">No Image</div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-xl mb-1">{r.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">{r.description}</p>
                            <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{r.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(r.createdAt).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-3">
                            <Badge
                              className={
                                r.status === "pending"
                                  ? "bg-amber-950 text-amber-300"
                                  : r.status === "assigned"
                                  ? "bg-blue-950 text-blue-300"
                                  : "bg-emerald-950 text-emerald-300"
                              }
                            >
                              {r.status}
                            </Badge>

                            <div className="flex gap-2">
                              {/* <Button variant="outline" onClick={() => handleView(r.documentId ?? r.id)}>View Details</Button> */}
                              <Link href={`/admin/complaint/${encodeURIComponent(r.documentId ?? r.id)}`}>
                                <a>
                                  <Button variant="outline">View Details</Button>
                                </a>
                              </Link>

                              {/* Show Assign only if pending */}
                              {/* {r.status === "pending" && (
                                <Button onClick={() => handleAssignDriver(r)} className="w-full bg-red-600 hover:bg-red-700">
                                  Assign Driver
                                </Button>
                              )} */}
                            </div>
                          </div>
                        </div>

                        {/* Reporter details */}
                        <div className="mt-4 border-t border-slate-800 pt-4">
                          <p className="text-sm font-medium">Reporter Details</p>
                          <p className="text-sm text-muted-foreground">Name: {r.submittedBy ?? "Unknown"}</p>
                          <p className="text-sm text-muted-foreground">Email: {r.emailId ?? "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, totalReports)} of {totalReports}
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={!canPrev}>Prev</Button>

                  {pagesToShow.map((p) => (
                    <button
                      key={p}
                      className={`px-3 py-1 rounded ${p === page ? "bg-slate-700 text-white" : "text-muted-foreground"}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ))}

                  <Button variant="ghost" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={!canNext}>Next</Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
