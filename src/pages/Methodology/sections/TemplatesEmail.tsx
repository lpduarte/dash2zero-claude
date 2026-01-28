import { FileText, Eye, Pencil, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SectionHeader from "../SectionHeader";

export const TemplatesEmail = () => (
  <>
    <SectionHeader
      id="templates"
      title="Templates de Email"
      icon={FileText}
      description="Modelos de email pré-configurados para campanhas"
    />

    <div className="space-y-6">
      <p className="text-muted-foreground">
        A plataforma disponibiliza templates de email optimizados para cada fase
        do funil de onboarding, com personalização automática de conteúdo.
      </p>

      {/* Templates Disponíveis */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Templates Disponíveis</h3>

        <div className="space-y-3">
          {[
            { num: "1", name: "Convite Inicial", desc: "Primeiro contacto. Apresenta a plataforma e convida à participação.", phase: "Por Contactar" },
            { num: "2", name: "Lembrete", desc: "Follow-up para empresas que não responderam ao primeiro contacto.", phase: "Contactada" },
            { num: "3", name: "Benefícios", desc: "Destaca vantagens competitivas da descarbonização e casos de sucesso.", phase: "Contactada" },
            { num: "4", name: "Dados Pendentes", desc: "Solicita o envio de dados em falta para completar a pegada.", phase: "Em Progresso" },
            { num: "5", name: "Resultados", desc: "Partilha os resultados da pegada calculada e próximos passos.", phase: "Calculada" },
          ].map((t) => (
            <div key={t.num} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
              <Badge variant="secondary" className="shrink-0">{t.num}</Badge>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold text-sm">{t.name}</p>
                  <Badge variant="outline" className="text-xs shrink-0">{t.phase}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personalização */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Personalização Automática</h3>
        <p className="text-sm text-muted-foreground">
          Os templates utilizam variáveis dinâmicas que são substituídas automaticamente:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">Variáveis dinâmicas disponíveis nos templates de email</caption>
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-bold">Variável</th>
                <th className="text-left py-2 font-bold">Descrição</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">{"{{empresa}}"}</td>
                <td className="py-2 text-muted-foreground">Nome da empresa</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">{"{{contacto}}"}</td>
                <td className="py-2 text-muted-foreground">Nome do contacto principal</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">{"{{cluster}}"}</td>
                <td className="py-2 text-muted-foreground">Nome do cluster de origem</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-mono text-xs">{"{{link}}"}</td>
                <td className="py-2 text-muted-foreground">Link de acesso ao formulário</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Gestão de Templates */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Gestão de Templates</h3>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
            <Eye className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Pré-visualizar</p>
              <p className="text-xs text-muted-foreground">
                Ver como o email ficará com dados reais antes de enviar.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
            <Pencil className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Editar</p>
              <p className="text-xs text-muted-foreground">
                Personalizar assunto, corpo e variáveis do template.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
            <BarChart3 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Métricas</p>
              <p className="text-xs text-muted-foreground">
                Ver taxas de abertura e conversão por template.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);
