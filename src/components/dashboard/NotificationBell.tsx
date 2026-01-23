import { useState, useMemo } from "react";
import { Bell, AlertTriangle, CheckCircle, Info, Download, FileText, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { OwnerType } from "@/types/clusterNew";
import { hasFootprint } from "@/types/supplierNew";
import { getClustersByOwnerType } from "@/data/clusters";
import { getSuppliersByOwnerType, getSuppliersWithFootprintByOwnerType } from "@/data/suppliers";

interface NotificationBellProps {
  userType: OwnerType;
}

interface Notification {
  id: string;
  type: "warning" | "info" | "success" | "export" | "milestone";
  title: string;
  description: string;
  supplier?: string;
  timestamp: string;
  read: boolean;
}

// Milestones to notify
const MILESTONES = [25, 50, 75, 100];

export const NotificationBell = ({ userType }: NotificationBellProps) => {
  const suppliers = useMemo(() => getSuppliersWithFootprintByOwnerType(userType), [userType]);
  const allSuppliers = useMemo(() => getSuppliersByOwnerType(userType), [userType]);
  const clusters = useMemo(() => getClustersByOwnerType(userType), [userType]);

  const generateNotifications = (): Notification[] => {
    const notifications: Notification[] = [];

    // === MILESTONE NOTIFICATIONS (clusters reaching coverage goals) ===
    clusters.forEach(cluster => {
      const clusterSuppliers = allSuppliers.filter(s => s.clusterIds?.includes(cluster.id));
      const totalInCluster = clusterSuppliers.length;

      if (totalInCluster === 0) return;

      const withFootprint = clusterSuppliers.filter(s => hasFootprint(s)).length;
      const coverage = (withFootprint / totalInCluster) * 100;

      // Check each milestone
      MILESTONES.forEach(milestone => {
        if (coverage >= milestone && coverage < milestone + 25) {
          if (milestone === 100) {
            // Special message for 100%
            notifications.push({
              id: `milestone-${cluster.id}-100`,
              type: "milestone",
              title: "Cluster completo!",
              description: `${cluster.name}: todas as ${totalInCluster} empresas têm pegada calculada`,
              timestamp: "",
              read: false,
            });
          } else if (milestone === 75) {
            notifications.push({
              id: `milestone-${cluster.id}-75`,
              type: "milestone",
              title: "Quase lá!",
              description: `${cluster.name} atingiu 75% de cobertura (${withFootprint}/${totalInCluster})`,
              timestamp: "",
              read: false,
            });
          } else if (milestone === 50) {
            notifications.push({
              id: `milestone-${cluster.id}-50`,
              type: "milestone",
              title: "Metade alcançada",
              description: `${cluster.name} atingiu 50% de cobertura (${withFootprint}/${totalInCluster})`,
              timestamp: "",
              read: false,
            });
          } else if (milestone === 25) {
            notifications.push({
              id: `milestone-${cluster.id}-25`,
              type: "milestone",
              title: "Progresso inicial",
              description: `${cluster.name} atingiu 25% de cobertura (${withFootprint}/${totalInCluster})`,
              timestamp: "",
              read: false,
            });
          }
        }
      });
    });

    // === EXPORT OPTIONS ===
    notifications.push({
      id: "export-pdf",
      type: "export",
      title: "Exportar Relatórios",
      description: "Clique para exportar para PDF, Excel ou relatório ESG completo",
      timestamp: "",
      read: false,
    });

    // === EXISTING NOTIFICATIONS (warnings, alternatives, improvements) ===
    const avgEmissions = suppliers.length > 0
      ? suppliers.reduce((sum, s) => sum + s.totalEmissions, 0) / suppliers.length
      : 0;
    const avgFE = suppliers.length > 0
      ? suppliers.reduce((sum, s) => sum + s.emissionsPerRevenue, 0) / suppliers.length
      : 0;

    suppliers.forEach(supplier => {
      // High emission factor warning
      if (supplier.emissionsPerRevenue > avgFE * 1.5) {
        notifications.push({
          id: `fe-high-${supplier.id}`,
          type: "warning",
          title: "Fator de Emissão Elevado",
          description: `${supplier.name} apresenta FE ${supplier.emissionsPerRevenue.toFixed(1)} kg/€, 50% acima da média.`,
          supplier: supplier.name,
          timestamp: "Há 2h",
          read: false,
        });
      }

      // Better alternatives available
      const sectorSuppliers = suppliers.filter(s => s.sector === supplier.sector && s.id !== supplier.id);
      const betterAlternatives = sectorSuppliers.filter(s =>
        s.totalEmissions < supplier.totalEmissions * 0.7 &&
        (s.rating < supplier.rating || s.hasSBTi)
      );

      if (betterAlternatives.length > 0 && supplier.totalEmissions > avgEmissions) {
        notifications.push({
          id: `alternative-${supplier.id}`,
          type: "info",
          title: "Alternativas Disponíveis",
          description: `${betterAlternatives.length} alternativas melhores que ${supplier.name} na BD global`,
          supplier: supplier.name,
          timestamp: "Há 4h",
          read: false,
        });
      }

      // Significant improvement
      if (supplier.yearlyProgress && supplier.yearlyProgress.length >= 2) {
        const lastYear = supplier.yearlyProgress[supplier.yearlyProgress.length - 1];
        const previousYear = supplier.yearlyProgress[supplier.yearlyProgress.length - 2];
        const reduction = ((previousYear.emissions - lastYear.emissions) / previousYear.emissions) * 100;

        if (reduction > 15) {
          notifications.push({
            id: `improvement-${supplier.id}`,
            type: "success",
            title: "Melhoria Significativa",
            description: `${supplier.name} reduziu ${reduction.toFixed(0)}% das emissões no último ano!`,
            supplier: supplier.name,
            timestamp: "Há 1d",
            read: false,
          });
        }
      }
    });

    return notifications.slice(0, 10);
  };

  const [notifications, setNotifications] = useState<Notification[]>(generateNotifications());
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleExportClick = () => {
    setOpen(false);
    toast.success("Funcionalidade de exportação", {
      description: "Selecione o formato desejado: PDF, Excel ou Relatório ESG completo",
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-primary" />;
      case "export":
        return <Download className="h-4 w-4 text-primary" />;
      case "milestone":
        return <Target className="h-4 w-4 text-primary" />;
      default:
        return <Info className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="liquid-glass-container flex p-1.5 rounded-full backdrop-blur-xl">
          <button className="liquid-glass-btn inactive relative flex items-center justify-center w-9 h-9 rounded-full text-sm transition-all duration-300 border border-transparent">
            <Bell className="h-4 w-4 relative z-10" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-danger text-white text-[10px] font-medium rounded-full flex items-center justify-center z-20">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Notificações</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary">{unreadCount} novas</Badge>
            )}
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Sem notificações</p>
            </div>
          ) : (
            notifications.map((notification, index) => (
              <div key={notification.id}>
                {notification.type === "export" ? (
                  <div
                    onClick={handleExportClick}
                    className="p-4 hover:bg-accent cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm mb-1">{notification.title}</h4>
                        <p className="text-xs text-muted-foreground">{notification.description}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => markAsRead(notification.id)}
                    className={`p-4 hover:bg-accent cursor-pointer transition-colors ${
                      notification.read ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm mb-1">{notification.title}</h4>
                        <p className="text-xs text-muted-foreground mb-1">
                          {notification.description}
                        </p>
                        {notification.timestamp && (
                          <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                        )}
                      </div>
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                      )}
                    </div>
                  </div>
                )}
                {index < notifications.length - 1 && <Separator />}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
