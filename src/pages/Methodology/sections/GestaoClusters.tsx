import {
  Layers, Upload, Users, AlertTriangle, Info,
  Building2, Landmark, Briefcase,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SectionHeader from "../SectionHeader";

export const GestaoClusters = () => (
  <>
    <SectionHeader
      id="clusters"
      title="Gestão de Clusters"
      icon={Layers}
      description="Organização e gestão de grupos de empresas"
    />

    <div className="space-y-6">
      <p className="text-muted-foreground">
        Os clusters permitem organizar empresas em grupos lógicos para facilitar a gestão,
        análise e comunicação. Cada cluster pode representar uma região, setor, programa ou
        qualquer outro critério de agrupamento.
      </p>

      {/* Importação de Empresas */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-primary/10">
            <Upload className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-bold">Importação de Empresas</h3>
        </div>

        <p className="text-sm text-muted-foreground">
          Existem 3 métodos para adicionar empresas a um cluster:
        </p>

        <div className="grid gap-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Badge className="shrink-0">1</Badge>
            <div>
              <p className="font-bold">Importação CSV</p>
              <p className="text-sm text-muted-foreground">
                Carregar um ficheiro CSV com as colunas: Nome, NIF, Email.
                O sistema valida automaticamente o formato e os dados.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Badge className="shrink-0">2</Badge>
            <div>
              <p className="font-bold">Colar Dados</p>
              <p className="text-sm text-muted-foreground">
                Copiar dados de uma folha de cálculo (Excel, Google Sheets) e colar
                directamente na interface. O sistema detecta automaticamente as colunas.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Badge className="shrink-0">3</Badge>
            <div>
              <p className="font-bold">Entrada Manual</p>
              <p className="text-sm text-muted-foreground">
                Adicionar empresas uma a uma através de um formulário.
                Útil para pequenas adições ou correções.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 bg-success/5 rounded-lg border border-success/20">
          <Info className="h-4 w-4 text-success mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground">
            <strong>Segurança:</strong> A importação nunca é destrutiva. Novos dados são
            adicionados ou atualizados, mas nunca eliminados automaticamente.
          </p>
        </div>
      </div>

      {/* Regras de Deduplicação */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-blue-500/10">
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <h3 className="font-bold">Regras de Deduplicação</h3>
        </div>

        <p className="text-sm text-muted-foreground">
          O sistema utiliza o NIF como identificador único universal para evitar duplicações:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">Regras de deduplicação por cenário</caption>
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-bold">Cenário</th>
                <th className="text-left py-2 font-bold">Comportamento</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-2 pr-4">NIF não existe no sistema</td>
                <td className="py-2 text-muted-foreground">Nova empresa é criada e associada ao cluster</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">NIF já existe noutro cluster</td>
                <td className="py-2 text-muted-foreground">Empresa é adicionada ao novo cluster (pertence a ambos)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">NIF já existe no mesmo cluster</td>
                <td className="py-2 text-muted-foreground">Dados são atualizados (nome, email) se diferentes</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex items-start gap-2 p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
          <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground">
            <strong>Multi-cluster:</strong> Uma empresa pode pertencer a múltiplos clusters
            simultaneamente. As contagens são sempre por NIF único, evitando dupla contagem
            nas estatísticas globais.
          </p>
        </div>
      </div>

      {/* Operações de Clusters */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Operações de Clusters</h3>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-success/10 border border-success/30">
            <Badge className="bg-success shrink-0">Criar</Badge>
            <div>
              <p className="text-sm font-bold">Criar Cluster</p>
              <p className="text-xs text-muted-foreground">
                Definir um nome e selecionar um ícone identificativo.
                O cluster fica imediatamente disponível para receber empresas.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <Badge className="bg-blue-500 shrink-0">Mover</Badge>
            <div>
              <p className="text-sm font-bold">Mover Empresas</p>
              <p className="text-xs text-muted-foreground">
                Transferir empresas entre clusters. Opção "manter cópia" permite
                que a empresa permaneça no cluster original e seja adicionada ao destino.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-danger/10 border border-danger/30">
            <Badge variant="destructive" className="shrink-0">Eliminar</Badge>
            <div>
              <p className="text-sm font-bold">Eliminar Cluster</p>
              <p className="text-xs text-muted-foreground">
                Duas opções disponíveis:<br />
                <strong>Opção 1:</strong> Mover todas as empresas para outro cluster antes de eliminar.<br />
                <strong>Opção 2:</strong> Eliminar referências (apenas empresas "órfãs" são removidas do sistema).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Proteção de Dados */}
      <div className="border rounded-lg p-4 space-y-4 bg-warning/5 border-warning/20">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <h3 className="font-bold">Proteção de Dados</h3>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Empresas com pegada calculada são imutáveis:</strong> Não podem ser
            eliminadas nem ter os seus dados de emissões alterados para garantir a
            integridade histórica.
          </p>
          <p>
            <strong>Eliminação de cluster não apaga empresas partilhadas:</strong> Empresas
            que pertencem a múltiplos clusters mantêm-se no sistema através das outras associações.
          </p>
          <p>
            <strong>Apenas empresas "órfãs" são removidas:</strong> Empresas que só pertencem
            ao cluster a ser eliminado são efetivamente removidas do sistema.
          </p>
        </div>
      </div>

      {/* Workflow de Criação */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Workflow de Criação de Cluster</h3>
        <p className="text-sm text-muted-foreground">
          Criar um cluster é o primeiro passo para organizar empresas na plataforma.
        </p>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
            <Badge className="shrink-0 bg-primary">1</Badge>
            <div>
              <p className="font-bold text-sm">Iniciar criação</p>
              <p className="text-xs text-muted-foreground">
                Clicar no botão "Novo Cluster" no topo da página de Clusters.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
            <Badge className="shrink-0 bg-primary">2</Badge>
            <div>
              <p className="font-bold text-sm">Definir identidade</p>
              <p className="text-xs text-muted-foreground">
                Escolher um nome descritivo e seleccionar um ícone identificativo
                (ex: 🏭 para fornecedores industriais).
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
            <Badge className="shrink-0 bg-primary">3</Badge>
            <div>
              <p className="font-bold text-sm">Cluster criado</p>
              <p className="text-xs text-muted-foreground">
                O cluster fica imediatamente disponível para receber empresas
                através de importação CSV, colar dados ou entrada manual.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Validação de Dados */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Validação de Dados na Importação</h3>
        <p className="text-sm text-muted-foreground">
          O sistema valida automaticamente os dados durante a importação:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">Validação de campos na importação</caption>
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-bold">Campo</th>
                <th className="text-left py-2 pr-4 font-bold">Regra</th>
                <th className="text-left py-2 font-bold">Exemplo</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-2 pr-4 font-bold">NIF</td>
                <td className="py-2 pr-4 text-muted-foreground">9 dígitos, check-digit válido</td>
                <td className="py-2 font-mono text-xs">501234567</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-bold">Email</td>
                <td className="py-2 pr-4 text-muted-foreground">Formato válido com @</td>
                <td className="py-2 font-mono text-xs">info@empresa.pt</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-bold">Nome</td>
                <td className="py-2 pr-4 text-muted-foreground">Mínimo 2 caracteres</td>
                <td className="py-2 font-mono text-xs">Empresa, Lda</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex items-start gap-2 p-3 bg-warning/5 rounded-lg border border-warning/20">
          <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground">
            <strong>Linhas inválidas:</strong> São sinalizadas mas não bloqueiam a importação.
            Pode corrigir os dados e reimportar posteriormente.
          </p>
        </div>
      </div>

      {/* Casos de Uso */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Casos de Uso Típicos</h3>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
            <Building2 className="h-5 w-5 text-blue-500 mb-2" />
            <p className="font-bold text-sm">Fornecedores</p>
            <p className="text-xs text-muted-foreground">
              Empresa agrupa os seus fornecedores para análise de Scope 3.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
            <Landmark className="h-5 w-5 text-purple-500 mb-2" />
            <p className="font-bold text-sm">Programa Municipal</p>
            <p className="text-xs text-muted-foreground">
              Município cria cluster para empresas de um programa específico.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <Briefcase className="h-5 w-5 text-muted-foreground mb-2" />
            <p className="font-bold text-sm">Setor Específico</p>
            <p className="text-xs text-muted-foreground">
              Agrupar empresas do mesmo setor para benchmarking dedicado.
            </p>
          </div>
        </div>
      </div>
    </div>
  </>
);
