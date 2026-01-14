import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Supplier } from "@/types/supplier";
import { FileDown, FileSpreadsheet, FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { formatNumber } from "@/lib/formatters";

interface ExportOptionsProps {
  suppliers: Supplier[];
}

export const ExportOptions = ({ suppliers }: ExportOptionsProps) => {
  const handleExportPDF = () => {
    toast.success("A preparar exportação para PDF...", {
      description: "O relatório será gerado com todos os dashboards e apresentações internas.",
    });
    // TODO: Implement PDF export logic
    console.log("Exporting to PDF...", suppliers);
  };

  const handleExportExcel = () => {
    toast.success("A preparar exportação para Excel...", {
      description: "Os dados serão exportados para Excel com todas as métricas ESG.",
    });
    // TODO: Implement Excel export logic
    console.log("Exporting to Excel...", suppliers);
  };

  const handleExportESGReport = () => {
    toast.success("A gerar relatório ESG completo...", {
      description: "Relatório de sustentabilidade para reporting ESG será gerado.",
    });
    // TODO: Implement ESG report generation
    console.log("Generating ESG Report...", suppliers);
  };

  const totalEmissions = suppliers.reduce((sum, s) => sum + s.totalEmissions, 0);
  const companiesWithSBTi = suppliers.filter(s => s.hasSBTi).length;

  return (
    <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Exportação de Relatórios
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Exporte dados para PDF ou Excel para apresentações internas ou reporting ESG
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <h4 className="font-semibold text-sm mb-3">Formatos Disponíveis</h4>
            
            <Button 
              onClick={handleExportPDF}
              className="w-full justify-start"
              variant="outline"
            >
              <FileText className="h-4 w-4 mr-2" />
              Exportar para PDF
              <Badge variant="secondary" className="ml-auto">Dashboard Completo</Badge>
            </Button>

            <Button 
              onClick={handleExportExcel}
              className="w-full justify-start"
              variant="outline"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Exportar para Excel
              <Badge variant="secondary" className="ml-auto">Dados Brutos</Badge>
            </Button>

            <Button 
              onClick={handleExportESGReport}
              className="w-full justify-start"
              variant="outline"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Relatório ESG Completo
              <Badge variant="secondary" className="ml-auto">PDF + Excel</Badge>
            </Button>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm mb-3">Resumo a Exportar</h4>
            
            <div className="p-3 bg-card border border-border rounded-lg">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fornecedores:</span>
                  <span className="font-semibold">{suppliers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Emissões Totais:</span>
                  <span className="font-semibold">{formatNumber(totalEmissions, 0)} t CO₂e</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Com SBTi:</span>
                  <span className="font-semibold">{companiesWithSBTi} empresas</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Nota:</strong> Os relatórios exportados incluem todos os dashboards, 
                gráficos, análises comparativas e recomendações para apresentações internas 
                ou reporting ESG oficial.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
