import { Link, useLocation } from "wouter";
import { Menu, X, Leaf, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/my-complaints", label: "My Complaints" },
    { href: "/report", label: "Report Issue" },
    { href: "/help", label: "Help & FAQs" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/70 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md px-2 py-1"
          >
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-heading text-xl font-bold">EcoVision</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={isActive(link.href) ? "secondary" : "ghost"}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Right side: Theme + Auth */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center gap-2 px-2 cursor-pointer"
                  onClick={() => setLocation("/profile")}
                >
                  <User className="h-5 w-5 text-primary" />
                  <span className="font-medium">{user.name || "User"}</span>
                </div>
                <Button variant="destructive" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      <div
  className={`absolute top-16 left-0 right-0 z-40 rounded-b-2xl backdrop-blur-2xl bg-background/60 supports-[backdrop-filter]:bg-background/50 border-t border-white/10 shadow-lg transform transition-all duration-300 ease-in-out ${
    mobileMenuOpen
      ? "opacity-100 translate-y-0"
      : "opacity-0 -translate-y-4 pointer-events-none"
  } md:hidden`}
>
        <div className="p-6 space-y-4">
          <span className="font-heading text-xl font-semibold">Menu</span>

          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant={isActive(link.href) ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Button>
            </Link>
          ))}

          <div className="border-t border-muted pt-4">
            {user ? (
              <>
                <div
                  className="flex items-center gap-2 px-2 cursor-pointer mb-2"
                  onClick={() => {
                    setLocation("/profile");
                    setMobileMenuOpen(false);
                  }}
                >
                  <User className="h-5 w-5 text-primary" />
                  <span>{user.name || "User"}</span>
                </div>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button
                  className="w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

