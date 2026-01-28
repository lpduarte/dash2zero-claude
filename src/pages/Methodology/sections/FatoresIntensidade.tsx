import { useMemo } from "react";
import { Scale, Landmark, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import SectionHeader from "../SectionHeader";
import { sectorLabels } from "@/data/sectors";
import {
  sectorEmissionFactors,
  industrySubsectorFactors,
  emissionIntensityMetadata,
} from "@/data/emissionIntensity";

export const FatoresIntensidade = () => {
  const sortedSectorFactors = useMemo(
    () => [...sectorEmissionFactors].sort((a, b) => b.intensity - a.intensity),
    []
  );
  const sortedSubsectorFactors = useMemo(
    () => [...industrySubsectorFactors].sort((a, b) => b.intensity - a.intensity),
    []
  );

  return (
  <>
    <SectionHeader
      id="intensidades"
      title="Fatores de Intensidade de Carbono"
      icon={Scale}
      description="Benchmarks setoriais de emissões por unidade de valor económico"
    />

    <div className="space-y-6">
      <p className="text-muted-foreground">
        Os fatores de intensidade de carbono permitem comparar empresas do mesmo setor
        e estimar emissões quando dados reais não estão disponíveis.
      </p>

          {/* Fonte dos Dados */}
          <div className="border rounded-lg p-4 space-y-4 bg-card">
            <div className="flex items-center gap-2">
              <Landmark className="h-4 w-4 text-primary" />
              <h3 className="font-bold">Fonte dos Dados</h3>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                <span className="font-bold">Entidade:</span>
                <span className="text-muted-foreground">INE - Instituto Nacional de Estatística</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                <span className="font-bold">Publicação:</span>
                <span className="text-muted-foreground">Contas das Emissões Atmosféricas 1995-2022</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                <span className="font-bold">Data:</span>
                <span className="text-muted-foreground">Outubro 2024</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                <span className="font-bold">Ano referência:</span>
                <span className="text-muted-foreground">2022</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                <span className="font-bold">Unidade:</span>
                <span className="text-muted-foreground">kg CO₂eq por € de VAB</span>
              </div>
            </div>
          </div>

          {/* Tabela de Intensidades */}
          <div className="border rounded-lg p-4 space-y-4 bg-card">
            <h3 className="font-bold">
              Intensidade de Carbono por Setor ({emissionIntensityMetadata.referenceYear})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">Intensidade de carbono por setor</caption>
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 font-bold">Setor</th>
                    <th className="text-right py-2 pr-4 font-bold">Intensidade</th>
                    <th className="text-left py-2 font-bold">Fonte</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {sortedSectorFactors.map((factor) => (
                      <tr key={factor.sector}>
                        <td className="py-2 pr-4">{sectorLabels[factor.sector] || factor.sector}</td>
                        <td className="py-2 pr-4 text-right font-mono">{factor.intensity.toFixed(2)}</td>
                        <td className="py-2">
                          <Badge
                            variant={factor.source === 'reported' ? 'default' : 'outline'}
                            className={cn(
                              "text-xs",
                              factor.source === 'reported' && "bg-success/20 text-success border-success/30",
                              factor.source === 'calculated' && "bg-blue-500/20 text-blue-500 border-blue-500/30",
                              factor.source === 'estimated' && "bg-warning/20 text-warning border-warning/30"
                            )}
                          >
                            {factor.source === 'reported' ? 'INE' :
                             factor.source === 'calculated' ? 'Calc.' : 'Est.'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground">
              <strong>Legenda:</strong> INE = Valor reportado pelo INE | Calc. = Calculado de VAB/GWP | Est. = Estimado
            </p>
          </div>

          {/* Subsetores da Indústria */}
          <div className="border rounded-lg p-4 space-y-4 bg-card">
            <h3 className="font-bold">Intensidade de Subsetores Industriais (Seção C)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {sortedSubsectorFactors.map((factor) => {
                  const isHighIntensity = factor.intensity > 1.0;
                  return (
                    <div
                      key={factor.subsector}
                      className={cn(
                        "flex items-center justify-between p-2 rounded",
                        isHighIntensity ? "bg-danger/10 border border-danger/30" : "bg-muted/30"
                      )}
                    >
                      <span className="text-sm">{sectorLabels[factor.subsector] || factor.subsector}</span>
                      <Badge
                        variant={isHighIntensity ? "destructive" : "secondary"}
                        className="font-mono text-xs"
                      >
                        {factor.intensity.toFixed(2)}
                      </Badge>
                    </div>
                  );
                })}
            </div>
            <p className="text-xs text-muted-foreground">
              Valores em {emissionIntensityMetadata.unit}.
              Subsetores a vermelho têm intensidade acima de 1.0 kg/€.
            </p>
          </div>

          {/* Nota metodológica */}
          <div className="flex items-start gap-2 p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
            <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold">Sobre a Metodologia</p>
              <p className="text-xs text-muted-foreground">
                Os fatores de intensidade são calculados pelo INE como GWP/VAB (Potencial de Aquecimento Global
                dividido pelo Valor Acrescentado Bruto). Refletem a média de emissões por unidade de valor
                económico gerado em cada setor da economia portuguesa.
              </p>
            </div>
          </div>

          {/* Justificação de Valores */}
          <div className="border rounded-lg p-4 space-y-4 bg-card">
            <h3 className="font-bold">Classificação dos Valores</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-2 rounded bg-success/10 border border-success/30">
                <Badge className="shrink-0">INE</Badge>
                <div>
                  <p className="text-sm font-bold">Valores Reportados</p>
                  <p className="text-xs text-muted-foreground">
                    Citados diretamente nas publicações oficiais do INE, páginas 5 e 7 das Contas das Emissões Atmosféricas.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 rounded bg-blue-500/10 border border-blue-500/30">
                <Badge variant="outline" className="shrink-0">Calc.</Badge>
                <div>
                  <p className="text-sm font-bold">Valores Calculados</p>
                  <p className="text-xs text-muted-foreground">
                    Derivados de relações VAB/GWP publicadas pelo INE. Ex: Financeiro = 1 / 463.8 €/kg = 0.002 kg/€.
                    Confirmados por comparação com dados Eurostat.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 rounded bg-warning/10 border border-warning/30">
                <Badge variant="outline" className="shrink-0">Est.</Badge>
                <div>
                  <p className="text-sm font-bold">Valores Estimados</p>
                  <p className="text-xs text-muted-foreground">
                    Baseados em médias Eurostat para Portugal, comparação com DEFRA UK, ou interpolação de setores similares.
                    Têm maior incerteza e devem ser usados com cautela.
                  </p>
                </div>
              </div>
            </div>
          </div>

      {/* Limitações */}
      <div className="flex items-start gap-2 p-3 bg-warning/5 rounded-lg border border-warning/20">
        <Info className="h-4 w-4 text-warning mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-bold">Limitações dos Dados</p>
          <ul className="text-xs text-muted-foreground mt-1 space-y-1 list-disc list-inside">
            <li>Valores são médias setoriais; empresas individuais podem variar significativamente</li>
            <li>Dados de 2022 com metodologia INE, podem haver revisões futuras</li>
            <li>Valores estimados têm maior incerteza e devem ser usados com cautela</li>
            <li>Classificação CAE pode não captar especificidades de atividades mistas</li>
          </ul>
        </div>
      </div>
    </div>
  </>
  );
};
