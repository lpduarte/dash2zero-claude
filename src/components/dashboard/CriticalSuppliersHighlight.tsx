import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Supplier } from "@/types/supplier";
import { AlertTriangle, ArrowRight, TrendingUp, Euro, BarChart3, Info, ChevronDown, FileText, Landmark, ArrowUpDown, Target } from "lucide-react";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SupplierLabel, sectorLabels } from "./SupplierLabel";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SupplierSwitchModal } from "./SupplierSwitchModal";
import { ActionPlanModal } from "./ActionPlanModal";
import { MunicipalityActionPlanModal } from "./MunicipalityActionPlanModal";
import { useUser } from "@/contexts/UserContext";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { calculateSuppliersRisk, SupplierRisk } from "@/lib/riskAnalysis";

interface CriticalSuppliersHighlightProps {
  suppliers: Supplier[];
  allSuppliers?: Supplier[];
}

type SortField = 'risk' | 'emissions' | 'name' | 'sector';
type SortOrder = 'asc' | 'desc';

export const CriticalSuppliersHighlight = ({
  suppliers,
  allSuppliers
}: CriticalSuppliersHighlightProps) => {
  const { userType } = useUser();
  const isMunicipio = userType === 'municipio';
  
  // Top 5 para ambos os tipos
  const limit = 5;
  
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [isOpen, setIsOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionPlanOpen, setActionPlanOpen] = useState(false);
  const [selectedCriticalSupplier, setSelectedCriticalSupplier] = useState<Supplier | null>(null);
  const [selectedAlternative, setSelectedAlternative] = useState<Supplier | null>(null);
  
  // Estado de ordenação para municípios
  const [sortField, setSortField] = useState<SortField>('risk');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  
  // Estado para modal de plano de ação do município
  const [municipalityPlanOpen, setMunicipalityPlanOpen] = useState(false);
  const [selectedMunicipalitySupplier, setSelectedMunicipalitySupplier] = useState<{
    supplier: Supplier;
    riskLevel: 'alto' | 'medio' | 'normal';
    riskMultiplier: number;
    avgSectorIntensity: number;
  } | null>(null);
  
  const filteredSuppliers = selectedSector === "all" ? suppliers : suppliers.filter(s => s.sector === selectedSector);
  const avgEmissions = filteredSuppliers.reduce((sum, s) => sum + s.totalEmissions, 0) / filteredSuppliers.length;

  // Calcular todos os fornecedores críticos primeiro (para a percentagem)
  const allCriticalSuppliers = filteredSuppliers.filter(s => s.totalEmissions > avgEmissions * 1.2);

  // Calcular risco para municípios
  const suppliersWithRisk = useMemo(() => {
    if (!isMunicipio) return [];
    const baseSuppliers = allSuppliers || suppliers;
    return calculateSuppliersRisk(filteredSuppliers, baseSuppliers);
  }, [filteredSuppliers, allSuppliers, suppliers, isMunicipio]);

  // Ordenação para municípios
  const sortedMunicipioSuppliers = useMemo(() => {
    if (!isMunicipio) return [];
    
    const sorted = [...suppliersWithRisk].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'risk':
          comparison = a.riskMultiplier - b.riskMultiplier;
          break;
        case 'emissions':
          comparison = a.supplier.totalEmissions - b.supplier.totalEmissions;
          break;
        case 'name':
          comparison = a.supplier.name.localeCompare(b.supplier.name, 'pt-PT');
          break;
        case 'sector':
          comparison = a.supplier.sector.localeCompare(b.supplier.sector, 'pt-PT');
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });
    
    return sorted.slice(0, limit);
  }, [suppliersWithRisk, sortField, sortOrder, limit, isMunicipio]);

  // Para empresas: manter lógica original
  const criticalSuppliers = useMemo(() => {
    if (isMunicipio) return [];
    return [...allCriticalSuppliers].sort((a, b) => b.totalEmissions - a.totalEmissions).slice(0, limit);
  }, [allCriticalSuppliers, limit, isMunicipio]);

  // Handler de ordenação
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Helper para badge de risco
  const getRiskBadge = (riskLevel: 'alto' | 'medio' | 'normal', multiplier: number) => {
    const variants = {
      alto: 'destructive',
      medio: 'default',
      normal: 'secondary'
    } as const;
    
    const labels = {
      alto: 'Alto',
      medio: 'Médio',
      normal: 'Normal'
    };
    
    return (
      <Badge variant={variants[riskLevel]} className="text-xs font-semibold">
        {multiplier.toFixed(1)}x média
      </Badge>
    );
  };

  // Calculate sector averages for FE comparison
  const sectorAverages = suppliers.reduce((acc, s) => {
    if (!acc[s.sector]) {
      acc[s.sector] = {
        total: 0,
        count: 0
      };
    }
    acc[s.sector].total += s.emissionsPerRevenue;
    acc[s.sector].count += 1;
    return acc;
  }, {} as Record<string, {
    total: number;
    count: number;
  }>);
  const getSectorAvgFE = (sector: string) => {
    const sectorData = sectorAverages[sector];
    return sectorData ? sectorData.total / sectorData.count : 0;
  };

  // Find best alternative for each critical supplier (prefer same subsector, then same sector)
  const findBestAlternative = (criticalSupplier: Supplier) => {
    // First try to find alternatives in the same subsector
    if (criticalSupplier.subsector) {
      const subsectorAlternatives = suppliers.filter(s => s.subsector === criticalSupplier.subsector && s.id !== criticalSupplier.id && s.totalEmissions < criticalSupplier.totalEmissions).sort((a, b) => a.totalEmissions - b.totalEmissions);
      if (subsectorAlternatives.length > 0) {
        return subsectorAlternatives[0];
      }
    }

    // Fallback to same sector
    const sectorAlternatives = suppliers.filter(s => s.sector === criticalSupplier.sector && s.id !== criticalSupplier.id && s.totalEmissions < criticalSupplier.totalEmissions).sort((a, b) => a.totalEmissions - b.totalEmissions);
    return sectorAlternatives[0] || null;
  };

  // Get all alternatives for a supplier (for manual selection in modal)
  const getAllAlternatives = (criticalSupplier: Supplier) => {
    return suppliers
      .filter(s => s.id !== criticalSupplier.id && s.totalEmissions < criticalSupplier.totalEmissions)
      .sort((a, b) => a.totalEmissions - b.totalEmissions);
  };

  const handleOpenModal = (supplier: Supplier, alternative: Supplier | null) => {
    setSelectedCriticalSupplier(supplier);
    setSelectedAlternative(alternative);
    setModalOpen(true);
  };

  const uniqueSectors = [...new Set(suppliers.map(s => s.sector))];
  const sectorCounts = suppliers.reduce((acc, s) => {
    acc[s.sector] = (acc[s.sector] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Dimensão label helper
  const getDimensionLabel = (size: string) => {
    const labels: Record<string, string> = {
      'micro': 'Micro',
      'pequena': 'Pequena',
      'media': 'Média',
      'grande': 'Grande'
    };
    return labels[size] || size;
  };

  return (
    <>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card className={cn(
          "bg-gradient-to-br",
          isMunicipio 
            ? "border-primary/50 from-primary/10 via-primary/5 to-accent/10" 
            : "border-danger/50 from-danger/10 via-warning/5 to-accent/10"
        )}>
          <CardHeader className={isOpen ? "pb-3" : "pb-6"}>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  {isMunicipio ? (
                    <Landmark className="h-6 w-6 text-primary" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-danger" />
                  )}
                  {isMunicipio 
                    ? 'Top 5 Empresas para Monitorização'
                    : 'Empresas críticas e alternativas'
                  }
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {isMunicipio 
                    ? 'Empresas prioritárias para apoio à descarbonização e acesso a fundos'
                    : 'Parceiros com maior impacto ambiental na supply chain'
                  }
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!isMunicipio && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => setActionPlanOpen(true)}
                  >
                    <FileText className="h-4 w-4" />
                    Gerar plano de ação
                  </Button>
                )}
                <Select value={selectedSector} onValueChange={setSelectedSector}>
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Filtrar por atividade" />
                  </SelectTrigger>
                  <SelectContent className="w-[280px]">
                    <SelectItem value="all">
                      <div className="flex items-center justify-between w-[230px]">
                        <span>{sectorLabels.all}</span>
                        <span className="bg-muted text-muted-foreground text-xs font-semibold px-2 py-0.5 rounded-full min-w-[28px] text-center">{suppliers.length}</span>
                      </div>
                    </SelectItem>
                    {uniqueSectors.map(sector => (
                      <SelectItem key={sector} value={sector}>
                        <div className="flex items-center justify-between w-[230px]">
                          <span>{sectorLabels[sector] || sector}</span>
                          <span className="bg-muted text-muted-foreground text-xs font-semibold px-2 py-0.5 rounded-full min-w-[28px] text-center">{sectorCounts[sector]}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <CollapsibleTrigger asChild>
                  <button className="ml-2 w-9 h-9 rounded-full border border-input bg-background hover:bg-muted/50 flex items-center justify-center transition-colors shrink-0">
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? '' : 'rotate-180'}`} />
                  </button>
                </CollapsibleTrigger>
              </div>
            </div>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              {/* Vista de tabela para municípios */}
              {isMunicipio && (
                <div className="space-y-4">
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-[50px] text-center">#</TableHead>
                          <TableHead>
                            <button 
                              onClick={() => handleSort('name')}
                              className="flex items-center gap-1 hover:text-primary transition-colors"
                            >
                              Empresa
                              <ArrowUpDown className="h-3 w-3" />
                            </button>
                          </TableHead>
                          <TableHead>
                            <button 
                              onClick={() => handleSort('sector')}
                              className="flex items-center gap-1 hover:text-primary transition-colors"
                            >
                              Setor
                              <ArrowUpDown className="h-3 w-3" />
                            </button>
                          </TableHead>
                          <TableHead>Dimensão</TableHead>
                          <TableHead>Freguesia</TableHead>
                          <TableHead className="text-right">
                            <button 
                              onClick={() => handleSort('emissions')}
                              className="flex items-center gap-1 hover:text-primary transition-colors ml-auto"
                            >
                              Emissões
                              <ArrowUpDown className="h-3 w-3" />
                            </button>
                          </TableHead>
                          <TableHead className="text-right">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button 
                                    onClick={() => handleSort('risk')}
                                    className="flex items-center gap-1 hover:text-primary transition-colors ml-auto"
                                  >
                                    Risco
                                    <Info className="h-3 w-3" />
                                    <ArrowUpDown className="h-3 w-3" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-[280px]">
                                  <div className="space-y-2 text-xs">
                                    <p className="font-medium">Risco financeiro baseado em intensidade de carbono vs média do setor.</p>
                                    <div className="space-y-1">
                                      <p><Badge variant="destructive" className="text-[10px] px-1 py-0 mr-1">Alto</Badge> {">"} 1.5x: Riscos regulatórios e financeiros</p>
                                      <p><Badge variant="default" className="text-[10px] px-1 py-0 mr-1">Médio</Badge> 1.2-1.5x: Atenção recomendada</p>
                                      <p><Badge variant="secondary" className="text-[10px] px-1 py-0 mr-1">Normal</Badge> {"<"} 1.2x: Zona segura</p>
                                    </div>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableHead>
                          <TableHead className="w-[80px] text-center">Ação</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedMunicipioSuppliers.map((item, index) => (
                          <TableRow key={item.supplier.id} className="hover:bg-primary/5">
                            <TableCell className="text-center font-medium text-muted-foreground">
                              {index + 1}
                            </TableCell>
                            <TableCell className="font-medium">
                              {item.supplier.name}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {sectorLabels[item.supplier.sector] || item.supplier.sector}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {getDimensionLabel(item.supplier.companySize)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {item.supplier.parish}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {item.supplier.totalEmissions.toLocaleString('pt-PT')} t
                            </TableCell>
                            <TableCell className="text-right">
                              <TooltipProvider>
                                <Tooltip delayDuration={100}>
                                  <TooltipTrigger asChild>
                                    <div className="inline-block cursor-help">
                                      {getRiskBadge(item.riskLevel, item.riskMultiplier)}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="left" className="max-w-[280px]">
                                    <div className="space-y-2 text-xs">
                                      <p className="font-semibold">{item.supplier.name}</p>
                                      <div className="space-y-1 text-muted-foreground">
                                        <p>Intensidade: <span className="font-medium text-foreground">{item.supplier.emissionsPerRevenue.toFixed(2)} kg CO₂e/€</span></p>
                                        <p>Média {sectorLabels[item.supplier.sector] || item.supplier.sector}: <span className="font-medium text-foreground">{item.avgSectorIntensity.toFixed(2)} kg CO₂e/€</span></p>
                                      </div>
                                      <p className={cn(
                                        "pt-1 border-t border-border",
                                        item.riskLevel === 'alto' ? 'text-destructive' : 
                                        item.riskLevel === 'medio' ? 'text-warning' : 'text-success'
                                      )}>
                                        {item.riskLevel === 'alto' && 'Empresa em risco financeiro. Prioritária para apoio municipal.'}
                                        {item.riskLevel === 'medio' && 'Atenção recomendada. Considerar apoio preventivo.'}
                                        {item.riskLevel === 'normal' && 'Zona segura. Monitorização regular suficiente.'}
                                      </p>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell className="text-center">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 px-2 gap-1"
                                onClick={() => {
                                  setSelectedMunicipalitySupplier({
                                    supplier: item.supplier,
                                    riskLevel: item.riskLevel,
                                    riskMultiplier: item.riskMultiplier,
                                    avgSectorIntensity: item.avgSectorIntensity
                                  });
                                  setMunicipalityPlanOpen(true);
                                }}
                              >
                                <Target className="h-3.5 w-3.5" />
                                Plano
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* Nota explicativa */}
                  <div className="bg-muted/30 rounded-lg p-3 border border-border">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">💡 Nota:</span> Empresas com risco alto ({">"}1.5x média do setor)
                      enfrentam custos regulatórios aumentados e restrições de financiamento. 
                      São prioritárias para programas de apoio municipal.
                    </p>
                  </div>
                </div>
              )}

              {/* Vista original para empresas */}
              {!isMunicipio && (
                <div className="space-y-3">
                  {criticalSuppliers.map((supplier, index) => {
                    const alternative = findBestAlternative(supplier);
                    const emissionsSavings = alternative ? supplier.totalEmissions - alternative.totalEmissions : 0;
                    const savingsPercentage = alternative ? (emissionsSavings / supplier.totalEmissions * 100).toFixed(0) : 0;
                    const sectorAvgFE = getSectorAvgFE(supplier.sector);
                    const feDiff = (supplier.emissionsPerRevenue - sectorAvgFE) / sectorAvgFE * 100;
                    return (
                      <div key={supplier.id} className="p-4 border rounded-lg bg-card border-danger/30 hover:bg-danger/5 transition-colors">
                        <div className="flex items-center gap-4">
                          <Badge className="w-8 h-8 flex items-center justify-center text-sm font-bold shrink-0 bg-danger">
                            {index + 1}
                          </Badge>

                          {/* Current supplier */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate">{supplier.name}</h4>
                            <SupplierLabel sector={supplier.sector} cluster={supplier.cluster} />
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">Emissões</span>
                              </div>
                              <p className="text-lg font-bold text-danger">{supplier.totalEmissions.toFixed(0)}</p>
                              <p className="text-xs text-muted-foreground">t CO₂e</p>
                            </div>

                            <div>
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <Euro className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">FE</span>
                              </div>
                              <p className="text-lg font-bold text-warning">{supplier.emissionsPerRevenue.toFixed(1)}</p>
                              <p className="text-xs text-muted-foreground">kg CO₂e/€</p>
                            </div>

                            <div>
                              <div className="flex items-center justify-center gap-1 mb-1">
                                <BarChart3 className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">vs Setor</span>
                              </div>
                              <p className={`text-lg font-bold ${feDiff > 0 ? 'text-danger' : 'text-success'}`}>
                                {feDiff > 0 ? '+' : ''}{feDiff.toFixed(0)}%
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {feDiff > 0 ? 'acima' : 'abaixo'}
                              </p>
                            </div>
                          </div>

                          {/* Arrow separator with transition indicator */}
                          {alternative && (
                            <>
                              <div className="flex flex-col items-center shrink-0 px-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-danger/20 to-success/20 flex items-center justify-center">
                                  <ArrowRight className="h-4 w-4 text-success" />
                                </div>
                              </div>

                              {/* Alternative supplier */}
                              <div className="flex-1 min-w-0 bg-gradient-to-r from-success/10 to-success/5 rounded-lg p-3 border border-success/30">
                                <div className="flex items-center justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground mb-0.5">Alternativa</p>
                                    <h4 className="font-semibold text-sm truncate text-success">{alternative.name}</h4>
                                  </div>
                                  <div className="text-right shrink-0 flex items-center gap-2">
                                    <div className="flex items-baseline gap-1">
                                      <p className="text-lg font-bold text-success">{alternative.totalEmissions.toFixed(0)}</p>
                                      <span className="text-xs text-muted-foreground">t CO₂e</span>
                                    </div>
                                    <Badge className="bg-success text-white text-xs font-bold">
                                      -{savingsPercentage}%
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}

                          {!alternative && (
                            <>
                              <div className="flex flex-col items-center shrink-0 px-3">
                                <div className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center">
                                  <ArrowRight className="h-4 w-4 text-muted-foreground/50" />
                                </div>
                              </div>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex-1 min-w-0 bg-muted/20 rounded-lg p-3 border border-border/30 cursor-help">
                                      <div className="flex items-center justify-center gap-2 py-2">
                                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                                        <p className="text-xs text-muted-foreground">Sem alternativa no mesmo setor</p>
                                      </div>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="max-w-[320px]">
                                    <div className="space-y-2">
                                      <p className="text-xs">
                                        Não existem outras empresas no setor <strong>{sectorLabels[supplier.sector] || supplier.sector}</strong> com 
                                        emissões inferiores a este fornecedor.
                                      </p>
                                      <div className="border-t border-border/50 pt-2">
                                        <p className="text-xs font-medium mb-1">Sugestões de ação:</p>
                                        <ul className="text-xs text-muted-foreground space-y-0.5">
                                          <li>• Realizar auditoria energética conjunta</li>
                                          <li>• Propor formação em eficiência energética</li>
                                          <li>• Estabelecer metas de redução contratuais</li>
                                          <li>• Incentivar certificações ambientais</li>
                                        </ul>
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </>
                          )}

                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="shrink-0" 
                            onClick={() => handleOpenModal(supplier, alternative)}
                            disabled={!alternative}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {selectedCriticalSupplier && (
        <SupplierSwitchModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          criticalSupplier={selectedCriticalSupplier}
          suggestedAlternative={selectedAlternative}
          allAlternatives={getAllAlternatives(selectedCriticalSupplier)}
        />
      )}

      <ActionPlanModal
        open={actionPlanOpen}
        onOpenChange={setActionPlanOpen}
        suppliers={suppliers}
      />

      {/* Modal de plano de ação para municípios */}
      <MunicipalityActionPlanModal
        supplier={selectedMunicipalitySupplier?.supplier || null}
        riskLevel={selectedMunicipalitySupplier?.riskLevel || 'normal'}
        riskMultiplier={selectedMunicipalitySupplier?.riskMultiplier || 1}
        avgSectorIntensity={selectedMunicipalitySupplier?.avgSectorIntensity || 0}
        open={municipalityPlanOpen}
        onOpenChange={setMunicipalityPlanOpen}
      />
    </>
  );
};
