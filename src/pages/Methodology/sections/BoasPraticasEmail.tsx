import { Send, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SectionHeader from "../SectionHeader";

export const BoasPraticasEmail = () => (
  <>
    <SectionHeader
      id="email"
      title="Boas Práticas de Email"
      icon={Send}
      description="Recomendações para campanhas de email efetivas"
    />

    <div className="space-y-6">
      <p className="text-muted-foreground">
        Seguir estas boas práticas maximiza a eficácia das campanhas de email
        e protege a reputação do domínio de envio.
      </p>

      {/* Templates Disponíveis */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Templates Disponíveis</h3>

        <div className="grid gap-3">
          {[
            { num: "1", name: "Convite Inicial", desc: "Primeiro contacto, explica benefícios do cálculo da pegada" },
            { num: "2", name: "Lembrete", desc: "Follow-up amigável para empresas sem interação" },
            { num: "3", name: "Benefícios", desc: "Detalha vantagens competitivas da descarbonização" },
            { num: "4", name: "Urgente", desc: "Foco em requisitos regulamentares e prazos" },
            { num: "5", name: "Personalizado", desc: "Template em branco para mensagens customizadas" },
          ].map((template) => (
            <div key={template.num} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <Badge variant="secondary" className="shrink-0">{template.num}</Badge>
              <div>
                <p className="font-bold text-sm">{template.name}</p>
                <p className="text-xs text-muted-foreground">{template.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gestão de Bounces */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Gestão de Bounces</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">Gestão de bounces de email por tipo</caption>
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-bold">Tipo</th>
                <th className="text-left py-2 pr-4 font-bold">Causa</th>
                <th className="text-left py-2 font-bold">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-2 pr-4">
                  <Badge variant="destructive">Hard Bounce</Badge>
                </td>
                <td className="py-2 pr-4 text-muted-foreground">Email inválido, domínio inexistente</td>
                <td className="py-2 text-muted-foreground">Remover da lista imediatamente</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">
                  <Badge className="bg-warning text-warning-foreground">Soft Bounce</Badge>
                </td>
                <td className="py-2 pr-4 text-muted-foreground">Caixa cheia, servidor temporariamente indisponível</td>
                <td className="py-2 text-muted-foreground">Retry em 24-48h (máx. 3 tentativas)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">
                  <Badge variant="outline">Spam</Badge>
                </td>
                <td className="py-2 pr-4 text-muted-foreground">Marcado como spam pelo destinatário</td>
                <td className="py-2 text-muted-foreground">Remover imediatamente da lista</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Indicadores de Saturação */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-bold">Indicadores de Saturação</h3>
        </div>

        <p className="text-sm text-muted-foreground">
          O sistema indica visualmente o nível de saturação de cada contacto:
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <div className="w-3 h-3 rounded-full bg-gray-400 mx-auto mb-2" />
            <p className="font-bold text-sm">0 emails</p>
            <p className="text-xs text-muted-foreground">Por contactar</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/10 text-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mx-auto mb-2" />
            <p className="font-bold text-sm">1 email</p>
            <p className="text-xs text-muted-foreground">Contactado</p>
          </div>
          <div className="p-3 rounded-lg bg-warning/10 text-center">
            <div className="w-3 h-3 rounded-full bg-warning mx-auto mb-2" />
            <p className="font-bold text-sm">2 emails</p>
            <p className="text-xs text-muted-foreground">Atenção</p>
          </div>
          <div className="p-3 rounded-lg bg-danger/10 text-center">
            <div className="w-3 h-3 rounded-full bg-danger mx-auto mb-2" />
            <p className="font-bold text-sm">3+ emails</p>
            <p className="text-xs text-muted-foreground">Saturado</p>
          </div>
        </div>
      </div>

      {/* Recomendações */}
      <div className="border rounded-lg p-4 space-y-4 bg-primary/5 border-primary/20">
        <h3 className="font-bold">Recomendações</h3>

        <div className="grid gap-3">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">
              <strong>Espaçamento:</strong> Manter ~25 dias entre envios para o mesmo destinatário
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">
              <strong>Bounce rate:</strong> Monitorizar e manter abaixo de 5%
            </p>
          </div>
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-danger mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">
              <strong>Spam rate crítico:</strong> &gt;0.5% representa risco de bloqueio do domínio
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">
              <strong>Envio Inteligente:</strong> Utilizar para otimização automática baseada em dados
            </p>
          </div>
        </div>
      </div>
    </div>
  </>
);
