import { Leaf, LayoutDashboard, Boxes } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NotificationBell } from "./NotificationBell";
import { UserTypeToggle } from "./UserTypeToggle";
import { useUser } from "@/contexts/UserContext";
import { allEmpresaSuppliers, allMunicipioSuppliers } from "@/data/suppliers";
import logoCascais from "@/assets/logo-cascais.svg";
export const Header = () => {
  const location = useLocation();
  const {
    userType,
    setUserType
  } = useUser();
  return <header className="bg-gradient-primary text-primary-foreground py-6 px-8 shadow-md">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo - Cascais para município, placeholder para outros */}
            {userType === 'municipio' ? <div className="w-16 h-16 flex items-center justify-center">
                <img src={logoCascais} alt="Município de Cascais" className="w-full h-full" />
              </div> : <div className="w-16 h-16 bg-primary-foreground/20 rounded-lg flex items-center justify-center border-2 border-primary-foreground/30">
                <span className="text-xs text-primary-foreground/60 font-medium">LOGO</span>
              </div>}
            
            <div className="flex items-center gap-3">
              <div className="bg-primary-foreground/20 p-3 rounded-lg">
                <Leaf className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">dash2zero</h1>
                <p className="text-primary-foreground/90 text-sm">Dashboard de Sustentabilidade</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <UserTypeToggle currentType={userType} onTypeChange={setUserType} />
            
            <nav className="flex gap-2">
              <Link to="/" className={cn("flex items-center gap-2 px-4 py-2 rounded-md transition-colors", location.pathname === "/" ? "bg-primary-foreground/20" : "hover:bg-primary-foreground/10")}>
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link to="/clusters" className={cn("flex items-center gap-2 px-4 py-2 rounded-md transition-colors", location.pathname === "/clusters" ? "bg-primary-foreground/20" : "hover:bg-primary-foreground/10")}>
                <Boxes className="h-4 w-4" />
                Clusters
              </Link>
            </nav>
            
            <NotificationBell suppliers={userType === 'municipio' ? allMunicipioSuppliers as any : allEmpresaSuppliers as any} />
          </div>
        </div>
      </div>
    </header>;
};