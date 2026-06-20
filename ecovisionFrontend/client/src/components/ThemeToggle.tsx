// import { Moon, Sun } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useEffect, useState } from "react";

// export function ThemeToggle() {
//   const [theme, setTheme] = useState<"light" | "dark">("light");

//   useEffect(() => {
//     const stored = localStorage.getItem("theme") as "light" | "dark" | null;
//     const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
//     const initialTheme = stored || (prefersDark ? "dark" : "light");
//     setTheme(initialTheme);
//     document.documentElement.classList.toggle("dark", initialTheme === "dark");
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = theme === "light" ? "dark" : "light";
//     setTheme(newTheme);
//     localStorage.setItem("theme", newTheme);
//     document.documentElement.classList.toggle("dark", newTheme === "dark");
//   };

//   return (
//     <Button
//       variant="ghost"
//       size="icon"
//       onClick={toggleTheme}
//       data-testid="button-theme-toggle"
//     >
//       {theme === "light" ? (
//         <Moon className="h-5 w-5" />
//       ) : (
//         <Sun className="h-5 w-5" />
//       )}
//     </Button>
//   );
// }

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  // 1️⃣ Initialize theme immediately from localStorage (no re-render needed)
  const getInitialTheme = (): "light" | "dark" => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);

  // 2️⃣ Apply the class to <html> when theme changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // 3️⃣ Handle toggle button click
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      data-testid="button-theme-toggle"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
}
