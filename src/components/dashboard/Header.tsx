import { useState, useEffect } from "react";
import { Leaf, LayoutDashboard, CircleDot, Moon, Sun } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NotificationBell } from "./NotificationBell";
import { UserTypeToggle } from "./UserTypeToggle";
import { useUser } from "@/contexts/UserContext";
import { allEmpresaSuppliers, allMunicipioSuppliers } from "@/data/suppliers";
import logoCascais from "@/assets/logo-cascais.svg";

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
            <div className="flex items-center gap-4">
              {userType === 'municipio' ? (
                <div className="w-16 h-16 flex items-center justify-center">
                  <img src={logoCascais} alt="Município de Cascais" className="w-full h-full" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center border-2 border-primary/30">
                  <span className="text-xs text-primary/60 font-medium">LOGO</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-3 rounded-lg">
                  <Leaf className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">dash2zero</h1>
                  <p className="text-muted-foreground text-sm">Dashboard de Sustentabilidade</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <UserTypeToggle currentType={userType} onTypeChange={setUserType} />

              <nav className="flex gap-1 bg-background/40 backdrop-blur-md rounded-lg p-1 border border-primary/20">
                <Link to="/" className={cn(
                  "flex items-center justify-center gap-2 h-9 px-3 rounded-md transition-all duration-200",
                  location.pathname === "/"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground/70 hover:text-foreground hover:bg-primary/10"
                )}>
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link to="/clusters" className={cn(
                  "flex items-center justify-center gap-2 h-9 px-3 rounded-md transition-all duration-200",
                  location.pathname === "/clusters"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground/70 hover:text-foreground hover:bg-primary/10"
                )}>
                  <CircleDot className="h-4 w-4" />
                  Gerir clusters
                </Link>
              </nav>

              <NotificationBell suppliers={userType === 'municipio' ? allMunicipioSuppliers as any : allEmpresaSuppliers as any} />

              <div className="flex gap-1 bg-background/40 backdrop-blur-md rounded-lg p-1 border border-primary/20">
                <button
                  onClick={() => setDarkMode(false)}
                  className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-md transition-all duration-200",
                    !darkMode
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground/70 hover:text-foreground hover:bg-primary/10"
                  )}
                  title="Light mode"
                >
                  <Sun className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDarkMode(true)}
                  className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-md transition-all duration-200",
                    darkMode
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground/70 hover:text-foreground hover:bg-primary/10"
                  )}
                  title="Dark mode"
                >
                  <Moon className="h-4 w-4" />
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
