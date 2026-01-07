import { useState } from "react";
import { Bell, AlertTriangle, CheckCircle, Info, Download, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Supplier } from "@/types/supplier";
import { toast } from "sonner";

interface NotificationBellProps {
  suppliers: Supplier[];
}

interface Notification {
  id: string;
  type: "warning" | "info" | "success" | "export";
  title: string;
  description: string;
  supplier?: string;
  timestamp: string;
  read: boolean;
}

export const NotificationBell = ({ suppliers }: NotificationBellProps) => {
  const generateNotifications = (): Notification[] => {
    const notifications: Notification[] = [];
    const avgEmissions = suppliers.reduce((sum, s) => sum + s.totalEmissions, 0) / suppliers.length;
    const avgFE = suppliers.reduce((sum, s) => sum + s.emissionsPerRevenue, 0) / suppliers.length;

    // Add export options as notifications
    notifications.push({
      id: "export-pdf",
      type: "export",
      title: "Exportar Relatórios",
      description: "Clique para exportar para PDF, Excel ou relatório ESG completo",
      timestamp: "",
      read: false,
    });

    suppliers.forEach(supplier => {
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

    return notifications.slice(0, 8); // Limit to 8 notifications
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
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "export":
        return <Download className="h-4 w-4 text-primary" />;
      default:
        return <Info className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="relative hover:bg-primary-foreground/10"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-danger text-[10px]"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notificações</h3>
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
                        <h4 className="font-semibold text-sm mb-1">{notification.title}</h4>
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
                        <h4 className="font-semibold text-sm mb-1">{notification.title}</h4>
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
