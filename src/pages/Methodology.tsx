import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Calculator, Building2, Factory, TrendingDown,
  ArrowRight, Info, BarChart3, Users, Landmark,
  Briefcase, FileSpreadsheet, CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// VERSIONING
// ============================================
const METHODOLOGY_VERSION = {
  major: 1,
  minor: 3,
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="potencial">Potencial de Melhoria</TabsTrigger>
            <TabsTrigger value="emissoes">Cálculo de Emissões</TabsTrigger>
            <TabsTrigger value="indicadores">Indicadores</TabsTrigger>
            <TabsTrigger value="setores">Setores de Atividade</TabsTrigger>
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

          {/* Tab: Setores de Atividade */}
          <TabsContent value="setores" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Classificação de Setores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  Os setores de atividade seguem a <strong>Classificação Portuguesa de Atividades Económicas (CAE Rev.3)</strong>,
                  definida pelo INE - Instituto Nacional de Estatística.
                </p>

                {/* Obtenção do Setor */}
                <div className="border rounded-lg p-4 space-y-4 bg-primary/5 border-primary/20">
                  <h3 className="font-semibold">Como é obtido o Setor de Atividade?</h3>
                  <div className="space-y-3 text-sm">
                    <p className="text-muted-foreground">
                      O setor de atividade é obtido automaticamente a partir do <strong>NIF</strong> da empresa
                      durante o processo de criação de clusters ou onboarding. A informação é consultada
                      nos registos oficiais portugueses.
                    </p>
                    <p className="text-muted-foreground">
                      Caso o NIF não esteja disponível ou a informação não possa ser obtida automaticamente,
                      o utilizador pode indicar manualmente o setor durante o processo de registo.
                    </p>
                  </div>
                </div>

                {/* CAE Principal vs Secundário */}
                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold">CAE Principal vs CAEs Secundários</h3>
                  <p className="text-sm text-muted-foreground">
                    Em Portugal, as empresas podem ter múltiplos códigos CAE:
                  </p>
                  <div className="grid gap-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-success/5 border border-success/20">
                      <Badge className="bg-success shrink-0">Principal</Badge>
                      <div>
                        <p className="text-sm font-medium">CAE Principal</p>
                        <p className="text-xs text-muted-foreground">
                          A atividade económica principal da empresa, que representa mais de 50% do volume de negócios.
                          <strong> É este o setor utilizado para benchmarking e comparações.</strong>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <Badge variant="secondary" className="shrink-0">Secundários</Badge>
                      <div>
                        <p className="text-sm font-medium">CAEs Secundários</p>
                        <p className="text-xs text-muted-foreground">
                          Atividades adicionais da empresa. São guardados para referência mas não são utilizados
                          nas comparações setoriais para manter a consistência das análises.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                    <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      Esta abordagem está alinhada com as práticas estatísticas oficiais do INE e permite
                      comparações consistentes entre empresas do mesmo setor.
                    </p>
                  </div>
                </div>

                {/* Setores Principais */}
                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold">Setores Principais (Secções CAE)</h3>
                  <p className="text-sm text-muted-foreground">
                    Os setores principais correspondem às secções da CAE e agrupam atividades económicas com características semelhantes.
                  </p>

                  <div className="grid gap-2">
                    {[
                      { code: "A", name: "Agricultura", desc: "Agricultura, produção animal, caça, floresta e pesca" },
                      { code: "B", name: "Indústrias Extrativas", desc: "Extração de minérios e recursos naturais" },
                      { code: "C", name: "Indústria", desc: "Indústrias transformadoras (ver subsetores abaixo)" },
                      { code: "D", name: "Energia", desc: "Eletricidade, gás, vapor, água quente e fria" },
                      { code: "E", name: "Água e Saneamento", desc: "Captação, tratamento e distribuição de água; gestão de resíduos" },
                      { code: "F", name: "Construção", desc: "Construção de edifícios e engenharia civil" },
                      { code: "G", name: "Comércio", desc: "Comércio por grosso e a retalho; reparação de veículos" },
                      { code: "H", name: "Logística", desc: "Transporte e armazenagem" },
                      { code: "I", name: "Hotelaria e Restauração", desc: "Alojamento, restauração e similares" },
                      { code: "J", name: "Tecnologia", desc: "Informação e comunicação" },
                      { code: "K", name: "Banca e Seguros", desc: "Atividades financeiras e de seguros" },
                      { code: "M", name: "Consultoria", desc: "Atividades de consultoria, científicas e técnicas" },
                      { code: "S", name: "Outros Serviços", desc: "Outras atividades de serviços" },
                    ].map((sector) => (
                      <div key={sector.code} className="flex items-start gap-3 p-2 rounded hover:bg-muted/50">
                        <Badge variant="outline" className="font-mono shrink-0">{sector.code}</Badge>
                        <div>
                          <span className="font-medium">{sector.name}</span>
                          <p className="text-xs text-muted-foreground">{sector.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subsetores da Indústria */}
                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold">Subsetores da Indústria (Divisões CAE - Secção C)</h3>
                  <p className="text-sm text-muted-foreground">
                    O setor industrial é subdividido em subsetores mais específicos para permitir
                    comparações mais precisas entre empresas com atividades semelhantes.
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      { code: "10-12", name: "Indústria Alimentar" },
                      { code: "13-14", name: "Têxtil e Vestuário" },
                      { code: "17", name: "Papel e Cartão" },
                      { code: "20", name: "Química" },
                      { code: "21", name: "Farmacêutica" },
                      { code: "22", name: "Borracha e Plásticos" },
                      { code: "23", name: "Cerâmica e Vidro" },
                      { code: "24", name: "Metalurgia" },
                      { code: "25", name: "Metalomecânica" },
                      { code: "26-27", name: "Eletrónica" },
                      { code: "29", name: "Automóvel" },
                      { code: "31", name: "Mobiliário" },
                    ].map((sub) => (
                      <div key={sub.code} className="flex items-center gap-2 p-2 rounded bg-muted/30">
                        <Badge variant="secondary" className="font-mono text-xs shrink-0">{sub.code}</Badge>
                        <span className="text-sm">{sub.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fatores de Intensidade Carbónica */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Fatores de Intensidade Carbónica por Setor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  Os fatores de intensidade carbónica permitem comparar empresas do mesmo setor
                  e estimar emissões quando dados reais não estão disponíveis.
                </p>

                {/* Fonte dos Dados */}
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">Fonte dos Dados</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                      <span className="font-medium">Entidade:</span>
                      <span className="text-muted-foreground">INE - Instituto Nacional de Estatística</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                      <span className="font-medium">Publicação:</span>
                      <span className="text-muted-foreground">Contas das Emissões Atmosféricas 1995-2022</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                      <span className="font-medium">Data:</span>
                      <span className="text-muted-foreground">Outubro 2024</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                      <span className="font-medium">Ano referência:</span>
                      <span className="text-muted-foreground">2022</span>
                    </div>
                    <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                      <span className="font-medium">Unidade:</span>
                      <span className="text-muted-foreground">kg CO₂eq por € de VAB</span>
                    </div>
                  </div>
                </div>

                {/* Tabela de Intensidades */}
                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold">Intensidade Carbónica por Setor (2022)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 pr-4 font-medium">Setor</th>
                          <th className="text-right py-2 pr-4 font-medium">Intensidade</th>
                          <th className="text-left py-2 font-medium">Fonte</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {[
                          { name: "Energia e Água", intensity: "2.80", source: "INE" },
                          { name: "Agricultura", intensity: "2.10", source: "INE" },
                          { name: "Indústrias Extrativas", intensity: "1.80", source: "Est." },
                          { name: "Logística/Transportes", intensity: "0.95", source: "Calc." },
                          { name: "Indústria", intensity: "0.85", source: "Calc." },
                          { name: "Construção", intensity: "0.45", source: "Est." },
                          { name: "Hotelaria", intensity: "0.18", source: "Est." },
                          { name: "Comércio", intensity: "0.15", source: "Est." },
                          { name: "Tecnologia", intensity: "0.08", source: "Calc." },
                          { name: "Outros Serviços", intensity: "0.029", source: "Calc." },
                          { name: "Financeiro", intensity: "0.002", source: "Calc." },
                        ].map((row) => (
                          <tr key={row.name}>
                            <td className="py-2 pr-4">{row.name}</td>
                            <td className="py-2 pr-4 text-right font-mono">{row.intensity}</td>
                            <td className="py-2">
                              <Badge variant={row.source === "INE" ? "default" : "outline"} className="text-xs">
                                {row.source}
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
                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold">Intensidade de Subsetores Industriais (Secção C)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      { name: "Cerâmica/Vidro", intensity: "3.70", highlight: true },
                      { name: "Metalurgia", intensity: "2.50", highlight: true },
                      { name: "Química", intensity: "1.80", highlight: false },
                      { name: "Papel/Cartão", intensity: "1.50", highlight: false },
                      { name: "Plásticos", intensity: "0.90", highlight: false },
                      { name: "Metalomecânica", intensity: "0.70", highlight: false },
                      { name: "Alimentar", intensity: "0.65", highlight: false },
                      { name: "Madeira/Cortiça", intensity: "0.55", highlight: false },
                      { name: "Automóvel", intensity: "0.50", highlight: false },
                      { name: "Têxtil", intensity: "0.45", highlight: false },
                      { name: "Mobiliário", intensity: "0.40", highlight: false },
                      { name: "Eletrónica", intensity: "0.35", highlight: false },
                    ].map((sub) => (
                      <div
                        key={sub.name}
                        className={cn(
                          "flex items-center justify-between p-2 rounded",
                          sub.highlight ? "bg-danger/10 border border-danger/30" : "bg-muted/30"
                        )}
                      >
                        <span className="text-sm">{sub.name}</span>
                        <Badge variant={sub.highlight ? "destructive" : "secondary"} className="font-mono text-xs">
                          {sub.intensity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Valores em kg CO₂eq/€. Subsetores a vermelho têm intensidade acima da média industrial.
                  </p>
                </div>

                {/* Nota metodológica */}
                <div className="flex items-start gap-2 p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Sobre a Metodologia</p>
                    <p className="text-xs text-muted-foreground">
                      Os fatores de intensidade são calculados pelo INE como GWP/VAB (Potencial de Aquecimento Global
                      dividido pelo Valor Acrescentado Bruto). Refletem a média de emissões por unidade de valor
                      económico gerado em cada setor da economia portuguesa.
                    </p>
                  </div>
                </div>

                {/* Justificação de Valores */}
                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold">Classificação dos Valores</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-2 rounded bg-success/10 border border-success/30">
                      <Badge className="shrink-0">INE</Badge>
                      <div>
                        <p className="text-sm font-medium">Valores Reportados</p>
                        <p className="text-xs text-muted-foreground">
                          Citados diretamente nas publicações oficiais do INE, páginas 5 e 7 das Contas das Emissões Atmosféricas.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-2 rounded bg-blue-500/10 border border-blue-500/30">
                      <Badge variant="outline" className="shrink-0">Calc.</Badge>
                      <div>
                        <p className="text-sm font-medium">Valores Calculados</p>
                        <p className="text-xs text-muted-foreground">
                          Derivados de relações VAB/GWP publicadas pelo INE. Ex: Financeiro = 1 / 463.8 €/kg = 0.002 kg/€.
                          Confirmados por comparação com dados Eurostat.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-2 rounded bg-warning/10 border border-warning/30">
                      <Badge variant="outline" className="shrink-0">Est.</Badge>
                      <div>
                        <p className="text-sm font-medium">Valores Estimados</p>
                        <p className="text-xs text-muted-foreground">
                          Baseados em médias Eurostat para Portugal, comparação com DEFRA UK, ou interpolação de setores similares.
                          Têm maior incerteza e devem ser usados com cautela.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bibliografia */}
                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold">Bibliografia e Fontes</h3>
                  <div className="space-y-4 text-sm">
                    {/* Fonte Principal */}
                    <div className="space-y-1">
                      <p className="font-medium">[1] INE - Contas das Emissões Atmosféricas 1995-2022</p>
                      <p className="text-muted-foreground text-xs">
                        Instituto Nacional de Estatística. Publicado em 15 de outubro de 2024.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <a
                          href="https://www.ine.pt/xportal/xmain?xpid=INE&xpgid=ine_destaques&DESTAQUESdest_boui=691765941&DESTAQUESmodo=2"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          Página INE →
                        </a>
                        <a
                          href="https://www.ine.pt/ngt_server/attachfileu.jsp?look_parentBoui=691766067&att_display=n&att_download=y"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          PDF Completo →
                        </a>
                      </div>
                    </div>

                    {/* Fonte Secundária */}
                    <div className="space-y-1">
                      <p className="font-medium">[2] APA - Relatório do Estado do Ambiente</p>
                      <p className="text-muted-foreground text-xs">
                        Agência Portuguesa do Ambiente. Indicadores de intensidade energética e carbónica.
                      </p>
                      <a
                        href="https://rea.apambiente.pt/content/intensidade-energ%C3%A9tica-e-carb%C3%B3nica-da-economia"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        Ver indicador →
                      </a>
                    </div>

                    {/* Eurostat */}
                    <div className="space-y-1">
                      <p className="font-medium">[3] Eurostat - Air Emissions Accounts by NACE</p>
                      <p className="text-muted-foreground text-xs">
                        Base de dados europeia harmonizada de emissões por atividade económica.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <a
                          href="https://ec.europa.eu/eurostat/databrowser/view/env_ac_ainah_r2/default/table"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          Emissões por NACE →
                        </a>
                        <a
                          href="https://ec.europa.eu/eurostat/databrowser/view/env_ac_aeint_r2/default/table"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline"
                        >
                          Intensidades →
                        </a>
                      </div>
                    </div>

                    {/* DEFRA */}
                    <div className="space-y-1">
                      <p className="font-medium">[4] DEFRA/DESNZ - UK Carbon Footprint</p>
                      <p className="text-muted-foreground text-xs">
                        Fatores de conversão por código SIC do Reino Unido. Usado para comparação internacional.
                      </p>
                      <a
                        href="https://www.gov.uk/government/statistics/uks-carbon-footprint"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        UK Statistics →
                      </a>
                    </div>

                    {/* GHG Protocol */}
                    <div className="space-y-1">
                      <p className="font-medium">[5] GHG Protocol - Corporate Value Chain Standard</p>
                      <p className="text-muted-foreground text-xs">
                        Metodologia internacional para cálculo de emissões Scope 1, 2 e 3.
                      </p>
                      <a
                        href="https://ghgprotocol.org/corporate-value-chain-scope-3-standard"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        GHG Protocol →
                      </a>
                    </div>
                  </div>
                </div>

                {/* Limitações */}
                <div className="flex items-start gap-2 p-3 bg-warning/5 rounded-lg border border-warning/20">
                  <Info className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Limitações dos Dados</p>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-1 list-disc list-inside">
                      <li>Valores são médias setoriais; empresas individuais podem variar significativamente</li>
                      <li>Dados de 2022 com metodologia INE, podem haver revisões futuras</li>
                      <li>Valores estimados têm maior incerteza e devem ser usados com cautela</li>
                      <li>Classificação CAE pode não captar especificidades de atividades mistas</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dados a Recolher */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                  Dados a Recolher por Empresa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  Para permitir o cálculo de emissões e a comparação entre empresas, devem ser recolhidos
                  os seguintes dados de cada organização:
                </p>

                {/* Dados Obrigatórios */}
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <h3 className="font-semibold">Dados Obrigatórios</h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 pr-4 font-medium">Campo</th>
                          <th className="text-left py-2 pr-4 font-medium">Descrição</th>
                          <th className="text-left py-2 font-medium">Unidade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr>
                          <td className="py-2 pr-4 font-medium">Identificação</td>
                          <td className="py-2 pr-4 text-muted-foreground">Nome da empresa e NIF</td>
                          <td className="py-2 text-muted-foreground">—</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 font-medium">Setor de Atividade</td>
                          <td className="py-2 pr-4 text-muted-foreground">Classificação CAE principal</td>
                          <td className="py-2 text-muted-foreground">Código CAE</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 font-medium">Localização</td>
                          <td className="py-2 pr-4 text-muted-foreground">Distrito, município e freguesia</td>
                          <td className="py-2 text-muted-foreground">—</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 font-medium">Scope 1</td>
                          <td className="py-2 pr-4 text-muted-foreground">Emissões diretas (combustíveis, processos)</td>
                          <td className="py-2 text-muted-foreground">t CO₂e/ano</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 font-medium">Scope 2</td>
                          <td className="py-2 pr-4 text-muted-foreground">Emissões indiretas (energia comprada)</td>
                          <td className="py-2 text-muted-foreground">t CO₂e/ano</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 font-medium">Scope 3</td>
                          <td className="py-2 pr-4 text-muted-foreground">Outras emissões indiretas (cadeia de valor)</td>
                          <td className="py-2 text-muted-foreground">t CO₂e/ano</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 font-medium">Faturação</td>
                          <td className="py-2 pr-4 text-muted-foreground">Volume de negócios anual</td>
                          <td className="py-2 text-muted-foreground">M€</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 font-medium">Colaboradores</td>
                          <td className="py-2 pr-4 text-muted-foreground">Número de funcionários (FTE)</td>
                          <td className="py-2 text-muted-foreground">nº</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-4 font-medium">Área</td>
                          <td className="py-2 pr-4 text-muted-foreground">Área das instalações</td>
                          <td className="py-2 text-muted-foreground">m²</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Dados Opcionais */}
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold">Dados Opcionais (Recomendados)</h3>
                  </div>

                  <div className="grid gap-2">
                    {[
                      { field: "Subsetor", desc: "Detalhe do tipo de atividade industrial (se aplicável)" },
                      { field: "Certificações", desc: "ISO 14001, ISO 50001, certificações ambientais" },
                      { field: "Metas de Redução", desc: "Compromissos de redução de emissões assumidos" },
                      { field: "Fonte de Dados", desc: "Origem dos dados de emissões (calculadora, relatório, estimativa)" },
                      { field: "Ano de Referência", desc: "Ano a que os dados se referem" },
                    ].map((item) => (
                      <div key={item.field} className="flex items-start gap-3 p-2 rounded bg-muted/30">
                        <span className="font-medium text-sm shrink-0">{item.field}</span>
                        <span className="text-sm text-muted-foreground">{item.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nota sobre qualidade dos dados */}
                <div className="flex items-start gap-2 p-3 bg-warning/5 rounded-lg border border-warning/20">
                  <Info className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Qualidade dos Dados</p>
                    <p className="text-sm text-muted-foreground">
                      A fiabilidade das análises depende da qualidade dos dados fornecidos. Recomenda-se
                      que as empresas utilizem dados verificados ou provenientes de relatórios de sustentabilidade
                      auditados sempre que possível.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
