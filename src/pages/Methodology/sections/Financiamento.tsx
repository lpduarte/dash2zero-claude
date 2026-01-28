import { Euro, Gift, Receipt, Info } from "lucide-react";
import SectionHeader from "../SectionHeader";

export const Financiamento = () => (
  <>
    <SectionHeader
      id="financiamento"
      title="Financiamento"
      icon={Euro}
      description="Fontes de financiamento para a descarbonização"
    />

    <div className="space-y-6">
      <p className="text-muted-foreground">
        A secção de financiamento agrega informação sobre programas de apoio,
        incentivos fiscais e fontes de financiamento disponíveis para projectos
        de descarbonização.
      </p>

      {/* Tipos de Financiamento */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Tipos de Financiamento</h3>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="p-3 rounded-lg bg-muted/30 space-y-2">
            <Gift className="h-5 w-5 text-green-500 mb-1" />
            <p className="font-bold text-sm">Subsídios</p>
            <p className="text-xs text-muted-foreground">
              Fundos europeus (PRR, PT2030), programas nacionais
              e apoios municipais a fundo perdido.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-muted/30 space-y-2">
            <Receipt className="h-5 w-5 text-blue-500 mb-1" />
            <p className="font-bold text-sm">Incentivos Fiscais</p>
            <p className="text-xs text-muted-foreground">
              Deduções em IRC, benefícios fiscais para investimentos
              verdes e créditos de carbono.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-muted/30 space-y-2">
            <Euro className="h-5 w-5 text-purple-500 mb-1" />
            <p className="font-bold text-sm">Linhas de Crédito</p>
            <p className="text-xs text-muted-foreground">
              Linhas de crédito bonificado para projectos de eficiência
              energética e transição verde.
            </p>
          </div>
        </div>
      </div>

      {/* Informação por Programa */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Informação por Programa</h3>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
          <li><strong>Nome do programa</strong> e entidade promotora</li>
          <li><strong>Elegibilidade:</strong> Tipos de empresa, sectores, dimensão</li>
          <li><strong>Montantes:</strong> Valor mínimo e máximo de apoio</li>
          <li><strong>Prazos:</strong> Datas de candidatura e execução</li>
          <li><strong>Documentação:</strong> Links para regulamentos e formulários</li>
        </ul>
      </div>

      {/* Nota */}
      <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
        <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
        <p className="text-sm text-muted-foreground">
          A informação de financiamento é actualizada periodicamente pela equipa Get2C.
          Consulte sempre as fontes oficiais para confirmar elegibilidade e prazos.
        </p>
      </div>
    </div>
  </>
);
