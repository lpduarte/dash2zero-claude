import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Supplier } from "@/types/supplier";
import { ExternalLink, Download, AlertTriangle, Award } from "lucide-react";

interface SupplierDetailsTableProps {
  suppliers: Supplier[];
}

export const SupplierDetailsTable = ({ suppliers }: SupplierDetailsTableProps) => {
  const getRatingBadge = (rating: string) => {
    const colors: Record<string, string> = {
      'A': 'bg-success',
      'B': 'bg-primary',
      'C': 'bg-warning',
      'D': 'bg-danger',
      'E': 'bg-destructive',
    };
    return <Badge className={colors[rating]}>{rating}</Badge>;
  };

  const getRiskIndicator = (emissions: number, hasSBTi: boolean, certCount: number) => {
    // Mock risk calculation
    const emissionRisk = emissions > 15000 ? 2 : emissions > 8000 ? 1 : 0;
    const sbtiRisk = !hasSBTi ? 1 : 0;
    const certRisk = certCount === 0 ? 1 : 0;
    const totalRisk = emissionRisk + sbtiRisk + certRisk;

    if (totalRisk === 0) return <Badge className="bg-success">Baixo Risco</Badge>;
    if (totalRisk <= 2) return <Badge className="bg-warning">Risco Médio</Badge>;
    return <Badge className="bg-danger">Alto Risco</Badge>;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Detalhes Completos dos Fornecedores</CardTitle>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Exportar Excel
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Emissões Totais</TableHead>
                <TableHead>Certificações</TableHead>
                <TableHead>SBTi</TableHead>
                <TableHead>Risco</TableHead>
                <TableHead>Relatório</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{supplier.totalEmissions.toFixed(0)} ton</span>
                      <span className="text-xs text-muted-foreground">
                        {supplier.emissionsPerEmployee.toFixed(2)} ton/emp
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="text-sm">{supplier.certifications.length}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {supplier.hasSBTi ? (
                      <Badge variant="outline" className="text-success border-success">Sim</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">Não</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {getRiskIndicator(supplier.totalEmissions, supplier.hasSBTi, supplier.certifications.length)}
                  </TableCell>
                  <TableCell>
                    {supplier.sustainabilityReport ? (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={supplier.sustainabilityReport} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
