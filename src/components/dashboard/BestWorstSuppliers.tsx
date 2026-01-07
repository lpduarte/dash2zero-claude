import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Supplier } from "@/types/supplier";
import { TrendingDown, TrendingUp, Award, AlertTriangle } from "lucide-react";

interface BestWorstSuppliersProps {
  suppliers: Supplier[];
}

export const BestWorstSuppliers = ({ suppliers }: BestWorstSuppliersProps) => {
  const sortedByEmissions = [...suppliers].sort((a, b) => a.totalEmissions - b.totalEmissions);
  const best = sortedByEmissions[0];
  const worst = sortedByEmissions[sortedByEmissions.length - 1];

  const avgEmissions = suppliers.reduce((sum, s) => sum + s.totalEmissions, 0) / suppliers.length;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="border-success/50 bg-success/5">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-success" />
              Melhor Desempenho
            </CardTitle>
            <Badge className="bg-success">
              <TrendingDown className="h-3 w-3 mr-1" />
              Top 1
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <h3 className="font-bold text-xl text-foreground">{best.name}</h3>
              <p className="text-sm text-muted-foreground">{best.sector}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <p className="text-xs text-muted-foreground">Emissões Totais</p>
                <p className="text-2xl font-bold text-success">{best.totalEmissions.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">t CO₂e</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Por Funcionário</p>
                <p className="text-2xl font-bold text-success">{best.emissionsPerEmployee.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">t CO₂e/func</p>
              </div>
            </div>

            <div className="pt-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Certificações</p>
              <div className="flex flex-wrap gap-1">
                {best.certifications.map((cert, i) => (
                  <Badge key={i} variant="outline" className="text-xs border-success/50 text-success">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-danger/50 bg-danger/5">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-danger" />
              Pior Desempenho
            </CardTitle>
            <Badge className="bg-danger">
              <TrendingUp className="h-3 w-3 mr-1" />
              Último
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <h3 className="font-bold text-xl text-foreground">{worst.name}</h3>
              <p className="text-sm text-muted-foreground">{worst.sector}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <p className="text-xs text-muted-foreground">Emissões Totais</p>
                <p className="text-2xl font-bold text-danger">{worst.totalEmissions.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">t CO₂e</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Por Funcionário</p>
                <p className="text-2xl font-bold text-danger">{worst.emissionsPerEmployee.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">t CO₂e/func</p>
              </div>
            </div>

            <div className="pt-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Certificações</p>
              <div className="flex flex-wrap gap-1">
                {worst.certifications.length > 0 ? (
                  worst.certifications.map((cert, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {cert}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">Sem certificações</span>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-danger/20 bg-danger/10 rounded-md p-2 -mx-2">
              <p className="text-xs font-medium text-danger">
                {((worst.totalEmissions / avgEmissions - 1) * 100).toFixed(0)}% acima da média do grupo
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
