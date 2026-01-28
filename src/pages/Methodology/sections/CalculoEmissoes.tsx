import { Factory } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SectionHeader from "../SectionHeader";

export const CalculoEmissoes = () => (
  <>
    <SectionHeader
      id="emissoes"
      title="Cálculo de Emissões"
      icon={Factory}
      description="Metodologia GHG Protocol para cálculo de emissões de gases com efeito de estufa"
    />

    <div className="space-y-6">
      <p className="text-muted-foreground">
        As emissões de gases com efeito de estufa (GEE) são calculadas seguindo o
        GHG Protocol, a metodologia internacional mais utilizada.
      </p>

          {/* Scopes */}
          <div className="space-y-4">
            <h3 className="font-bold">Âmbitos de Emissões (Scopes)</h3>

            <div className="grid gap-4">
              <div className="border rounded-lg p-4 bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-scope-1 text-white">Scope 1</Badge>
                  <span className="font-bold">Emissões Diretas</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Emissões de fontes que a empresa possui ou controla diretamente
                  (ex: combustão em caldeiras, veículos da frota própria, processos industriais).
                </p>
              </div>

              <div className="border rounded-lg p-4 bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-scope-2 text-white">Scope 2</Badge>
                  <span className="font-bold">Emissões Indiretas - Energia</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Emissões associadas à produção da energia elétrica e térmica adquirida
                  e consumida pela empresa.
                </p>
              </div>

              <div className="border rounded-lg p-4 bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-scope-3 text-white">Scope 3</Badge>
                  <span className="font-bold">Outras Emissões Indiretas</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Todas as outras emissões indiretas na cadeia de valor
                  (ex: deslocações de colaboradores, transporte de mercadorias, resíduos).
                </p>
              </div>
            </div>
          </div>

      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-sm font-bold mb-2">Fórmula de Cálculo Total:</p>
        <div className="p-3 bg-background rounded border">
          <p className="text-xs font-mono text-muted-foreground">
            Emissões Totais (t CO₂e) = Scope 1 + Scope 2 + Scope 3
          </p>
        </div>
      </div>
    </div>
  </>
);
