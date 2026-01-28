import { BarChart3, Info } from "lucide-react";
import SectionHeader from "../SectionHeader";

export const Indicadores = () => (
  <>
    <SectionHeader
      id="indicadores"
      title="Indicadores de Intensidade"
      icon={BarChart3}
      description="Métricas normalizadas para comparação entre empresas"
    />

    <div className="space-y-6">
      <p className="text-muted-foreground">
        Os indicadores de intensidade permitem comparar empresas de diferentes dimensões,
        normalizando as emissões por diferentes métricas de atividade.
      </p>

          <div className="grid gap-4">
            <div className="border rounded-lg p-4 bg-card">
              <h4 className="font-bold mb-2">Emissões por Faturação</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Mede a eficiência de carbono por unidade de valor económico gerado.
              </p>
              <div className="p-3 bg-muted/50 rounded">
                <p className="text-xs font-mono text-muted-foreground">
                  Intensidade = Emissões Totais (t CO₂e) / Faturação (M€)
                </p>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-card">
              <h4 className="font-bold mb-2">Emissões por Colaborador</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Mede a pegada de carbono média por pessoa na organização.
              </p>
              <div className="p-3 bg-muted/50 rounded">
                <p className="text-xs font-mono text-muted-foreground">
                  Intensidade = Emissões Totais (t CO₂e) / Nº Colaboradores
                </p>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-card">
              <h4 className="font-bold mb-2">Emissões por Área</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Mede a intensidade de emissões por unidade de espaço ocupado.
              </p>
              <div className="p-3 bg-muted/50 rounded">
                <p className="text-xs font-mono text-muted-foreground">
                  Intensidade = Emissões Totais (t CO₂e) / Área (m²)
                </p>
              </div>
            </div>
          </div>

      <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
        <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
        <p className="text-sm text-muted-foreground">
          Estes indicadores são úteis para benchmarking setorial, permitindo identificar
          empresas com desempenho acima ou abaixo da média do seu setor.
        </p>
      </div>
    </div>
  </>
);
