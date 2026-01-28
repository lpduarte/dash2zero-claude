import { LayoutDashboard, Building2, Landmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SectionHeader from "../SectionHeader";

export const Dashboard = () => (
  <>
    <SectionHeader
      id="dashboard"
      title="Dashboard"
      icon={LayoutDashboard}
      description="Análise e monitorização de emissões de carbono"
    />

    <div className="space-y-6">
      <p className="text-muted-foreground">
        O Dashboard oferece uma visão consolidada das emissões de carbono
        do seu portfolio de empresas, com métricas, gráficos e ferramentas de análise.
      </p>

      {/* Métricas Principais */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Métricas Principais (KPIs)</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">Métricas principais do dashboard</caption>
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-bold">Métrica</th>
                <th className="text-left py-2 pr-4 font-bold">Descrição</th>
                <th className="text-left py-2 font-bold">Unidade</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-2 pr-4 font-bold">Emissões Totais</td>
                <td className="py-2 pr-4 text-muted-foreground">Soma de todas as emissões das empresas</td>
                <td className="py-2 text-muted-foreground">t CO₂e</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-bold">Potencial de Melhoria</td>
                <td className="py-2 pr-4 text-muted-foreground">Redução possível com otimizações</td>
                <td className="py-2 text-muted-foreground">Alto/Médio/Baixo</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-bold">Média por Facturação</td>
                <td className="py-2 pr-4 text-muted-foreground">Intensidade de carbono por euro gerado</td>
                <td className="py-2 text-muted-foreground">t CO₂e/€</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-bold">Média por Colaborador</td>
                <td className="py-2 pr-4 text-muted-foreground">Intensidade de carbono por pessoa</td>
                <td className="py-2 text-muted-foreground">t CO₂e/colaborador</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-bold">Média por Área</td>
                <td className="py-2 pr-4 text-muted-foreground">Intensidade de carbono por metro quadrado</td>
                <td className="py-2 text-muted-foreground">t CO₂e/m²</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5 Separadores */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Separadores do Dashboard</h3>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <Badge className="shrink-0">1</Badge>
            <div>
              <p className="font-bold">Visão Geral</p>
              <p className="text-sm text-muted-foreground">
                KPIs principais, cobertura de dados, lista de empresas críticas (acima da média)
                e top performers (mais eficientes).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Badge variant="secondary" className="shrink-0">2</Badge>
            <div>
              <p className="font-bold">Empresas</p>
              <p className="text-sm text-muted-foreground">
                Lista completa de empresas com filtros avançados, pesquisa por nome/NIF,
                ordenação por múltiplos critérios, e visualização em grid ou tabela.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Badge variant="secondary" className="shrink-0">3</Badge>
            <div>
              <p className="font-bold">Detalhes de Emissões</p>
              <p className="text-sm text-muted-foreground">
                Gráficos de distribuição por âmbito (Scope 1, 2, 3), comparações
                temporais e análise de evolução das emissões.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Badge variant="secondary" className="shrink-0">4</Badge>
            <div>
              <p className="font-bold">Análise por Atividade</p>
              <p className="text-sm text-muted-foreground">
                Heatmap região×sector para identificar concentrações de emissões,
                benchmarking sectorial comparando com médias nacionais.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Badge variant="secondary" className="shrink-0">5</Badge>
            <div>
              <p className="font-bold">Análise Financeira</p>
              <p className="text-sm text-muted-foreground">
                Ranking por eficiência financeira (FE = emissões/facturação),
                gráfico Pareto 80/20 identificando empresas responsáveis pela maioria das emissões.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros Disponíveis */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Filtros Disponíveis</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-muted/30 text-center">
            <p className="font-bold text-sm">Cluster</p>
            <p className="text-xs text-muted-foreground">Grupo de empresas</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 text-center">
            <p className="font-bold text-sm">Dimensão</p>
            <p className="text-xs text-muted-foreground">Micro, Pequena, Média, Grande</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 text-center">
            <p className="font-bold text-sm">Sector</p>
            <p className="text-xs text-muted-foreground">Código CAE</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 text-center">
            <p className="font-bold text-sm">Região</p>
            <p className="text-xs text-muted-foreground">Distrito, Município, Freguesia</p>
          </div>
        </div>
      </div>

      {/* Diferenças por Tipo de Utilizador */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="border rounded-lg p-4 space-y-3 bg-blue-500/5 border-blue-500/20">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-blue-500" />
            <h3 className="font-bold">Vista Empresa</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Foco na gestão de fornecedores e cadeia de valor:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Análise de fornecedores por emissões</li>
            <li>Alternativas mais eficientes</li>
            <li>Impacto de substituição</li>
            <li>Otimização de Scope 3</li>
          </ul>
        </div>

        <div className="border rounded-lg p-4 space-y-3 bg-purple-500/5 border-purple-500/20">
          <div className="flex items-center gap-2">
            <Landmark className="h-4 w-4 text-purple-500" />
            <h3 className="font-bold">Vista Município</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Foco na gestão territorial e políticas públicas:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Empresas de risco no território</li>
            <li>Emissões acima da média sectorial</li>
            <li>Infraestruturas de descarbonização</li>
            <li>Programas de incentivo</li>
          </ul>
        </div>
      </div>

      {/* KPIs de Infraestruturas (Municípios) */}
      <div className="border rounded-lg p-4 space-y-4 bg-purple-500/5 border-purple-500/20">
        <div className="flex items-center gap-2">
          <Landmark className="h-4 w-4 text-purple-500" />
          <h3 className="font-bold">KPIs de Infraestruturas (Municípios)</h3>
        </div>

        <p className="text-sm text-muted-foreground">
          Indicadores de infraestruturas de apoio à descarbonização no território:
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            "Postos de carregamento",
            "Ecopontos",
            "Estações de bicicletas",
            "Contentores orgânicos",
            "Ciclovias (km)",
            "Paragens de transporte público",
            "Qualidade do ar",
          ].map((item) => (
            <div key={item} className="p-2 rounded bg-muted/30">
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detalhes dos Separadores */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Detalhes dos Separadores</h3>

        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-muted/30 space-y-2">
            <p className="font-bold text-sm">Visão Geral</p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Cards de KPI com valores agregados e tendências</li>
              <li>Barra de cobertura de dados (percentagem de empresas com pegada calculada)</li>
              <li>Top 5 empresas com maior emissão absoluta</li>
              <li>Top 5 empresas mais eficientes por intensidade de carbono</li>
            </ul>
          </div>

          <div className="p-3 rounded-lg bg-muted/30 space-y-2">
            <p className="font-bold text-sm">Empresas</p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Listagem completa com pesquisa, filtros e ordenação</li>
              <li>Vista em cards ou tabela (toggle de visualização)</li>
              <li>Exportação de dados em CSV</li>
              <li>Acesso directo ao detalhe de cada empresa</li>
            </ul>
          </div>

          <div className="p-3 rounded-lg bg-muted/30 space-y-2">
            <p className="font-bold text-sm">Detalhes de Emissões</p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Distribuição por Scope (1, 2, 3) em gráfico circular</li>
              <li>Evolução temporal das emissões</li>
              <li>Breakdown por categoria de actividade</li>
            </ul>
          </div>

          <div className="p-3 rounded-lg bg-muted/30 space-y-2">
            <p className="font-bold text-sm">Análise por Actividade</p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Heatmap região × sector para identificar concentrações</li>
              <li>Benchmarking sectorial com médias nacionais</li>
              <li>Ranking de sectores por intensidade de carbono</li>
            </ul>
          </div>

          <div className="p-3 rounded-lg bg-muted/30 space-y-2">
            <p className="font-bold text-sm">Análise Financeira</p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Financial Efficiency (FE) = emissões / facturação</li>
              <li>Gráfico Pareto 80/20 para priorização</li>
              <li>Comparação de eficiência entre empresas</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sistema de Filtros Avançado */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Sistema de Filtros Avançado</h3>
        <p className="text-sm text-muted-foreground">
          Todos os separadores partilham um sistema de filtros persistente que permite
          refinar a análise em tempo real.
        </p>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <p className="font-bold text-sm">Filtros de Segmentação</p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Por cluster (grupo de empresas)</li>
              <li>Por dimensão (Micro, PME, Grande)</li>
              <li>Por sector de actividade (CAE)</li>
              <li>Por região geográfica</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-bold text-sm">Filtros de Performance</p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Empresas acima/abaixo da média</li>
              <li>Com/sem pegada calculada</li>
              <li>Por nível de potencial de melhoria</li>
              <li>Por intervalo de emissões</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </>
);
