import {
  TowerControl, Eye, Settings, Archive, BarChart3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SectionHeader from "../SectionHeader";

export const PainelControlo = () => (
  <>
    <SectionHeader
      id="admin"
      title="Painel de Controlo"
      icon={TowerControl}
      description="Gestão de clientes, permissões e métricas globais (apenas Get2C)"
    />

    <div className="space-y-6">
      <p className="text-muted-foreground">
        O Painel de Controlo é a área de administração exclusiva para utilizadores Get2C.
        Permite gerir clientes, definir permissões de acesso e monitorizar métricas agregadas
        de toda a plataforma.
      </p>

      {/* Acesso */}
      <div className="border rounded-lg p-4 space-y-3 bg-card">
        <h3 className="font-bold">Acesso</h3>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Disponível apenas para utilizadores do tipo <strong>Get2C</strong></li>
          <li>Acessível via menu "Painel de controlo" no header</li>
          <li>Rota protegida: utilizadores não-Get2C são redirecionados</li>
        </ul>
      </div>

      {/* Gestão de Clientes */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Gestão de Clientes</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="p-3 rounded-lg bg-muted/30">
            <p className="font-bold text-sm">Criar Cliente</p>
            <p className="text-xs text-muted-foreground">Nome, email, tipo (Município/Empresa), logótipo</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30">
            <p className="font-bold text-sm">Editar Cliente</p>
            <p className="text-xs text-muted-foreground">Alterar dados e permissões existentes</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30">
            <p className="font-bold text-sm">Arquivar/Reativar</p>
            <p className="text-xs text-muted-foreground">Ocultar clientes sem eliminar dados</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30">
            <p className="font-bold text-sm">Eliminar</p>
            <p className="text-xs text-muted-foreground">Remover permanentemente (apenas arquivados)</p>
          </div>
        </div>
      </div>

      {/* Perfis de Permissões */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Perfis de Permissões</h3>
        <p className="text-sm text-muted-foreground">
          Três perfis pré-definidos para configuração rápida:
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
            <Badge className="shrink-0 bg-blue-500">1</Badge>
            <div>
              <p className="font-bold">Visualização</p>
              <p className="text-sm text-muted-foreground">
                Apenas consulta. Dashboard completo, clusters e incentivos só leitura, sem pipeline.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <Badge className="shrink-0 bg-amber-500">2</Badge>
            <div>
              <p className="font-bold">Gestão Parcial</p>
              <p className="text-sm text-muted-foreground">
                Pode criar/editar clusters, enviar emails. Não pode eliminar nem gerir templates.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
            <Badge className="shrink-0 bg-green-500">3</Badge>
            <div>
              <p className="font-bold">Gestão Completa</p>
              <p className="text-sm text-muted-foreground">
                Acesso total a todas as funcionalidades, incluindo eliminação e gestão de templates.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Permissões Granulares */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Permissões Granulares</h3>
        <p className="text-sm text-muted-foreground">
          Além dos perfis, cada permissão pode ser configurada individualmente:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">Permissões granulares por módulo</caption>
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-bold">Módulo</th>
                <th className="text-left py-2 font-bold">Permissões Disponíveis</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-2 pr-4 font-bold">Dashboard</td>
                <td className="py-2 text-muted-foreground">Ver KPIs, gráficos, detalhes, usar filtros</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-bold">Clusters</td>
                <td className="py-2 text-muted-foreground">Ver KPIs/lista, criar, editar, eliminar, gerir empresas</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-bold">Incentivos</td>
                <td className="py-2 text-muted-foreground">Ver KPIs/funil/lista, enviar emails, gerir templates</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-bold">Pipeline</td>
                <td className="py-2 text-muted-foreground">Ver, editar</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Métricas Globais */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Métricas Globais</h3>
        <p className="text-sm text-muted-foreground">
          O painel apresenta métricas agregadas de todos os clientes ativos:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-muted/30 text-center">
            <p className="font-bold text-sm">Total Clientes</p>
            <p className="text-xs text-muted-foreground">Municípios + Empresas</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 text-center">
            <p className="font-bold text-sm">Empresas Registadas</p>
            <p className="text-xs text-muted-foreground">Todas as empresas</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 text-center">
            <p className="font-bold text-sm">Taxa de Conversão</p>
            <p className="text-xs text-muted-foreground">% cálculos completos</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 text-center">
            <p className="font-bold text-sm">Por Contactar</p>
            <p className="text-xs text-muted-foreground">Aguardam 1º email</p>
          </div>
        </div>
      </div>

      {/* Visualizações */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Visualizações</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Badge variant="secondary" className="shrink-0">1</Badge>
            <div>
              <p className="font-bold text-sm">Funil Global de Onboarding</p>
              <p className="text-xs text-muted-foreground">
                Visualização ramificada: Por Contactar → Sem Interação → Interessada,
                depois bifurca para Simple e Formulário.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="secondary" className="shrink-0">2</Badge>
            <div>
              <p className="font-bold text-sm">Gráfico de Atividade</p>
              <p className="text-xs text-muted-foreground">
                Pegadas concluídas por semana (últimas 12 semanas) em todos os clientes.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Badge variant="secondary" className="shrink-0">3</Badge>
            <div>
              <p className="font-bold text-sm">Distribuição Simple/Formulário</p>
              <p className="text-xs text-muted-foreground">
                Gráfico circular mostrando proporção de cada tipo de cálculo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de Cliente */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Cards de Cliente</h3>
        <p className="text-sm text-muted-foreground">
          Cada cliente é apresentado num card com:
        </p>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Logótipo, nome e tipo (Município/Empresa)</li>
          <li>Mini-métricas: empresas, conversão, última atividade</li>
          <li>Sparkline de atividade semanal</li>
          <li>Mini-funil de onboarding</li>
          <li>Alertas (bounces de email)</li>
          <li>Acções: Editar, Arquivar, Dashboard</li>
        </ul>
      </div>

      {/* Pesquisa e Filtros */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Pesquisa e Filtros</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <p className="font-bold text-sm mb-2">Pesquisa</p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Por nome do cliente</li>
              <li>Por email de contacto</li>
            </ul>
          </div>
          <div>
            <p className="font-bold text-sm mb-2">Filtros</p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Por tipo: Todos, Municípios, Empresas</li>
              <li>Por estado: Ativos, Arquivados, Todos</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Gestão de Clientes */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Gestão de Clientes</h3>
        <p className="text-sm text-muted-foreground">
          Operações disponíveis para cada cliente na plataforma:
        </p>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
            <Eye className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Visualizar</p>
              <p className="text-xs text-muted-foreground">
                Aceder ao dashboard e dados do cliente como se fosse o próprio utilizador.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
            <Settings className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Configurar</p>
              <p className="text-xs text-muted-foreground">
                Alterar dados do cliente, tipo de conta e permissões de acesso.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
            <Archive className="h-4 w-4 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Arquivar</p>
              <p className="text-xs text-muted-foreground">
                Desactivar temporariamente o acesso sem perder dados históricos.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
            <BarChart3 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Métricas</p>
              <p className="text-xs text-muted-foreground">
                Ver estatísticas de utilização, número de empresas e clusters.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas Globais */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Métricas Globais</h3>
        <p className="text-sm text-muted-foreground">
          O painel apresenta métricas agregadas de toda a plataforma:
        </p>

        <div className="grid gap-2 md:grid-cols-3">
          {[
            "Total de clientes activos",
            "Total de empresas na plataforma",
            "Total de clusters",
            "Pegadas calculadas",
            "Emissões totais agregadas",
            "Taxa média de onboarding",
          ].map((metric) => (
            <div key={metric} className="p-2 rounded bg-muted/30">
              <span className="text-sm">{metric}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);
