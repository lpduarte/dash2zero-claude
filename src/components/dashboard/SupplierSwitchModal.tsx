import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Supplier } from "@/types/supplier";
import {
  ArrowRight,
  TrendingDown,
  Euro,
  FileDown,
  Bookmark,
  BookmarkCheck,
  MessageSquare,
  RefreshCw,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { sectorLabels } from "./SupplierLabel";

interface SupplierSwitchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  criticalSupplier: Supplier;
  suggestedAlternative: Supplier | null;
  allAlternatives: Supplier[];
}

export const SupplierSwitchModal = ({
  open,
  onOpenChange,
  criticalSupplier,
  suggestedAlternative,
  allAlternatives,
}: SupplierSwitchModalProps) => {
  const [selectedAlternativeId, setSelectedAlternativeId] = useState<string>(
    suggestedAlternative?.id || ""
  );
  const [notes, setNotes] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Sync selectedAlternativeId when modal opens or suggestedAlternative changes
  useEffect(() => {
    if (open && suggestedAlternative?.id) {
      setSelectedAlternativeId(suggestedAlternative.id);
    }
  }, [open, suggestedAlternative?.id]);

  const selectedAlternative =
    allAlternatives.find((s) => s.id === selectedAlternativeId) ||
    suggestedAlternative;

  const emissionsSavings = selectedAlternative
    ? criticalSupplier.totalEmissions - selectedAlternative.totalEmissions
    : 0;
  const savingsPercentage = selectedAlternative
    ? ((emissionsSavings / criticalSupplier.totalEmissions) * 100).toFixed(0)
    : 0;

  // Financial impact estimation (simplified - based on emissions factor difference)
  const feImprovement = selectedAlternative
    ? criticalSupplier.emissionsPerRevenue - selectedAlternative.emissionsPerRevenue
    : 0;
  const estimatedCostImpact = selectedAlternative
    ? Math.abs(feImprovement * 1000).toFixed(0) // Simplified estimation
    : 0;

  const handleExportPDF = () => {
    toast.success("Relatório PDF gerado com sucesso", {
      description: `Análise de mudança: ${criticalSupplier.name} → ${selectedAlternative?.name}`,
    });
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(
      isBookmarked
        ? "Análise removida da lista de revisão"
        : "Análise marcada para revisão posterior"
    );
  };

  const handleSaveNotes = () => {
    if (notes.trim()) {
      toast.success("Notas guardadas com sucesso");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <RefreshCw className="h-5 w-5 text-primary" />
            Análise de mudança de fornecedor
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {/* Unified comparison table */}
          <div className="border border-border rounded-lg overflow-hidden">
            {/* Headers */}
            <div className="grid grid-cols-[1fr_48px_1fr]">
              <div className="p-4 bg-danger/5 border-b border-border flex flex-col">
                <Badge className="bg-danger mb-2 w-fit">Empresa atual</Badge>
                <div className="flex-1 flex items-center">
                  <h3 className="font-semibold text-xl">{criticalSupplier.name}</h3>
                </div>
              </div>

              <div className="flex items-center justify-center bg-muted/10 border-x border-b border-border">
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="p-4 bg-success/5 border-b border-border flex flex-col">
                <Badge className="bg-success mb-2 w-fit">Alternativa</Badge>
                <div className="flex-1 flex flex-col justify-center gap-2">
                  <Select
                    value={selectedAlternativeId}
                    onValueChange={setSelectedAlternativeId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecionar alternativa">
                        {selectedAlternative?.name}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="min-w-[320px]">
                      {Object.entries(
                        allAlternatives.reduce((acc, alt) => {
                          const sector = sectorLabels[alt.sector] || alt.sector;
                          if (!acc[sector]) acc[sector] = [];
                          acc[sector].push(alt);
                          return acc;
                        }, {} as Record<string, typeof allAlternatives>)
                      )
                        .sort(([sectorA], [sectorB]) => {
                          const criticalSectorLabel = sectorLabels[criticalSupplier.sector] || criticalSupplier.sector;
                          if (sectorA === criticalSectorLabel) return -1;
                          if (sectorB === criticalSectorLabel) return 1;
                          return sectorA.localeCompare(sectorB);
                        })
                        .map(([sector, alternatives]) => (
                        <div key={sector}>
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">
                            {sector}
                          </div>
                          {alternatives.map((alt) => {
                            const reduction = ((criticalSupplier.totalEmissions - alt.totalEmissions) / criticalSupplier.totalEmissions * 100);
                            return (
                              <SelectItem key={alt.id} value={alt.id} className="pr-16">
                                <span>{alt.name}</span>
                                <Badge className="bg-success text-xs absolute right-2 top-1/2 -translate-y-1/2">
                                  -{reduction.toFixed(0)}%
                                </Badge>
                              </SelectItem>
                            );
                          })}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedAlternative && selectedAlternative.sector !== criticalSupplier.sector && (
                    <p className="text-xs text-warning flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-warning"></span>
                      Atividade diferente: {sectorLabels[selectedAlternative.sector] || selectedAlternative.sector}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Comparison rows */}
            {selectedAlternative && (
              <>
                {/* Emissões totais */}
                <div className="grid grid-cols-[1fr_48px_1fr] border-b border-border">
                  <div className="p-3 bg-danger/5">
                    <p className="text-xs text-muted-foreground mb-1">Emissões totais</p>
                    <p className="font-semibold text-danger">
                      {criticalSupplier.totalEmissions.toLocaleString("pt-PT")} t CO₂e
                    </p>
                  </div>
                  <div className="flex items-center justify-center bg-muted/10 border-x border-border">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="p-3 bg-success/5">
                    <p className="text-xs text-muted-foreground mb-1">Emissões totais</p>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-success">
                        {selectedAlternative.totalEmissions.toLocaleString("pt-PT")} t CO₂e
                      </p>
                      <Badge className="bg-success text-xs">
                        -{((criticalSupplier.totalEmissions - selectedAlternative.totalEmissions) / criticalSupplier.totalEmissions * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Âmbito 1 */}
                <div className="grid grid-cols-[1fr_48px_1fr] border-b border-border">
                  <div className="p-3 bg-danger/5">
                    <p className="text-xs text-muted-foreground mb-1">Âmbito 1</p>
                    <p className="font-medium">{criticalSupplier.scope1.toLocaleString("pt-PT")} t CO₂e</p>
                  </div>
                  <div className="flex items-center justify-center bg-muted/10 border-x border-border">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="p-3 bg-success/5">
                    <p className="text-xs text-muted-foreground mb-1">Âmbito 1</p>
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{selectedAlternative.scope1.toLocaleString("pt-PT")} t CO₂e</p>
                      {criticalSupplier.scope1 > 0 && (
                        <Badge variant="outline" className="text-xs text-success border-success/50">
                          {((criticalSupplier.scope1 - selectedAlternative.scope1) / criticalSupplier.scope1 * 100) > 0 ? '-' : '+'}
                          {Math.abs((criticalSupplier.scope1 - selectedAlternative.scope1) / criticalSupplier.scope1 * 100).toFixed(0)}%
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Âmbito 2 */}
                <div className="grid grid-cols-[1fr_48px_1fr] border-b border-border">
                  <div className="p-3 bg-danger/5">
                    <p className="text-xs text-muted-foreground mb-1">Âmbito 2</p>
                    <p className="font-medium">{criticalSupplier.scope2.toLocaleString("pt-PT")} t CO₂e</p>
                  </div>
                  <div className="flex items-center justify-center bg-muted/10 border-x border-border">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="p-3 bg-success/5">
                    <p className="text-xs text-muted-foreground mb-1">Âmbito 2</p>
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{selectedAlternative.scope2.toLocaleString("pt-PT")} t CO₂e</p>
                      {criticalSupplier.scope2 > 0 && (
                        <Badge variant="outline" className="text-xs text-success border-success/50">
                          {((criticalSupplier.scope2 - selectedAlternative.scope2) / criticalSupplier.scope2 * 100) > 0 ? '-' : '+'}
                          {Math.abs((criticalSupplier.scope2 - selectedAlternative.scope2) / criticalSupplier.scope2 * 100).toFixed(0)}%
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Âmbito 3 */}
                <div className="grid grid-cols-[1fr_48px_1fr] border-b border-border">
                  <div className="p-3 bg-danger/5">
                    <p className="text-xs text-muted-foreground mb-1">Âmbito 3</p>
                    <p className="font-medium">{criticalSupplier.scope3.toLocaleString("pt-PT")} t CO₂e</p>
                  </div>
                  <div className="flex items-center justify-center bg-muted/10 border-x border-border">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="p-3 bg-success/5">
                    <p className="text-xs text-muted-foreground mb-1">Âmbito 3</p>
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{selectedAlternative.scope3.toLocaleString("pt-PT")} t CO₂e</p>
                      {criticalSupplier.scope3 > 0 && (
                        <Badge variant="outline" className="text-xs text-success border-success/50">
                          {((criticalSupplier.scope3 - selectedAlternative.scope3) / criticalSupplier.scope3 * 100) > 0 ? '-' : '+'}
                          {Math.abs((criticalSupplier.scope3 - selectedAlternative.scope3) / criticalSupplier.scope3 * 100).toFixed(0)}%
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* FE */}
                <div className="grid grid-cols-[1fr_48px_1fr]">
                  <div className="p-3 bg-danger/5">
                    <p className="text-xs text-muted-foreground mb-1">Emissões por faturação</p>
                    <p className="font-medium">{criticalSupplier.emissionsPerRevenue.toFixed(1)} t CO₂e/€</p>
                  </div>
                  <div className="flex items-center justify-center bg-muted/10 border-x border-border">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="p-3 bg-success/5">
                    <p className="text-xs text-muted-foreground mb-1">Emissões por faturação</p>
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{selectedAlternative.emissionsPerRevenue.toFixed(1)} t CO₂e/€</p>
                      {criticalSupplier.emissionsPerRevenue > 0 && (
                        <Badge variant="outline" className="text-xs text-success border-success/50">
                          {((criticalSupplier.emissionsPerRevenue - selectedAlternative.emissionsPerRevenue) / criticalSupplier.emissionsPerRevenue * 100) > 0 ? '-' : '+'}
                          {Math.abs((criticalSupplier.emissionsPerRevenue - selectedAlternative.emissionsPerRevenue) / criticalSupplier.emissionsPerRevenue * 100).toFixed(0)}%
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {!selectedAlternative && (
            <div className="py-8 text-center text-muted-foreground border rounded-lg mt-4">
              <p>Selecione uma alternativa para comparar</p>
            </div>
          )}

          {/* Notes section */}
          <div className="space-y-2 mt-6">
            <Label className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Observações
            </Label>
            <Textarea
              placeholder="Adicione notas sobre esta análise de mudança..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
            {notes.trim() && (
              <Button variant="outline" size="sm" onClick={handleSaveNotes}>
                Guardar Notas
              </Button>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2">
              <Button
                variant={isBookmarked ? "default" : "outline"}
                onClick={handleBookmark}
                className={isBookmarked ? "bg-primary" : ""}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="h-4 w-4 mr-1" />
                ) : (
                  <Bookmark className="h-4 w-4 mr-1" />
                )}
                {isBookmarked ? "Marcado para revisão" : "Marcar para revisão"}
              </Button>
              {selectedAlternative && (
                <Button
                  variant="outline"
                  onClick={() => {
                    window.location.href = `mailto:${selectedAlternative.contact.email}?subject=Contacto%20-%20Parceria%20de%20Sustentabilidade`;
                    toast.success("A abrir cliente de email", {
                      description: `Contactar ${selectedAlternative.name}`,
                    });
                  }}
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Contactar empresa
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleExportPDF}>
                <FileDown className="h-4 w-4 mr-1" />
                Exportar PDF
              </Button>
              <Button onClick={() => onOpenChange(false)}>Fechar</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
