import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import strapiClient from "../services/strapiClient";
import { Link } from "react-router-dom";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";

type DriverProfile = {
  name: string;
  email?: string;
  phone?: string;
  driverStatus?: string;
  assigned_count?: number;
};

export default function DriverProfilePage() {
  const { user, logout, setUser } = useAuth();
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.documentId) return;

    const fetchProfile = async () => {
      try {
        const res = await strapiClient.get(
          `/drivers?filters[documentId][$eq]=${user.documentId}`
        );

        const item = res.data?.data?.[0];
        if (!item) return;

        setProfile({
          name: item.name,
          email: item.email,
          phone: item.phone,
          driverStatus: item.driverStatus,
          assigned_count: item.assigned_count,
        });

        setUser((prev) =>
          prev
            ? {
                ...prev,
                name: item.name,
                email: item.email,
              }
            : prev
        );
      } catch (err) {
        console.error("Failed to fetch driver profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.documentId]);

  if (loading) return <p className="p-4">Loading profile…</p>;

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-xl mx-auto space-y-8">

        {/* HEADER */}
        <Header title="Driver Profile" showBack/>

        {/* PROFILE SUMMARY */}
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-base">
              {profile?.name ?? user?.name}
            </h3>

            {profile?.driverStatus && (
              <Badge
                variant={
                  profile.driverStatus === "active"
                    ? "assigned"
                    : "default"
                }
              >
                {profile.driverStatus}
              </Badge>
            )}
          </div>

          <div className="text-sm text-muted-foreground space-y-1">
            {profile?.email && <p>{profile.email}</p>}
            {profile?.phone && <p>{profile.phone}</p>}
          </div>
        </Card>

        {/* STATS / INFO */}
        <Card className="p-4 space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Activity
          </h4>

          {profile?.assigned_count !== undefined ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {profile.assigned_count}
                </p>
                <p className="text-sm text-muted-foreground">
                  Assigned Reports
                </p>
              </div>

              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1 rounded-md bg-primary/10 text-primary 
             px-3 py-1 text-sm font-medium hover:bg-primary/20 transition-colors"
              >
                View Dashboard
              </Link>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No assignments yet
            </p>
          )}
        </Card>

        {/* LOGOUT */}
        <Card className="p-4">
          <Button
            variant={"destructive"}
            className="w-full"
            onClick={logout}
          >
            Logout
          </Button>
        </Card>

      </div>
    </div>
  );
}
