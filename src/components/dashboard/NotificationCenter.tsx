import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Supplier } from "@/types/supplier";
import { Bell, AlertTriangle, TrendingUp, CheckCircle, Info } from "lucide-react";
import { useState } from "react";
import { formatNumber, formatPercentage } from "@/lib/formatters";

interface NotificationCenterProps {
  suppliers: Supplier[];
}

interface Notification {
  id: string;
  type: "warning" | "info" | "success";
  title: string;
  description: string;
  supplier?: string;
  timestamp: string;
  read: boolean;
}

export const NotificationCenter = ({ suppliers }: NotificationCenterProps) => {
  // Generate notifications based on supplier data
  const generateNotifications = (): Notification[] => {
    const notifications: Notification[] = [];
    const avgEmissions = suppliers.reduce((sum, s) => sum + s.totalEmissions, 0) / suppliers.length;
    const avgFE = suppliers.reduce((sum, s) => sum + s.emissionsPerRevenue, 0) / suppliers.length;

    suppliers.forEach(supplier => {
      // Check for suppliers with significantly worse FE
      if (supplier.emissionsPerRevenue > avgFE * 1.5) {
        notifications.push({
          id: `fe-high-${supplier.id}`,
          type: "warning",
          title: "Fator de Emissão Elevado",
          description: `${supplier.name} apresenta um FE de ${formatNumber(supplier.emissionsPerRevenue, 1)} kg/€, 50% acima da média do grupo.`,
          supplier: supplier.name,
          timestamp: "Há 2 horas",
          read: false,
        });
      }

      // Check for potential better alternatives in same sector
      const sectorSuppliers = suppliers.filter(s => s.sector === supplier.sector && s.id !== supplier.id);
      const betterAlternatives = sectorSuppliers.filter(s => 
        s.totalEmissions < supplier.totalEmissions * 0.7 && 
        (s.rating < supplier.rating || s.hasSBTi)
      );

      if (betterAlternatives.length > 0 && supplier.totalEmissions > avgEmissions) {
        notifications.push({
          id: `alternative-${supplier.id}`,
          type: "info",
          title: "Alternativas Melhores Disponíveis",
          description: `Existem ${betterAlternatives.length} alternativas na BD global com emissões 30% menores que ${supplier.name}.`,
          supplier: supplier.name,
          timestamp: "Há 4 horas",
          read: false,
        });
      }

      // Check for improvements (from historical data)
      if (supplier.yearlyProgress && supplier.yearlyProgress.length >= 2) {
        const lastYear = supplier.yearlyProgress[supplier.yearlyProgress.length - 1];
        const previousYear = supplier.yearlyProgress[supplier.yearlyProgress.length - 2];
        const reduction = ((previousYear.emissions - lastYear.emissions) / previousYear.emissions) * 100;

        if (reduction > 15) {
          notifications.push({
            id: `improvement-${supplier.id}`,
            type: "success",
            title: "Melhoria Significativa de Performance",
            description: `${supplier.name} reduziu emissões em ${formatPercentage(reduction, 0)} no último ano. Excelente progresso!`,
            supplier: supplier.name,
            timestamp: "Há 1 dia",
            read: false,
          });
        }
      }
    });

    return notifications;
  };

  const [notifications, setNotifications] = useState<Notification[]>(generateNotifications());
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-success" />;
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case "warning":
        return "border-warning/50";
      case "success":
        return "border-success/50";
      default:
        return "border-primary/50";
    }
  };

  return (
    <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Central de Notificações</CardTitle>
            {unreadCount > 0 && (
              <Badge className="bg-danger">{unreadCount} novas</Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          O sistema notifica quando aparecem alternativas melhores na BD global, ou quando 
          um parceiro piora significativamente o FE (iNovo)
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Sem notificações no momento</p>
            </div>
          )}

          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-4 border rounded-lg transition-colors ${
                notification.read ? 'bg-card opacity-60' : 'bg-card'
              } ${getBorderColor(notification.type)}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getIcon(notification.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{notification.title}</h4>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="h-6 px-2 text-xs"
                      >
                        Marcar como lida
                      </Button>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {notification.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {notification.supplier && (
                      <Badge variant="outline" className="text-xs">
                        {notification.supplier}
                      </Badge>
                    )}
                    <span>{notification.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Tipos de Notificações Automáticas
          </h4>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-warning mt-0.5">•</span>
              <span>Quando um parceiro piora significativamente o FE (Fator de Emissão)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Quando aparecem alternativas melhores na base de dados global</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-0.5">•</span>
              <span>Quando um fornecedor melhora significativamente suas métricas ESG</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-danger mt-0.5">•</span>
              <span>Quando novos fornecedores críticos são identificados (Pareto 80/20)</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
