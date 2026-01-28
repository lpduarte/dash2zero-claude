import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  BookOpen, Users, FileText, Factory, BarChart3, TrendingDown,
  Briefcase, Scale, FileSpreadsheet, CheckCircle2, Layers,
  LayoutDashboard, PieChart, Target, Leaf, Euro, Mail, Send,
  TowerControl, Shield, Database, Library,
  ChevronDown, ChevronRight,
  Menu,
} from "lucide-react";
import {
  methodologySections,
  getVersionString,
  getVersionDate,
} from "@/config/methodology";

// Icon string-to-component mapping
const iconMap: Record<string, React.ElementType> = {
  BookOpen, Users, FileText, Factory, BarChart3, TrendingDown,
  Briefcase, Scale, FileSpreadsheet, CheckCircle2, Layers,
  LayoutDashboard, PieChart, Target, Leaf, Euro, Mail, Send,
  TowerControl, Shield, Database, Library,
};

interface SidebarProps {
  activeSection: string;
  expandedGroups: Record<string, boolean>;
  onToggleGroup: (groupId: string) => void;
  onNavigate: (id: string) => void;
}

const Sidebar = ({ activeSection, expandedGroups, onToggleGroup, onNavigate }: SidebarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileNavClick = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  const sidebarNav = (onNavClick: (id: string) => void) => (
    <>
      {/* Logo + Title */}
      <div className="flex items-center gap-2 mb-6">
        <Leaf className="h-8 w-8 text-primary" />
        <div>
          <h1 className="font-bold">Dash2Zero</h1>
          <p className="text-xs text-muted-foreground">Metodologia</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1" role="navigation" aria-label="Secções da metodologia">
        {methodologySections.map((group) => {
          const isExpanded = expandedGroups[group.id];
          const hasActiveChild = group.sections.some(s => s.id === activeSection);
          return (
            <div key={group.id}>
              <button
                onClick={() => onToggleGroup(group.id)}
                aria-expanded={isExpanded}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-bold transition-all duration-200",
                  hasActiveChild
                    ? "text-primary"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {group.label}
                {isExpanded
                  ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  : <ChevronRight className="h-4 w-4 text-muted-foreground" />
                }
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-200",
                  isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                {group.sections.map((section) => {
                  const Icon = iconMap[section.icon];
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => onNavClick(section.id)}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "w-full flex items-start gap-3 px-3 py-2 rounded-lg text-sm text-left transition-all duration-200 ml-1",
                        isActive
                          ? "bg-primary/10 text-primary font-normal shadow-md"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground hover:translate-x-1"
                      )}
                    >
                      {Icon && (
                        <div className={cn(
                          "p-1.5 rounded-md transition-colors shrink-0",
                          isActive ? "bg-primary/20" : "bg-muted"
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                      )}
                      {section.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="mt-8 p-3 border rounded-lg bg-muted/30">
        <p className="text-xs text-muted-foreground">
          {getVersionString()} · {getVersionDate()}
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button className="p-2 rounded-lg bg-card border shadow-md">
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <ScrollArea className="h-full py-6 px-4">
              {sidebarNav(handleMobileNavClick)}
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar Navigation */}
      <aside className="hidden lg:block w-64 border-r bg-card fixed h-screen overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6">
            {sidebarNav(onNavigate)}
          </div>
        </ScrollArea>
      </aside>
    </>
  );
};

export default Sidebar;
