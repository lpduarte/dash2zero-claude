import {
  PieChart, BarChart3, Grid3X3, CircleDot, Hexagon,
  TrendingDown, MousePointer, MousePointerClick, Download,
} from "lucide-react";
import SectionHeader from "../SectionHeader";

export const GraficosAnalises = () => (
  <>
    <SectionHeader
      id="graficos"
      title="Gráficos e Análises"
      icon={PieChart}
      description="Visualizações interactivas para análise de emissões"
    />

    <div className="space-y-6">
      <p className="text-muted-foreground">
        A plataforma disponibiliza múltiplos tipos de gráficos para análise visual das emissões,
        acessíveis nos diferentes separadores do Dashboard.
      </p>

      {/* Tipos de Gráficos */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Tipos de Gráficos Disponíveis</h3>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
            <BarChart3 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Gráficos de Barras</p>
              <p className="text-xs text-muted-foreground">
                Comparação de emissões entre empresas, sectores ou regiões.
                Suportam empilhamento por Scope.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
            <PieChart className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Gráficos Circulares</p>
              <p className="text-xs text-muted-foreground">
                Distribuição proporcional de emissões por Scope,
                sector ou categoria de actividade.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
            <Grid3X3 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Heatmaps</p>
              <p className="text-xs text-muted-foreground">
                Matrizes região × sector para identificar concentrações
                de emissões no território.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
            <CircleDot className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Gráficos de Dispersão</p>
              <p className="text-xs text-muted-foreground">
                Correlação entre variáveis como emissões vs. facturação
                ou emissões vs. colaboradores.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
            <Hexagon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Gráficos Radar</p>
              <p className="text-xs text-muted-foreground">
                Perfil multidimensional de empresas comparando múltiplos
                indicadores simultaneamente.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
            <TrendingDown className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Gráficos Pareto</p>
              <p className="text-xs text-muted-foreground">
                Análise 80/20 para identificar as empresas responsáveis
                pela maioria das emissões.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactividade */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Interactividade</h3>
        <p className="text-sm text-muted-foreground">
          Todos os gráficos são interactivos e oferecem:
        </p>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
            <MousePointer className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Hover</p>
              <p className="text-xs text-muted-foreground">
                Tooltips com valores detalhados ao passar o rato.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
            <MousePointerClick className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Click</p>
              <p className="text-xs text-muted-foreground">
                Navegação para detalhe da empresa ou sector clicado.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
            <Download className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Exportar</p>
              <p className="text-xs text-muted-foreground">
                Exportação de dados em formato CSV para análise externa.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas Visuais */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Escalas e Codificação Visual</h3>
        <p className="text-sm text-muted-foreground">
          A plataforma utiliza codificação consistente em todas as visualizações:
        </p>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded bg-success shrink-0" />
            <p className="text-sm"><span className="font-bold">Verde:</span> <span className="text-muted-foreground">Emissões abaixo da média ou potencial baixo</span></p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded bg-warning shrink-0" />
            <p className="text-sm"><span className="font-bold">Amarelo:</span> <span className="text-muted-foreground">Emissões próximas da média ou potencial médio</span></p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded bg-danger shrink-0" />
            <p className="text-sm"><span className="font-bold">Vermelho:</span> <span className="text-muted-foreground">Emissões acima da média ou potencial alto</span></p>
          </div>
        </div>
      </div>
    </div>
  </>
);
