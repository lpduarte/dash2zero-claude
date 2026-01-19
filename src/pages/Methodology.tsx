import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Calculator, Building2, Factory, TrendingDown,
  ArrowRight, Info, BarChart3, Users, Landmark
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// VERSIONING
// ============================================
const METHODOLOGY_VERSION = {
  major: 1,
  minor: 0,
  patch: 0,
  date: "2026-01-19",
};

const getVersionString = () => `v${METHODOLOGY_VERSION.major}.${METHODOLOGY_VERSION.minor}.${METHODOLOGY_VERSION.patch}`;

export default function Methodology() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calculator className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Documentação Metodológica</h1>
            <Badge variant="outline" className="ml-2">{getVersionString()}</Badge>
          </div>
          <p className="text-muted-foreground">
            Esta página documenta as metodologias e fórmulas de cálculo utilizadas na plataforma Dash2Zero.
          </p>
        </div>

        <Tabs defaultValue="potencial" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="potencial">Potencial de Melhoria</TabsTrigger>
            <TabsTrigger value="emissoes">Cálculo de Emissões</TabsTrigger>
            <TabsTrigger value="indicadores">Indicadores</TabsTrigger>
          </TabsList>

          {/* Tab: Potencial de Melhoria */}
          <TabsContent value="potencial" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-primary" />
                  Potencial de Melhoria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  O cálculo do potencial de melhoria é diferenciado consoante o tipo de utilizador,
                  refletindo as diferentes estratégias disponíveis para redução de emissões.
                </p>

                {/* Vista Empresa */}
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded bg-blue-500/10">
                      <Building2 className="h-4 w-4 text-blue-500" />
                    </div>
                    <h3 className="font-semibold">Vista Empresa: Potencial de Substituição</h3>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Uma empresa pode otimizar a sua cadeia de valor substituindo fornecedores ou parceiros
                    com elevada pegada carbónica por alternativas mais eficientes no mesmo setor.
                  </p>

                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <p className="text-sm font-medium">Metodologia:</p>
                    <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                      <li>Para cada fornecedor, identificar alternativas no mesmo setor com menores emissões</li>
                      <li>Calcular a diferença entre as emissões do fornecedor atual e a melhor alternativa</li>
                      <li>Somar todas as reduções potenciais</li>
                    </ol>

                    <div className="mt-4 p-3 bg-background rounded border">
                      <p className="text-xs font-mono text-muted-foreground">
                        Potencial = Σ (Emissões_fornecedor - Emissões_melhor_alternativa)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                    <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Este cálculo assume que a empresa pode escolher entre diferentes fornecedores
                      do mesmo setor, priorizando aqueles com menor intensidade carbónica.
                    </p>
                  </div>
                </div>

                {/* Vista Município */}
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded bg-purple-500/10">
                      <Landmark className="h-4 w-4 text-purple-500" />
                    </div>
                    <h3 className="font-semibold">Vista Município: Potencial de Melhoria Setorial</h3>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Um município não pode substituir as empresas do seu território. O seu papel é apoiar
                    e incentivar as empresas a implementarem medidas de redução de emissões.
                  </p>

                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <p className="text-sm font-medium">Metodologia:</p>
                    <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                      <li>Calcular a média de emissões por setor de atividade</li>
                      <li>Identificar empresas com emissões acima da média do seu setor</li>
                      <li>Calcular a redução necessária para cada empresa atingir a média setorial</li>
                      <li>Somar todas as reduções potenciais</li>
                    </ol>

                    <div className="mt-4 p-3 bg-background rounded border">
                      <p className="text-xs font-mono text-muted-foreground">
                        Potencial = Σ (Emissões_empresa - Média_setor) para empresas acima da média
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-purple-500/5 rounded-lg border border-purple-500/20">
                    <Info className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      A média setorial serve como benchmark. Empresas acima da média representam
                      oportunidades de melhoria através de medidas de eficiência, eletrificação,
                      ou adoção de energias renováveis.
                    </p>
                  </div>
                </div>

                {/* Níveis de Potencial */}
                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold">Classificação do Nível de Potencial</h3>
                  <p className="text-sm text-muted-foreground">
                    O nível de potencial é determinado pela percentagem de redução possível face às emissões atuais:
                  </p>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 rounded-lg bg-danger/10 border border-danger/20">
                      <p className="font-semibold text-danger">Alto</p>
                      <p className="text-sm text-muted-foreground mt-1">Redução &gt; 20%</p>
                    </div>
                    <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                      <p className="font-semibold text-warning">Médio</p>
                      <p className="text-sm text-muted-foreground mt-1">Redução 10-20%</p>
                    </div>
                    <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                      <p className="font-semibold text-success">Baixo</p>
                      <p className="text-sm text-muted-foreground mt-1">Redução ≤ 10%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Cálculo de Emissões */}
          <TabsContent value="emissoes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Factory className="h-5 w-5 text-primary" />
                  Cálculo de Emissões
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  As emissões de gases com efeito de estufa (GEE) são calculadas seguindo o
                  GHG Protocol, a metodologia internacional mais utilizada.
                </p>

                {/* Scopes */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Âmbitos de Emissões (Scopes)</h3>

                  <div className="grid gap-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-red-500">Scope 1</Badge>
                        <span className="font-medium">Emissões Diretas</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Emissões de fontes que a empresa possui ou controla diretamente
                        (ex: combustão em caldeiras, veículos da frota própria, processos industriais).
                      </p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-orange-500">Scope 2</Badge>
                        <span className="font-medium">Emissões Indiretas - Energia</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Emissões associadas à produção da energia elétrica e térmica adquirida
                        e consumida pela empresa.
                      </p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-yellow-500 text-yellow-950">Scope 3</Badge>
                        <span className="font-medium">Outras Emissões Indiretas</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Todas as outras emissões indiretas na cadeia de valor
                        (ex: deslocações de colaboradores, transporte de mercadorias, resíduos).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm font-medium mb-2">Fórmula de Cálculo Total:</p>
                  <div className="p-3 bg-background rounded border">
                    <p className="text-xs font-mono text-muted-foreground">
                      Emissões Totais (t CO₂e) = Scope 1 + Scope 2 + Scope 3
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Indicadores */}
          <TabsContent value="indicadores" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Indicadores de Intensidade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  Os indicadores de intensidade permitem comparar empresas de diferentes dimensões,
                  normalizando as emissões por diferentes métricas de atividade.
                </p>

                <div className="grid gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Emissões por Faturação</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Mede a eficiência carbónica por unidade de valor económico gerado.
                    </p>
                    <div className="p-3 bg-muted/50 rounded">
                      <p className="text-xs font-mono text-muted-foreground">
                        Intensidade = Emissões Totais (t CO₂e) / Faturação (M€)
                      </p>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Emissões por Colaborador</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Mede a pegada carbónica média por pessoa na organização.
                    </p>
                    <div className="p-3 bg-muted/50 rounded">
                      <p className="text-xs font-mono text-muted-foreground">
                        Intensidade = Emissões Totais (t CO₂e) / Nº Colaboradores
                      </p>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Emissões por Área</h4>
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
