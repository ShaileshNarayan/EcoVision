import { useEffect, useState, useMemo } from "react";
import strapiClient from "@/services/strapiClient";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/StatsCard";
import { ComplaintCard } from "@/components/ComplaintCard";
import { ClipboardList, CheckCircle, Clock, Users } from "lucide-react";
import heroImage from "@assets/stock_images/citizens_volunteers__a8fdae5b.jpg";

export default function HomePage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch complaints from Strapi
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await strapiClient.get(
          "http://localhost:1337/api/reports?populate=photo&sort=createdAt:desc"
        );

        const mapped = response.data.data.map((item: any) => {
          const attr = item;
          const photo = attr.photo?.[0];
          return {
            id: item.id,
            documentId: attr.documentId,
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

        setComplaints(mapped);
      } catch (error) {
        console.error("❌ Failed to fetch reports from Strapi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const [userCount, setUserCount] = useState<number | null>(null);
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/users/count");
        const data = await response.json();
        setUserCount(data.count);
      } catch (error) {
        console.error("❌ Failed to fetch user count:", error);
      }
    };

    fetchUserCount();
  }, []);

  // Compute real-time stats from fetched complaints
  const stats = useMemo(() => {
  const total = complaints.length;

  const pending = complaints.filter(c => c.status?.toLowerCase() === "pending").length;
  const assigned = complaints.filter(c => c.status?.toLowerCase() === "assigned").length;
  const resolved = complaints.filter(c => c.status?.toLowerCase() === "resolved").length;

  return [
    {
      title: "Total Reports",
      value: total.toString(),
      icon: ClipboardList,
      description: "Live data from reports",
    },
    {
      title: "Resolved",
      value: resolved.toString(),
      icon: CheckCircle,
      description: `${total > 0 ? Math.round((resolved / total) * 100) : 0}% resolved`,
    },
    {
      title: "In Progress",
      value: (pending + assigned).toString(),
      icon: Clock,
      description: "Being addressed",
    },
    {
      title: "Active Users",
      value: userCount !== null ? userCount.toString() : "...",
      icon: Users,
      description: "Registered users",
    },
  ];
}, [complaints, userCount]);


  // limit to 3 recent unless "View All" is clicked
  const visibleComplaints = showAll ? complaints : complaints.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Community cleanup"
            className="w-full h-full object-cover"
            data-testid="img-hero"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-primary/40" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold mb-6" data-testid="text-hero-title">
            Revolutionizing Waste Collection
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" data-testid="text-hero-subtitle">
            Report waste issues in your community and help create a cleaner, greener future for everyone.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/report">
              <Button size="lg" variant="secondary" className="bg-white/95 hover:bg-white text-primary" data-testid="button-hero-report">
                Report an Issue
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 backdrop-blur-sm" data-testid="button-hero-login">
                Login / Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <StatsCard key={stat.title} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Complaints Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2" data-testid="text-activities-title">
                Latest Cleanup Activities
              </h2>
              <p className="text-muted-foreground" data-testid="text-activities-subtitle">
                Recent reports from our community
              </p>
            </div>
            <Button
              variant="outline"
              data-testid="button-view-all"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show Less" : "View All"}
            </Button>
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground">Loading reports...</p>
          ) : visibleComplaints.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleComplaints.map((complaint) => (
                <div key={complaint.id} className="pointer-events-none opacity-95">
                  <ComplaintCard {...complaint} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No reports available</p>
          )}
        </div>
      </section>
    </div>
  );
}

