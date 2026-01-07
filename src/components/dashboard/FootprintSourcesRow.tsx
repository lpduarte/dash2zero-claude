import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Supplier } from "@/types/supplier";
import { Calculator, Database, Leaf, FileText, Mail } from "lucide-react";
import { IncentiveEmailDialog } from "./IncentiveEmailDialog";

interface FootprintSourcesRowProps {
  suppliers: Supplier[];
  totalCompanies?: number;
}

const getPercentageColor = (percentage: number) => {
  if (percentage >= 75) return { text: "text-green-600", bg: "bg-green-500", bgLight: "bg-green-100", border: "border-green-200" };
  if (percentage >= 50) return { text: "text-lime-600", bg: "bg-lime-500", bgLight: "bg-lime-100", border: "border-lime-200" };
  if (percentage >= 25) return { text: "text-amber-600", bg: "bg-amber-500", bgLight: "bg-amber-100", border: "border-amber-200" };
  return { text: "text-red-600", bg: "bg-red-500", bgLight: "bg-red-100", border: "border-red-200" };
};

export const FootprintSourcesRow = ({ suppliers, totalCompanies }: FootprintSourcesRowProps) => {
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  
  const companiesCalculated = suppliers.length;
  const total = totalCompanies || companiesCalculated;
  const percentageCalculated = total > 0 ? Math.round((companiesCalculated / total) * 100) : 0;
  const percentageColors = getPercentageColor(percentageCalculated);
  const companiesMissing = total - companiesCalculated;

  const formularioCount = suppliers.filter(s => s.dataSource === "formulario").length;
  const get2zeroCount = suppliers.filter(s => s.dataSource === "get2zero").length;
  const formularioPercentage = companiesCalculated > 0 ? Math.round((formularioCount / companiesCalculated) * 100) : 0;
  const get2zeroPercentage = companiesCalculated > 0 ? Math.round((get2zeroCount / companiesCalculated) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {/* Card Pegadas Calculadas com CTA */}
      <Card className={`p-4 shadow-md hover:shadow-lg transition-shadow ${percentageColors.bgLight} ${percentageColors.border} border-2`}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className={`text-xs font-medium ${percentageColors.text}`}>Pegadas calculadas</p>
            <div className={`${percentageColors.bg} text-white p-1.5 rounded`}>
              <Calculator className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-2xl font-bold ${percentageColors.text}`}>{companiesCalculated} de {total}</p>
              <p className={`text-xs ${percentageColors.text} mt-1 font-medium`}>{percentageCalculated}% do cluster</p>
            </div>
            {companiesMissing > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                className={`${percentageColors.text} border-current hover:bg-white/50 text-xs`}
                onClick={() => setEmailDialogOpen(true)}
              >
                <Mail className="h-3 w-3 mr-1.5" />
                Incentivar cálculo
              </Button>
            )}
          </div>
          <div className="mt-1">
            <Progress 
              value={percentageCalculated} 
              className="h-2 bg-white/50"
              indicatorClassName={percentageColors.bg}
            />
          </div>
        </div>
      </Card>

      {/* Card Origem dos Dados - Combinado */}
      <Card className="p-4 shadow-md hover:shadow-lg transition-shadow border">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Origem dos dados</p>
            <div className="bg-primary/10 text-primary p-1.5 rounded">
              <Database className="h-4 w-4" />
            </div>
          </div>
          
          {/* Barra horizontal combinada - alinhada com CTA do card esquerdo */}
          <div className="flex h-8 rounded-md overflow-hidden mt-2">
            <div 
              className="bg-primary flex items-center justify-center text-white text-xs font-medium transition-all"
              style={{ width: `${get2zeroPercentage}%` }}
            >
              {get2zeroPercentage > 15 && `${get2zeroPercentage}%`}
            </div>
            <div 
              className="bg-secondary flex items-center justify-center text-secondary-foreground text-xs font-medium transition-all"
              style={{ width: `${formularioPercentage}%` }}
            >
              {formularioPercentage > 15 && `${formularioPercentage}%`}
            </div>
          </div>

          {/* Legenda */}
          <div className="flex justify-between text-xs mt-1">
            <div className="flex items-center gap-1.5">
              <Leaf className="h-3.5 w-3.5 text-primary" />
              <span className="text-muted-foreground">Get2Zero Simple</span>
              <span className="font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">{get2zeroCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">{formularioCount}</span>
              <span className="text-muted-foreground">Formulário</span>
              <FileText className="h-3.5 w-3.5 text-slate-500" />
            </div>
          </div>
        </div>
      </Card>

      <IncentiveEmailDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        companiesMissing={companiesMissing}
      />
    </div>
  );
};
