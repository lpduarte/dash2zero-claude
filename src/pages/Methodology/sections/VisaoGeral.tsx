import {
  BookOpen, BarChart3, Scale, TrendingDown,
  Leaf, Landmark, Building2,
} from "lucide-react";
import SectionHeader from "../SectionHeader";

export const VisaoGeral = () => (
  <>
    <SectionHeader
      id="visao-geral"
      title="Visão Geral do Dash2Zero"
      icon={BookOpen}
      description="Plataforma de tracking e gestão de emissões de carbono"
    />

    <div className="space-y-6">
      <p className="text-muted-foreground">
        O Dash2Zero é uma plataforma desenvolvida pela Get2C para ajudar
        organizações a medir, comparar e reduzir a sua pegada de carbono.
      </p>

      {/* Card destacado - O que é */}
      <div className="border rounded-lg p-6 bg-primary/5 border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-primary/20">
            <Leaf className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Dash2Zero</h3>
            <p className="text-sm text-muted-foreground">For a cooler world</p>
          </div>
        </div>
        <p className="text-muted-foreground">
          Uma solução completa para organizações que pretendem iniciar ou
          acelerar o seu percurso de descarbonização, com ferramentas de
          análise, comparação e planeamento.
        </p>
      </div>

      {/* 3 Cards: Medir, Comparar, Reduzir */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="border rounded-lg p-4 bg-card">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-scope-1/10">
              <BarChart3 className="h-5 w-5 text-scope-1" />
            </div>
            <h4 className="font-bold">Medir</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Calcular emissões por âmbito (Scope 1, 2, 3) seguindo
            o GHG Protocol internacional.
          </p>
        </div>

        <div className="border rounded-lg p-4 bg-card">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-scope-2/10">
              <Scale className="h-5 w-5 text-scope-2" />
            </div>
            <h4 className="font-bold">Comparar</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Benchmarking setorial com dados do INE para identificar
            oportunidades de melhoria.
          </p>
        </div>

        <div className="border rounded-lg p-4 bg-card">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-status-complete/10">
              <TrendingDown className="h-5 w-5 text-status-complete" />
            </div>
            <h4 className="font-bold">Reduzir</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Planos de acção com medidas concretas e fontes de
            financiamento disponíveis.
          </p>
        </div>
      </div>

      {/* Para quem */}
      <div className="border rounded-lg p-4 bg-card">
        <h3 className="font-bold mb-3">Para quem é o Dash2Zero?</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <Landmark className="h-5 w-5 text-purple-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold">Municípios</p>
              <p className="text-sm text-muted-foreground">
                Autarquias que pretendem acompanhar e incentivar a
                descarbonização das empresas do seu território.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Building2 className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold">Empresas</p>
              <p className="text-sm text-muted-foreground">
                Organizações que querem gerir a pegada de carbono
                da sua cadeia de fornecedores.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);
