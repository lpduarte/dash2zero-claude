import { CheckCircle2, Leaf, FileSpreadsheet, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SectionHeader from "../SectionHeader";

export const FluxoOnboarding = () => (
  <>
    <SectionHeader
      id="onboarding"
      title="Fluxo de Onboarding"
      icon={CheckCircle2}
      description="Estados e progressão das empresas no processo de cálculo da pegada"
    />

    <div className="space-y-6">
      <p className="text-muted-foreground">
        O fluxo de onboarding representa o percurso de uma empresa desde o primeiro contacto
        até à conclusão do cálculo da sua pegada de carbono. Existem dois caminhos possíveis:
        via plataforma <strong>Simple</strong> ou via <strong>Formulário</strong> manual.
      </p>

      {/* Diagrama do Fluxo */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Diagrama do Fluxo</h3>
        <div className="p-4 bg-muted/30 rounded-lg overflow-x-auto">
          <pre className="text-xs font-mono text-muted-foreground whitespace-pre">
{`┌─────────────────┐
│  Por contactar  │ ← Empresa ainda não foi contactada
└────────┬────────┘
         ▼
┌─────────────────┐
│  Sem interação  │ ← Email enviado, sem resposta
└────────┬────────┘
         ▼
┌─────────────────┐
│   Interessada   │ ← Clicou no link do email
└────────┬────────┘
         │
         ├───────────────────────────┐
         ▼                           ▼
┌─────────────────┐       ┌─────────────────┐
│    Registada    │       │  Em progresso   │
│    (Simple)     │       │  (Formulário)   │
└────────┬────────┘       └────────┬────────┘
         ▼                         │
┌─────────────────┐                │
│  Em progresso   │                │
│    (Simple)     │                │
└────────┬────────┘                │
         │                         │
         └────────────┬────────────┘
                      ▼
           ┌─────────────────┐
           │    Completo     │ ← Pegada calculada
           │ (Simple/Form.)  │
           └─────────────────┘`}
          </pre>
        </div>
      </div>

      {/* Estados */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Descrição dos Estados</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-status-pending/10 border border-status-pending/30">
            <Badge className="bg-status-pending shrink-0">1</Badge>
            <div>
              <p className="font-bold">Por contactar</p>
              <p className="text-sm text-muted-foreground">
                Estado inicial. A empresa foi adicionada ao cluster mas ainda não recebeu nenhum email de incentivo.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-status-contacted/10 border border-status-contacted/30">
            <Badge className="bg-status-contacted shrink-0">2</Badge>
            <div>
              <p className="font-bold">Sem interação</p>
              <p className="text-sm text-muted-foreground">
                A empresa recebeu pelo menos um email mas não demonstrou interesse (não clicou em nenhum link).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-status-interested/10 border border-status-interested/30">
            <Badge className="bg-status-interested shrink-0">3</Badge>
            <div>
              <p className="font-bold">Interessada</p>
              <p className="text-sm text-muted-foreground">
                A empresa clicou no link do email, demonstrando interesse em calcular a sua pegada de carbono.
                Neste ponto, pode escolher entre o caminho Simple ou Formulário.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-status-registered/10 border border-status-registered/30">
            <Badge className="bg-status-registered shrink-0">4</Badge>
            <div>
              <p className="font-bold">Registada (apenas Simple)</p>
              <p className="text-sm text-muted-foreground">
                A empresa criou uma conta na plataforma Simple. Este estado só existe no caminho Simple.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-status-progress/10 border border-status-progress/30">
            <Badge className="bg-status-progress shrink-0">5</Badge>
            <div>
              <p className="font-bold">Em progresso</p>
              <p className="text-sm text-muted-foreground">
                <strong>Simple:</strong> A empresa iniciou o preenchimento dos dados na plataforma Simple.<br />
                <strong>Formulário:</strong> A empresa iniciou o preenchimento do formulário manual.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-status-complete/10 border border-status-complete/30">
            <Badge className="bg-status-complete shrink-0">6</Badge>
            <div>
              <p className="font-bold">Completo</p>
              <p className="text-sm text-muted-foreground">
                A pegada de carbono foi calculada com sucesso. O estado indica também o caminho utilizado
                (Simple ou Formulário) para referência.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Caminhos */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="border rounded-lg p-4 space-y-3 bg-card">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-primary/10">
              <Leaf className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-bold">Caminho Simple</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Plataforma self-service onde a empresa preenche os dados e obtém o cálculo automaticamente.
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Requer criação de conta</li>
            <li>Cálculo automático</li>
            <li>Resultado imediato</li>
          </ul>
        </div>

        <div className="border rounded-lg p-4 space-y-3 bg-card">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-muted">
              <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
            </div>
            <h3 className="font-bold">Caminho Formulário</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Formulário manual para empresas que preferem submeter dados sem criar conta.
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Não requer registo</li>
            <li>Processamento manual</li>
            <li>Validação pela equipa</li>
          </ul>
        </div>
      </div>

      {/* Nota sobre configuração */}
      <div className="flex items-start gap-2 p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
        <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-bold">Configuração Centralizada</p>
          <p className="text-sm text-muted-foreground">
            A configuração dos estados de onboarding está centralizada em <code className="text-xs bg-muted px-1 py-0.5 rounded">src/config/onboardingStatus.ts</code>.
            Esta configuração é utilizada em toda a aplicação para garantir consistência visual e descritiva.
          </p>
        </div>
      </div>
    </div>
  </>
);
