import { Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Supplier } from "@/types/supplier";

interface GroupCounterProps {
  suppliers: Supplier[];
  totalCompaniesInGroup?: number;
}

export const GroupCounter = ({ 
  suppliers, 
  totalCompaniesInGroup = 15000 
}: GroupCounterProps) => {
  const respondedCount = suppliers.length;
  const responseRate = ((respondedCount / totalCompaniesInGroup) * 100).toFixed(1);

  return (
    <Card className="mb-8 bg-gradient-to-r from-primary/5 to-accent/5 border-2 border-primary/30">
      <CardContent className="pt-6">
        <div className="flex items-start gap-6">
          <div className="bg-primary/10 p-4 rounded-xl">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Empresas do Banco Montepio/Município
            </h3>
            
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-5xl font-bold text-primary">
                {respondedCount.toLocaleString('pt-PT')}
              </span>
              <span className="text-2xl text-muted-foreground">/</span>
              <span className="text-4xl font-semibold text-muted-foreground">
                {totalCompaniesInGroup.toLocaleString('pt-PT')}
              </span>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              empresas responderam ao inquérito de pegada de carbono
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Taxa de resposta</span>
                <span className="font-bold text-primary">{responseRate}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden shadow-inner">
                <div 
                  className="bg-gradient-to-r from-primary to-accent h-full transition-all duration-1000 ease-out shadow-lg"
                  style={{ width: `${responseRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
