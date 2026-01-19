import { useState, useEffect } from "react";
import { Leaf, BarChart3, CircleDot, Moon, Sun } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NotificationBell } from "./NotificationBell";
import { UserTypeToggle } from "./UserTypeToggle";
import { useUser } from "@/contexts/UserContext";
import { allEmpresaSuppliers, allMunicipioSuppliers } from "@/data/suppliers";

export const Header = () => {
  const location = useLocation();
  const { userType, setUserType } = useUser();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <header className="relative overflow-x-clip" style={{ overflowY: 'visible' }}>
      <div className="relative py-6 px-8">

        {/* Pulsing elements - above background, below content */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, overflow: 'visible' }}>
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/50 rounded-full blur-3xl animate-pulse-slow" style={{ transform: 'translate(20%, -70%)' }} />
          <div className="absolute top-0 right-20 w-56 h-56 bg-primary/40 rounded-full blur-3xl animate-pulse-slower" style={{ animationDelay: '1s', transform: 'translateY(-60%)' }} />
          <div className="absolute top-0 right-1/4 w-48 h-48 bg-primary/35 rounded-full blur-3xl animate-pulse-slower" style={{ animationDelay: '0.5s', transform: 'translateY(-50%)' }} />
          <div className="absolute top-0 left-0 w-40 h-40 bg-primary/25 rounded-full blur-3xl animate-pulse-slower" style={{ animationDelay: '2s', transform: 'translate(-30%, -70%)' }} />
          <div className="absolute top-0 left-10 w-36 h-36 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s', transform: 'translateY(-50%)' }} />
        </div>

        {/* Content - above everything */}
        <div className="relative max-w-[1400px] mx-auto" style={{ zIndex: 2 }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Leaf className="h-14 w-14 text-primary" />
              <div>
                <h1 className="text-4xl font-bold text-foreground">dash2zero</h1>
                <p className="text-muted-foreground text-sm">Dashboard de Sustentabilidade</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <UserTypeToggle currentType={userType} onTypeChange={setUserType} />

              <nav className="liquid-glass-container flex gap-2 p-2 rounded-full backdrop-blur-xl">
                <Link to="/" className={cn(
                  "liquid-glass-btn relative flex items-center justify-center gap-2 h-9 px-5 rounded-full text-sm font-medium overflow-hidden border border-transparent",
                  location.pathname === "/" ? "active border-primary/25" : "inactive"
                )}>
                  <BarChart3 className="h-4 w-4 relative z-10" />
                  <span className="relative z-10">Dashboard</span>
                </Link>
                <Link to="/clusters" className={cn(
                  "liquid-glass-btn relative flex items-center justify-center gap-2 h-9 px-5 rounded-full text-sm font-medium overflow-hidden border border-transparent",
                  location.pathname === "/clusters" ? "active border-primary/25" : "inactive"
                )}>
                  <CircleDot className="h-4 w-4 relative z-10" />
                  <span className="relative z-10">Gerir clusters</span>
                </Link>
              </nav>

              <NotificationBell suppliers={userType === 'municipio' ? allMunicipioSuppliers as any : allEmpresaSuppliers as any} />

              <div className="liquid-glass-container flex gap-1 p-1.5 rounded-full backdrop-blur-xl">
                <button
                  onClick={() => setDarkMode(false)}
                  className={cn(
                    "liquid-glass-btn relative flex items-center justify-center w-9 h-9 rounded-full text-sm font-medium overflow-hidden border border-transparent",
                    !darkMode ? "active border-primary/25" : "inactive"
                  )}
                  title="Light mode"
                >
                  <Sun className="h-4 w-4 relative z-10" />
                </button>
                <button
                  onClick={() => setDarkMode(true)}
                  className={cn(
                    "liquid-glass-btn relative flex items-center justify-center w-9 h-9 rounded-full text-sm font-medium overflow-hidden border border-transparent",
                    darkMode ? "active border-primary/25" : "inactive"
                  )}
                  title="Dark mode"
                >
                  <Moon className="h-4 w-4 relative z-10" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Glowing line */}
      <div className="relative w-full flex items-center justify-center" style={{ zIndex: 2 }}>
        <div
          className="rounded-full"
          style={{
            width: '100%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent 0%, hsl(175 66% 38%) 20%, hsl(175 66% 38%) 80%, transparent 100%)',
            opacity: 0.65,
            boxShadow: '0 0 8px hsl(175 66% 38% / 0.4)',
          }}
        />
      </div>
    </header>
  );
};
