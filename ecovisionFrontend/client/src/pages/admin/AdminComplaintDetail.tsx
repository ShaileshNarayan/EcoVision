// AdminComplaintDetail.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, User, Clock, ArrowLeft } from "lucide-react";
import strapiClient from "@/services/strapiClient";

// /**
//  * AdminComplaintDetail
//  * - Uses Strapi v5 endpoints and the custom POST /reports/update-by-documentId endpoint
//  * - Assign driver via documentId-safe endpoint (we pass report.documentId)
//  * - Dev fallback image: /mnt/data/915e9685-5831-42a5-8aa9-e513a94078be.png
//  */

type UpdateItem = {
  id: string;
  actor: string;
  message: string;
  timestamp: string;
};

type Driver = {
  id: string | number;
  name: string;
  phone?: string | null;
  email?: string | null;
  documentId?: string | null;
  assigned_count?: number;
};

interface Report {
  id: number | string;
  documentId?: string | null;
  title: string;
  description?: string;
  wasteType?: string;
  status: "pending" | "assigned" | "resolved" | "closed";
  location?: string;
  imageUrl?: string;
  createdAt?: string;
  submittedBy?: string;
  assignedDriver?: Driver | null;
  assignedAt?: string|null;
  updates?: UpdateItem[];
}

export default function AdminComplaintDetail() {
  const [, params] = useRoute("/admin/complaint/:id");
  const [, setLocation] = useLocation();

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [driverLoading, setDriverLoading] = useState(false);
  const [assigningDriverId, setAssigningDriverId] = useState<string | number | "">("");

  const statusColors: Record<Report["status"], string> = {
    pending: "bg-chart-2/10 text-chart-2 border-chart-2/20",
    assigned: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    resolved: "bg-chart-1/10 text-chart-1 border-chart-1/20",
    closed: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  };

  const parseUpdates = (item: any): UpdateItem[] => {
    if (!item) return [];
    if (Array.isArray(item.updates) && item.updates.length > 0) {
      return item.updates.map((u: any) => ({
        id: u.id ?? `${Date.now()}-${Math.random()}`,
        actor: u.actor ?? u.by ?? "system",
        message: u.message ?? u.text ?? "",
        timestamp: u.timestamp ?? u.createdAt ?? new Date().toISOString(),
      }));
    }

    const nested = item.updates?.data?.map((u: any) => {
      const ua = u.attributes ?? u;
      return {
        id: u.id ?? ua.id ?? `${Date.now()}-${Math.random()}`,
        actor: ua.actor ?? ua.by ?? "system",
        message: ua.message ?? ua.text ?? "",
        timestamp: ua.timestamp ?? ua.createdAt ?? new Date().toISOString(),
      };
    }) ?? [];

    return nested;
  };

  const parseDriver = (raw: any): Driver | null => {
    if (!raw) return null;
    if (raw.name) {
      return {
        id: raw.id ?? raw._id,
        name: raw.name,
        phone: raw.phone ?? null,
        email: raw.email ?? null,
        documentId: raw.documentId ?? null,
      };
    }
    if (raw.data?.attributes) {
      return {
        id: raw.data.id,
        name: raw.data.attributes.name,
        phone: raw.data.attributes.phone ?? null,
        email: raw.data.attributes.email ?? null,
        documentId: raw.data.attributes.documentId ?? null,
      };
    }
    if (raw.attributes?.name) {
      return {
        id: raw.id,
        name: raw.attributes.name,
        phone: raw.attributes.phone ?? null,
        email: raw.attributes.email ?? null,
        documentId: raw.attributes.documentId ?? null,
      };
    }
    return null;
  };

  useEffect(() => {
    if (!params?.id) return;

    let mounted = true;
    setLoading(true);
    setError(null);

    const fetchReport = async () => {
      try {
        const res = await strapiClient.get(`/reports?filters[documentId][$eq]=${params.id}&populate=*`);
        const item = Array.isArray(res.data?.data) ? res.data.data[0] : res.data?.data ?? res.data;
        if (!item) {
          if (!mounted) return;
          setReport(null);
          return;
        }

        const photo = item.photo?.[0] ?? null;
        const driverRaw = item.driver ?? item.assignedDriver ?? null;
        const driver = parseDriver(driverRaw);

        const mapped: Report = {
          id: item.id ?? item._id ?? params.id,
          documentId: item.documentId ?? null,
          title: item.title ?? "Untitled",
          description: item.description ?? "",
          wasteType: item.wasteType ?? "",
          status: (item.reportstatus ?? item.status ?? "pending") as Report["status"],
          location: item.location ?? "",
          submittedBy: item.submittedBy ?? item.reportedBy ?? "",
          createdAt: item.createdAt ? new Date(item.createdAt).toLocaleString() : new Date().toLocaleString(),
          imageUrl:
            photo?.url
              ? (photo.url.startsWith("http") ? photo.url : `http://localhost:1337${photo.url}`)
              : "/mnt/data/915e9685-5831-42a5-8aa9-e513a94078be.png",
          assignedDriver: driver,
          assignedAt: item.assignedAt,
          updates: parseUpdates(item),
        };

        if (!mounted) return;
        setReport(mapped);
      } catch (err: any) {
        console.error("Failed to load admin report:", err);
        if (!mounted) return;
        setError("Failed to load complaint");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchReport();
    return () => {
      mounted = false;
    };
  }, [params?.id]);

  // useEffect(() => {
  //   let mounted = true;
  //   const fetchDrivers = async () => {
  //     setDriverLoading(true);
  //     try {
  //       const res = await strapiClient.get("/drivers?pagination[pageSize]=100&populate=*");
  //       const raw = Array.isArray(res.data?.data) ? res.data.data : res.data?.data ?? res.data ?? [];
  //       const list: Driver[] = raw
  //         .map((d: any) => {
  //           if (!d) return null;
  //           if (d.name) return { id: d.id ?? d._id, name: d.name, phone: d.phone ?? null, email: d.email ?? null, documentId: d.documentId ?? null, assigned_count: d.attributes.assigned_count ?? 0, };
  //           if (d.attributes) return { id: d.id, name: d.attributes.name ?? `Driver ${d.id}`, phone: d.attributes.phone ?? null, email: d.attributes.email ?? null, documentId: d.attributes.documentId ?? null, assigned_count: d.attributes.assigned_count ?? 0, };
  //           if (d.data?.attributes) return { id: d.data.id, name: d.data.attributes.name, phone: d.data.attributes.phone ?? null, email: d.data.attributes.email ?? null, documentId: d.data.attributes.documentId ?? null, assigned_count: d.attributes.assigned_count ?? 0, };
  //           return null;
  //         })
  //         .filter((x: Driver | null): x is Driver => x !== null);
  //       if (mounted) setDrivers(list);
  //     } catch (err) {
  //       console.warn("Failed to fetch drivers list:", err);
  //     } finally {
  //       if (mounted) setDriverLoading(false);
  //     }
  //   };

  //   fetchDrivers();
  //   return () => {
  //     mounted = false;
  //   };
  // }, []);
  useEffect(() => {
  let mounted = true;

  const fetchDrivers = async () => {
    setDriverLoading(true);
    try {
      const res = await strapiClient.get(
        "/drivers?pagination[pageSize]=100"
      );

      const raw = Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      const list: Driver[] = raw.map((d: any) => ({
        id: d.id,
        name: d.name,
        phone: d.phone ?? null,
        email: d.email ?? null,
        documentId: d.documentId ?? null,
        assigned_count: d.assigned_count ?? 0,
      }));

      if (mounted) setDrivers(list);
    } catch (err) {
      console.warn("Failed to fetch drivers list:", err);
    } finally {
      if (mounted) setDriverLoading(false);
    }
  };

  fetchDrivers();
  return () => {
    mounted = false;
  };
}, []);


  // const assignDriver = async (driverId: string | number, driverName?: string) => {
  //   if (!report?.documentId) {
  //     setError("Cannot assign driver: missing report documentId");
  //     return;
  //   }
  //   const selectedDriver = drivers.find(d => String(d.id) === String(driverId))
  //   if (!selectedDriver?.documentId) {
  //     throw new Error("Missing driver documentId")
  //   }
  //   setSaving(true);
  //   setError(null);
  //   const assignedAt = new Date().toISOString();

  //   const prev = report.assignedDriver;
  //   const prevCount = drivers?.find(d => d.id === driverId)?.assigned_count ?? 0;

  //   const prevStatus = report.status;

  //   setReport((r) =>
  //     r ? { ...r, assignedDriver: { id: driverId, name: driverName ?? String(driverId) }, status: "assigned" } : r
  //   );

    
  //   try {
  //     await strapiClient.post("/reports/update-by-documentId", {
  //       documentId: report.documentId,
  //       data: { driver: selectedDriver.id, reportstatus: "assigned", assignedAt, },
  //     }
  //     );
  //     await strapiClient.put(
  //       `/drivers/update-by-documentId`,
  //       {
  //         documentId: selectedDriver.documentId,
  //         data: {
  //           assigned_count: (selectedDriver.assigned_count ?? 0) + 1,
  //           last_assigned_at: assignedAt
  //         }
  //       }
  //     )


  //     setReport((r) =>
  //       r
  //         ? {
  //             ...r,
  //             updates: [
  //               {
  //                 id: `u-${Date.now()}`,
  //                 actor: "Admin",
  //                 message: `Assigned driver: ${driverName ?? driverId}`,
  //                 timestamp: new Date().toISOString(),
  //               },
  //               ...(r.updates ?? []),
  //             ],
  //           }
  //         : r
  //     );
  //   } catch (err: any) {
  //     console.error("Failed to assign driver:", err);
  //     setError("Failed to assign driver");
  //     setReport((r) => (r ? { ...r, assignedDriver: prev, status: prevStatus } : r));
  //   } finally {
  //     setSaving(false);
  //   }
  // };
    const assignDriver = async (driverId: string | number, driverName?: string) => {
  if (!report?.documentId) {
    setError("Missing report documentId");
    return;
  }

  const selectedDriver = drivers.find(
    d => String(d.id) === String(driverId)
  );

  if (!selectedDriver?.documentId) {
    setError("Missing driver documentId");
    return;
  }

  setSaving(true);
  setError(null);

  const assignedAt = new Date().toISOString();

  try {
    // 1️⃣ Update REPORT
    await strapiClient.post("/reports/update-by-documentId", {
      documentId: report.documentId,
      data: {
        driver: selectedDriver.id,
        reportstatus: "assigned",
        assignedAt,
      },
    });

    // 2️⃣ Update DRIVER (NOW WORKS)
    await strapiClient.post("/drivers/update-by-documentId", {
      documentId: selectedDriver.documentId,
      data: {
        assigned_count: (selectedDriver.assigned_count ?? 0) + 1,
        last_assigned_at: assignedAt,
      },
    });

    // 3️⃣ Update UI
    setReport(r =>
      r
        ? {
            ...r,
            assignedDriver: selectedDriver,
            status: "assigned",
            assignedAt,
          }
        : r
    );

    setDrivers(ds =>
      ds.map(d =>
        d.documentId === selectedDriver.documentId
          ? {
              ...d,
              assigned_count: (d.assigned_count ?? 0) + 1,
            }
          : d
      )
    );
  } catch (err) {
    console.error("Failed to assign driver:", err);
    setError("Failed to assign driver");
  } finally {
    setSaving(false);
  }
};

  const changeStatus = async (newStatus: Report["status"]) => {
    if (!report?.documentId) {
      setError("Cannot change status: missing documentId");
      return;
    }
    setSaving(true);
    setError(null);
    const prev = report.status;
    setReport((r) => (r ? { ...r, status: newStatus } : r));

    try {
      await strapiClient.post("/reports/update-by-documentId", {
        documentId: report.documentId,
        data: { reportstatus: newStatus },
      });

      setReport((r) =>
        r
          ? {
              ...r,
              updates: [
                {
                  id: `u-${Date.now()}`,
                  actor: "Admin",
                  message: `Status changed to ${newStatus}`,
                  timestamp: new Date().toISOString(),
                },
                ...(r.updates ?? []),
              ],
            }
          : r
      );
    } catch (err) {
      console.error("Failed to change status:", err);
      setError("Failed to change status");
      setReport((r) => (r ? { ...r, status: prev } : r));
    } finally {
      setSaving(false);
    }
  };

  const markResolved = () => changeStatus("resolved");

  const handleBack = () => {
    setLocation("/admin/complaints");
  };

  const quickAssignButtons = useMemo(() => {
    if (drivers.length > 0) return drivers.slice(0, 3);
    return [
      { id: "driver_1", name: "Ram Kumar" },
      { id: "driver_2", name: "Sita Devi" },
      { id: "driver_3", name: "Kumar" },
    ];
  }, [drivers]);

  if (loading) return <p className="text-center py-20 text-muted-foreground">Loading complaint...</p>;
  if (!report) return <p className="text-center py-20 text-muted-foreground">Complaint not found.</p>;

  return (
    <div className="min-h-screen py-20 bg-background text-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back & quick actions */}
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-3 py-2 rounded-md border bg-card text-foreground border-border hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            </div>
          </div>

          {/* Header */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">{report.title}</h1>
              <Badge className={statusColors[report.status]}>{report.status}</Badge>
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

          {/* Image */}
          <Card className="overflow-hidden bg-card border-border">
            <img src={report.imageUrl} alt={report.title} className="w-full aspect-video object-cover" />
          </Card>

          {/* Issue Details */}
          <Card className="p-8 bg-card border border-border">
            <h2 className="font-heading text-2xl font-semibold mb-4 text-foreground">Issue Details</h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Waste Type</p>
                <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                  {report.wasteType || "Unknown"}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-foreground">{report.description}</p>
              </div>
            </div>
          </Card>

          {/* Assign Driver */}
          <Card className="p-6 bg-card border border-border">
            <h3 className="text-xl font-semibold text-foreground mb-3">Assigned Driver</h3>

            {report.assignedDriver ? (
              <div>
                <div className="text-lg font-medium text-foreground">{report.assignedDriver.name}</div>
                <div className="text-sm text-muted-foreground">Driver ID: {report.assignedDriver.id}</div>
                <div className="mt-3">
                  <Button
                    onClick={() => {
                      const q = quickAssignButtons[0];
                      if (q && q.id != null) assignDriver(q.id, q.name);
                    }}
                    className="bg-destructive/80 hover:bg-destructive text-foreground"
                    disabled={saving}
                  >
                    Reassign (quick)
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground mb-3">No driver assigned yet. Assign from below:</p>

                <div className="flex gap-3 items-center">
                  <select
                    value={assigningDriverId ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      const numeric = String(v).match(/^\d+$/) ? Number(v) : v;
                      setAssigningDriverId(numeric);
                    }}
                    className="px-3 py-2 rounded bg-card border border-border text-foreground"
                  >
                    <option value="">Select driver...</option>
                    {drivers.map((d) => (
                      <option key={String(d.id)} value={String(d.id)}>
                        {d.name}
                      </option>
                    ))}
                  </select>

                  <Button
                    onClick={() => {
                      if (!assigningDriverId) return;
                      const d = drivers.find((x) => String(x.id) === String(assigningDriverId));
                      if (!d || d.id == null) {
                        setError("Invalid driver selected");
                        return;
                      }
                      assignDriver(d.id, d.name);
                    }}
                    disabled={saving || !assigningDriverId}
                  >
                    Assign
                  </Button>

                  <div className="flex flex-wrap gap-2 ml-0 md:ml-4">
                    {quickAssignButtons.map((d) => {
                      if (d.id == null) return null;
                      return (
                        <Button
                          key={String(d.id)}
                          onClick={() => assignDriver(d.id, d.name)}
                          className="bg-destructive/80 hover:bg-destructive text-foreground"
                          disabled={saving}
                        >
                          {d.name}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {driverLoading && <p className="text-sm text-muted-foreground mt-2">Loading drivers...</p>}
              </div>
            )}
          </Card>

          {/* Updates & Timeline */}
          <Card className="p-8 bg-card border border-border">
            <h2 className="font-heading text-2xl font-semibold mb-4 text-foreground">Updates & Timeline</h2>

            <div className="space-y-4 max-h-72 overflow-auto pr-2">
              <div className="flex gap-4 border-l-4 border-destructive pl-4">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">Report submitted by {report.submittedBy || "User"}</p>
                  <p className="text-sm text-muted-foreground">{report.createdAt}</p>
                </div>
              </div>
              
              {/* If driver is assigned, show a timeline entry */}
              {report.assignedDriver && (
                <div className="flex gap-4 border-l-4 border-border pl-4">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      Admin
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(report.assignedAt ?? Date.now()).toLocaleString()}
                    </p>
                    <p className="text-foreground">
                      Assigned driver: {report.assignedDriver.name}
                    </p>
                  </div>
                </div>
              )}

              {/* {(report.updates ?? []).map((u) => (
                <div key={u.id} className="flex gap-4 border-l-4 border-border pl-4">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{u.actor}</p>
                    <p className="text-xs text-muted-foreground">{new Date(u.timestamp).toLocaleString()}</p>
                    <p className="text-foreground">{u.message}</p>
                  </div>
                </div>
              ))} */}
            </div>
          </Card>

          {/* Actions */}
          {/* <div className="flex gap-3">
            {report.status !== "resolved" && report.status !== "closed" && (
              <Button onClick={markResolved} disabled={saving} className="bg-success/80 hover:bg-success text-foreground">
                Mark Resolved
              </Button>
            )}
          </div> */}

          {error && <p className="text-destructive mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
}