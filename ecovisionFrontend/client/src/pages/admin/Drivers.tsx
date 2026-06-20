import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Truck, Phone, MapPin } from "lucide-react";
import strapiClient from "@/services/strapiClient";

interface Driver {
  id: number;
  name: string;
  phone: string;
  vehicle: string;
  status: "available" | "assigned" | "offline";
  currentLocation: string;
  assignedTask?: string | null;
  completedToday: number;
  totalCompleted: number;
}

const statusColors = {
  available: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  assigned: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  offline: "bg-slate-500/10 text-slate-600 border-slate-500/20",
};

export default function AdminDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await strapiClient.get("/drivers?populate=*");
        const raw = res.data?.data ?? [];

        const mapped: Driver[] = raw.map((item: any) => {
          const attr = item.attributes ?? item;

          return {
            id: item.id,
            name: attr.name ?? "Unknown Driver",
            phone: attr.phone ?? "N/A",
            vehicle: attr.vehicle ?? "Unknown Vehicle",
            status: attr.status ?? "available",
            currentLocation: attr.currentLocation ?? "Unknown Location",
            assignedTask: attr.assignedTask ?? null,
            completedToday: attr.completedToday ?? 0,
            totalCompleted: attr.totalCompleted ?? 0,
          };
        });

        setDrivers(mapped);
      } catch (error) {
        console.error("❌ Failed to fetch drivers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
              <Truck className="h-8 w-8 text-red-600" />
              Driver Management
            </h1>
            <p className="text-muted-foreground">
              Monitor driver availability and performance
            </p>
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground py-10">
              Loading driver data...
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drivers.map((driver) => (
                <Card key={driver.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center">
                        <Truck className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{driver.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {driver.vehicle}
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className={statusColors[driver.status]}
                    >
                      {driver.status}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{driver.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{driver.currentLocation}</span>
                    </div>
                  </div>

                  {driver.assignedTask && (
                    <div className="bg-muted/50 p-3 rounded-md mb-4">
                      <p className="text-xs text-muted-foreground mb-1">
                        Current Task
                      </p>
                      <p className="text-sm font-medium">{driver.assignedTask}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Today</p>
                      <p className="text-xl font-bold">
                        {driver.completedToday}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Total</p>
                      <p className="text-xl font-bold">
                        {driver.totalCompleted}
                      </p>
                    </div>
                  </div>

                  {/* 🔜 We'll attach real driver detail dialog after you send the modal */}
                  <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{driver.name} — Driver Details</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">

                      {/* Vehicle Section */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Vehicle Information</h4>
                        <p className="text-sm text-muted-foreground">Vehicle: {driver.vehicle}</p>
                      </div>

                      {/* Performance Section */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Performance</h4>
                        <p className="text-sm text-muted-foreground">
                          Tasks Completed Today: {driver.completedToday}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Total Tasks Completed: {driver.totalCompleted}
                        </p>
                      </div>

                      {/* Contact Section */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Contact</h4>
                        <p className="text-sm text-muted-foreground">Phone: {driver.phone}</p>
                      </div>

                      {/* Status Section */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Current Status</h4>
                        <p className="text-sm text-muted-foreground">Status: {driver.status}</p>
                        <p className="text-sm text-muted-foreground">
                          Location: {driver.currentLocation}
                        </p>

                        {driver.assignedTask && (
                          <p className="text-sm text-muted-foreground">
                            Task: {driver.assignedTask}
                          </p>
                        )}
                      </div>

                    </div>
                  </DialogContent>
                </Dialog>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
