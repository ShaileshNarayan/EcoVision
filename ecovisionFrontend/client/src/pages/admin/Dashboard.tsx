import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PieChart,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchAllReportsAdmin } from "@/services/adminService";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

type ReportStatus = "pending" | "assigned" | "resolved";

interface AdminReport {
  id: number;
  documentId: string;
  title: string;
  description: string;
  wasteType: string;
  location: string;
  submittedBy?: string | null;
  createdAt: string;
  status: ReportStatus;
  imageUrl?: string | null;
}

type TimeFilter = "today" | "week" | "month" | "all";
type StatusFilter = "all" | "pending" | "assigned" | "resolved";

// Use semantic colors for status badges
const statusColorClasses: Record<ReportStatus, string> = {
  pending: "bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300/40 dark:border-amber-600/40",
  assigned: "bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-300 border border-blue-300/40 dark:border-blue-600/40",
  resolved: "bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-600/40",
};

const PAGE_SIZE = 10;

export default function AdminDashboard() {
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("week");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchAllReportsAdmin();
        const mapped: AdminReport[] = data.map((item: any) => {
          const attr = item;
          const photo = attr.photo?.[0];
          const normalizedStatus: ReportStatus =
            (attr.reportstatus?.toLowerCase() as ReportStatus) || "pending";

          return {
            id: item.id,
            documentId: attr.documentId,
            title: attr.title,
            description: attr.description,
            wasteType: attr.wasteType,
            location: attr.location,
            submittedBy: attr.submittedBy ?? null,
            createdAt: attr.createdAt,
            status: normalizedStatus,
            imageUrl: photo ? `http://localhost:1337${photo.url}` : null,
          };
        });

        mapped.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setReports(mapped);
      } catch (err) {
        console.error("❌ Failed to fetch admin reports:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

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

  const { totalCount, pendingCount, assignedCount, resolvedCount, filteredReports } = useMemo(() => {
    const total = reports.length;
    let pending = 0;
    let assigned = 0;
    let resolved = 0;

    const boundary = getTimeBoundary(timeFilter);
    let byTime = reports;
    if (boundary) {
      byTime = reports.filter((r) => new Date(r.createdAt).getTime() >= boundary.getTime());
    }

    for (const r of reports) {
      if (r.status === "assigned") assigned++;
      else if (r.status === "resolved") resolved++;
      else pending++;
    }

    const byStatus =
      statusFilter === "all" ? byTime : byTime.filter((r) => r.status === statusFilter);

    return { totalCount: total, pendingCount: pending, assignedCount: assigned, resolvedCount: resolved, filteredReports: byStatus };
  }, [reports, timeFilter, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [timeFilter, statusFilter, reports.length]);

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, filteredReports.length);
  const pageReports = filteredReports.slice(startIndex, endIndex);

  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));

  return (
    <div className="min-h-screen py-10 bg-background text-foreground">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <PieChart className="h-10 w-10 text-destructive" />
              <h1 className="font-heading text-3xl md:text-4xl font-bold">Admin Dashboard</h1>
            </div>
            <p className="text-muted-foreground">Monitor and manage all waste reports</p>
          </div>

          <div className="flex items-center gap-2">
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
        </div>

        {/* Stat Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-10">
          <Card className="p-6 bg-destructive/10 border border-destructive/30 dark:bg-destructive/20 dark:border-destructive/40">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-full bg-destructive/20">
                <FileText className="h-5 w-5 text-destructive-foreground" />
              </div>
              {/* <span className="text-xs text-destructive-foreground/80">+12%</span> */}
            </div>
            <p className="text-sm text-muted-foreground mb-1">Total Reports</p>
            <p className="text-3xl font-bold text-foreground">{totalCount}</p>
          </Card>

          <Card className="p-6 bg-card border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-full bg-amber-500/10">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              {/* <span className="text-xs text-amber-500/80">+5%</span> */}
            </div>
            <p className="text-sm text-muted-foreground mb-1">Pending</p>
            <p className="text-3xl font-bold text-foreground">{pendingCount}</p>
          </Card>

          <Card className="p-6 bg-card border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-full bg-blue-500/10">
                <AlertCircle className="h-5 w-5 text-blue-500" />
              </div>
              {/* <span className="text-xs text-blue-500/80">+8%</span> */}
            </div>
            <p className="text-sm text-muted-foreground mb-1">Assigned</p>
            <p className="text-3xl font-bold text-foreground">{assignedCount}</p>
          </Card>

          <Card className="p-6 bg-card border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-full bg-emerald-500/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
              {/* <span className="text-xs text-emerald-500/80">+15%</span> */}
            </div>
            <p className="text-sm text-muted-foreground mb-1">Resolved</p>
            <p className="text-3xl font-bold text-foreground">{resolvedCount}</p>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card className="p-6 bg-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xl md:text-2xl font-semibold">Recent Reports</h2>
            <Link href="/admin/complaints">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
            
          </div>

          {loading ? (
            <div className="py-12 text-center text-muted-foreground">Loading reports...</div>
          ) : filteredReports.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">No recent reports</div>
          ) : (
            <>
              <div className="space-y-3">
                {pageReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-4"
                  >
                    <div className="h-14 w-20 overflow-hidden rounded-lg bg-muted flex-shrink-0">
                      {report.imageUrl ? (
                        <img
                          src={report.imageUrl}
                          alt={report.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{report.title || "Untitled report"}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        Reported by {report.submittedBy || "Unknown reporter"} •{" "}
                        {new Date(report.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={"capitalize " + statusColorClasses[report.status]}
                      >
                        {report.status}
                      </Badge>
                      {/* <Button size="sm" variant="outline">View</Button> */}
                      <Link href={`/admin/complaint/${encodeURIComponent(report.documentId)}`}>
                        <Button size="sm" variant="outline">View</Button>
                      </Link>

                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-muted-foreground">
                <span>{startIndex + 1}–{endIndex} of {filteredReports.length}</span>

                <div className="flex items-center gap-3 md:ml-auto">
                  <span>Page:</span>
                  <select
                    className="bg-card border border-border rounded-md px-2 py-1 text-xs outline-none"
                    value={currentPage}
                    onChange={(e) => setCurrentPage(Number(e.target.value) || 1)}
                  >
                    {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                      <option key={page} value={page}>{page}</option>
                    ))}
                  </select>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                  >
                    {"<"}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                  >
                    {">"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

