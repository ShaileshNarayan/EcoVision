// import { Link, useLocation } from "wouter";
// import { LayoutDashboard, ClipboardList, Truck, FileText, LogOut } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useAuth } from "@/contexts/AuthContext";
// import { useState } from "react";
// import { Menu, X } from "lucide-react";
// import { ThemeToggle } from "./ThemeToggle";

// export function AdminNav() {
//   const [location, setLocation] = useLocation();
//   const { logout } = useAuth();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const navItems = [
//     { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
//     { href: "/admin/complaints", label: "Complaints", icon: ClipboardList },
//     { href: "/admin/drivers", label: "Drivers", icon: Truck },
//     { href: "/admin/report", label: "Report Issue", icon: FileText },
//   ];

//   const isActive = (path: string) => location === path;

//   const handleLogout = () => {
//     logout();
//     setLocation("/login");
//   };

//   return (
//     <nav className="sticky top-0 z-50 bg-red-50 dark:bg-red-950/20 border-b border-red-200 dark:border-red-900 backdrop-blur-md">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           <div className="flex items-center gap-8">
//             <div className="flex items-center gap-2">
//               <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center">
//                 <span className="text-white font-bold text-sm">A</span>
//               </div>
//               <span className="font-heading text-lg font-bold">Admin Portal</span>
//             </div>

//             <div className="hidden md:flex items-center gap-1">
//               {navItems.map((item) => {
//                 const Icon = item.icon;
//                 return (
//                   <Link key={item.href} href={item.href}>
//                     <Button
//                       variant="ghost"
//                       className={`gap-2 ${
//                         isActive(item.href)
//                           ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
//                           : "hover:bg-red-100/50 dark:hover:bg-red-900/20"
//                       }`}
//                       data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
//                     >
//                       <Icon className="h-4 w-4" />
//                       {item.label}
//                     </Button>
//                   </Link>
//                 );
//               })}
//             </div>
//           </div>
//           <div className="flex items-center gap-4">
//                 <ThemeToggle />
//                 <Button
//                   variant="outline"
//                   onClick={handleLogout}
//                   className="gap-2 border-red-200 hover:bg-red-100 dark:border-red-900 dark:hover:bg-red-900/30"
//                   data-testid="button-logout"
//                 >
//                   <LogOut className="h-4 w-4" />
//                   Logout
//                 </Button>
//               </div>
//             </div>
//           </div>
//     </nav>
//   );
// }

import { Link, useLocation } from "wouter";
import { LayoutDashboard, ClipboardList, Truck, FileText, LogOut, Menu, X, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

export function AdminNav() {
  const [location, setLocation] = useLocation();
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/complaints", label: "Complaints", icon: ClipboardList },
    { href: "/admin/drivers", label: "Drivers", icon: Truck },
    { href: "/admin/report", label: "Report Issue", icon: FileText },
  ];

  const isActive = (path: string) => location === path;

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-red-50 dark:bg-red-950/20 border-b border-red-200 dark:border-red-900 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Desktop Links */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-destructive" />
              <span className="font-heading text-lg font-bold">Admin Portal</span>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={`gap-2 ${
                        isActive(item.href)
                          ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                          : "hover:bg-red-100/50 dark:hover:bg-red-900/20"
                      }`}
                      data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side: Theme + Logout / Mobile Menu */}
          <div className="flex items-center gap-2 md:gap-4">
            <ThemeToggle />

            {/* Desktop Logout */}
            <div className="hidden md:flex">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="gap-2 border-red-200 hover:bg-red-100 dark:border-red-900 dark:hover:bg-red-900/30"
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
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
      </div>

      {/* Mobile menu panel */}
      <div
        className={`absolute top-16 left-0 right-0 z-40 rounded-b-2xl backdrop-blur-2xl bg-red-50/95 dark:bg-red-950/90 border-t border-red-200 dark:border-red-900 shadow-lg transform transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        } md:hidden`}
      >
        <div className="p-6 space-y-4">
          <span className="font-heading text-xl font-semibold">Menu</span>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-2 ${
                    isActive(item.href)
                      ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                      : "hover:bg-red-100/50 dark:hover:bg-red-900/20"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}

          <div className="border-t border-red-200 dark:border-red-900 pt-4">
            <Button
              variant="outline"
              className="w-full gap-2 border-red-200 hover:bg-red-100 dark:border-red-900 dark:hover:bg-red-900/30"
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              data-testid="button-logout-mobile"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

