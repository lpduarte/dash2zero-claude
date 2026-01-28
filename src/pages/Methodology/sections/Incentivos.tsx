import { Mail, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import SectionHeader from "../SectionHeader";

export const Incentivos = () => (
  <>
    <SectionHeader
      id="incentivos"
      title="Incentivos"
      icon={Mail}
      description="Sistema de campanhas e acompanhamento de empresas"
    />

    <div className="space-y-6">
      <p className="text-muted-foreground">
        O módulo de Incentivos permite criar campanhas de email, acompanhar o progresso
        das empresas no funil de onboarding e otimizar as taxas de conversão.
      </p>

      {/* Funil de Onboarding */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Funil de Onboarding (7 Fases)</h3>

        <div className="space-y-2">
          {[
            { num: "1", name: "Por Contactar", desc: "Nunca recebeu email", color: "bg-status-pending" },
            { num: "2", name: "Sem Interação", desc: "Recebeu mas não clicou", color: "bg-status-contacted" },
            { num: "3", name: "Interessada", desc: "Clicou no link", color: "bg-status-interested" },
            { num: "4", name: "Registada/Simple", desc: "Criou conta na plataforma", color: "bg-status-registered" },
            { num: "5", name: "Em Progresso/Simple", desc: "Iniciou cálculo no Simple", color: "bg-status-progress" },
            { num: "6", name: "Em Progresso/Formulário", desc: "Iniciou formulário manual", color: "bg-status-progress" },
            { num: "7", name: "Completo", desc: "Pegada calculada com sucesso", color: "bg-status-complete" },
          ].map((phase) => (
            <div key={phase.num} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
              <Badge className={cn("shrink-0", phase.color)}>{phase.num}</Badge>
              <div className="flex-1">
                <span className="font-bold text-sm">{phase.name}</span>
                <span className="text-muted-foreground text-sm ml-2">— {phase.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Métricas de Campanha */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Métricas de Campanha</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">Métricas de campanha de incentivos</caption>
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-bold">Métrica</th>
                <th className="text-left py-2 pr-4 font-bold">Benchmark</th>
                <th className="text-left py-2 font-bold">Significado</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-2 pr-4 font-bold">Taxa de Conversão</td>
                <td className="py-2 pr-4 text-muted-foreground">—</td>
                <td className="py-2 text-muted-foreground">% que completou cálculo</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-bold">Time to Value</td>
                <td className="py-2 pr-4 text-muted-foreground">~12 dias</td>
                <td className="py-2 text-muted-foreground">Dias até conclusão</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-bold">Open Rate</td>
                <td className="py-2 pr-4 text-muted-foreground">&gt;20%</td>
                <td className="py-2 text-muted-foreground">% emails abertos</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-bold">Click-to-Open (CTOR)</td>
                <td className="py-2 pr-4 text-muted-foreground">&gt;30%</td>
                <td className="py-2 text-muted-foreground">% cliques entre aberturas</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-bold">Bounce Rate</td>
                <td className="py-2 pr-4 text-muted-foreground">&lt;2%</td>
                <td className="py-2 text-muted-foreground">% não entregues</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-bold">Spam Rate</td>
                <td className="py-2 pr-4 text-muted-foreground">&lt;0.1%</td>
                <td className="py-2 text-muted-foreground">% marcados como spam</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Envio Inteligente */}
      <div className="border rounded-lg p-4 space-y-4 bg-success/5 border-success/20">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <h3 className="font-bold">Envio Inteligente</h3>
        </div>

        <p className="text-sm text-muted-foreground">
          O sistema de envio inteligente otimiza automaticamente as campanhas:
        </p>

        <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
          <li>Agrupa empresas por template recomendado</li>
          <li>Associação automática baseada no estado de onboarding</li>
          <li>Otimiza taxa de conversão com base em dados históricos</li>
          <li>Evita saturação de contactos</li>
        </ul>
      </div>

      {/* Métricas de Campanha */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Métricas de Campanha</h3>
        <p className="text-sm text-muted-foreground">
          Cada campanha de incentivos regista as seguintes métricas:
        </p>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="p-3 rounded-lg bg-muted/30">
            <p className="font-bold text-sm">Taxa de Abertura</p>
            <p className="text-xs text-muted-foreground">
              Percentagem de emails abertos sobre o total enviado.
              Benchmark: &gt;25% é considerado bom.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30">
            <p className="font-bold text-sm">Taxa de Conversão</p>
            <p className="text-xs text-muted-foreground">
              Percentagem de empresas que iniciaram o processo de onboarding
              após receberem a campanha.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30">
            <p className="font-bold text-sm">Taxa de Bounce</p>
            <p className="text-xs text-muted-foreground">
              Emails que não foram entregues. Manter abaixo de 5%
              para proteger a reputação do domínio.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30">
            <p className="font-bold text-sm">Taxa de Spam</p>
            <p className="text-xs text-muted-foreground">
              Emails marcados como spam pelos destinatários.
              Crítico: &gt;0.5% representa risco de bloqueio.
            </p>
          </div>
        </div>
      </div>

      {/* Segmentação */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Segmentação de Campanhas</h3>
        <p className="text-sm text-muted-foreground">
          As campanhas podem ser segmentadas por múltiplos critérios:
        </p>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Estado no funil de onboarding (fase 1-7)</li>
          <li>Cluster de pertença</li>
          <li>Sector de actividade</li>
          <li>Dimensão da empresa</li>
          <li>Tempo desde último contacto</li>
        </ul>
      </div>
    </div>
  </>
);
