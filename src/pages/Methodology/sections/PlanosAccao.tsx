import { Target, Building2, Landmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SectionHeader from "../SectionHeader";

export const PlanosAccao = () => (
  <>
    <SectionHeader
      id="planos"
      title="Planos de Acção"
      icon={Target}
      description="Definição de objectivos e estratégias de descarbonização"
    />

    <div className="space-y-6">
      <p className="text-muted-foreground">
        Os Planos de Acção permitem definir objectivos concretos de redução de emissões
        e acompanhar o progresso ao longo do tempo, tanto a nível individual como territorial.
      </p>

      {/* Tipos de Planos */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Tipos de Planos</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20 space-y-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-500" />
              <p className="font-bold text-sm">Plano Empresarial</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Plano individual para uma empresa com metas específicas de redução,
              medidas concretas e cronograma de implementação.
            </p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Metas por Scope (1, 2, 3)</li>
              <li>Cronograma com milestones</li>
              <li>Estimativa de investimento</li>
              <li>ROI esperado</li>
            </ul>
          </div>

          <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20 space-y-2">
            <div className="flex items-center gap-2">
              <Landmark className="h-4 w-4 text-purple-500" />
              <p className="font-bold text-sm">Plano Territorial</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Plano para um município ou região com objectivos agregados,
              políticas públicas e incentivos à descarbonização.
            </p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Metas territoriais agregadas</li>
              <li>Políticas públicas de suporte</li>
              <li>Programas de incentivo</li>
              <li>Monitorização de progresso</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Estados do Plano */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Estados do Plano</h3>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
            <Badge className="shrink-0 bg-muted text-muted-foreground">Rascunho</Badge>
            <p className="text-sm text-muted-foreground">
              Em preparação. Pode ser editado livremente antes de ser activado.
            </p>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
            <Badge className="shrink-0 bg-primary">Activo</Badge>
            <p className="text-sm text-muted-foreground">
              Em execução. As medidas estão a ser implementadas e monitorizadas.
            </p>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
            <Badge className="shrink-0 bg-success text-success-foreground">Concluído</Badge>
            <p className="text-sm text-muted-foreground">
              Todas as metas foram atingidas ou o prazo terminou.
            </p>
          </div>
        </div>
      </div>
    </div>
  </>
);
