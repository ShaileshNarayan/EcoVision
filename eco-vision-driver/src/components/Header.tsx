import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  title: string;
  showBack?: boolean; // optional prop to show back button
}

const Header = ({ title, showBack = false }: HeaderProps) => {
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark((prev) => !prev);
  };

  if (!user) return null;

  return (
    <header className="pt-10 md:pt-12 mb-6">
      {/* Top row: Title + Avatar & Theme */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-border
                       bg-background text-foreground
                       hover:bg-accent hover:text-accent-foreground
                       transition-colors
                       focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-yellow-400" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <Avatar>
              <AvatarFallback>
                {user.name
                  ? user.name.charAt(0).toUpperCase()
                  : "?"}
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </div>

      {/* Optional Back button */}
      {showBack && (
        <button
          onClick={() => navigate(-1)}
          className="mt-4 flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      )}
    </header>
  );
};

export default Header;
