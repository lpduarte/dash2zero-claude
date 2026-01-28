import { useMemo } from "react";
import { Briefcase, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SectionHeader from "../SectionHeader";
import { sectorLabels } from "@/data/sectors";

// Mapeamento de setor para código CAE
const sectorCAEMapping: Record<string, { code: string; description: string }> = {
  agricultura: { code: 'A', description: 'Agricultura, produção animal, caça, floresta e pesca' },
  extracao: { code: 'B', description: 'Indústrias extrativas' },
  industria: { code: 'C', description: 'Indústrias transformadoras' },
  energia: { code: 'D', description: 'Eletricidade, gás, vapor, água quente e fria' },
  agua: { code: 'E', description: 'Captação, tratamento e distribuição de água' },
  construcao: { code: 'F', description: 'Construção' },
  comercio: { code: 'G', description: 'Comércio por grosso e a retalho' },
  logistica: { code: 'H', description: 'Transporte e armazenagem' },
  hotelaria: { code: 'I', description: 'Alojamento, restauração e similares' },
  tecnologia: { code: 'J', description: 'Informação e comunicação' },
  financas: { code: 'K', description: 'Atividades financeiras e de seguros' },
  imobiliario: { code: 'L', description: 'Atividades imobiliárias' },
  consultoria: { code: 'M', description: 'Atividades de consultoria, científicas e técnicas' },
  administrativo: { code: 'N', description: 'Atividades administrativas' },
  educacao: { code: 'P', description: 'Educação' },
  saude: { code: 'Q', description: 'Atividades de saúde humana e apoio social' },
  cultura: { code: 'R', description: 'Atividades artísticas e recreativas' },
  servicos: { code: 'S', description: 'Outras atividades de serviços' },
};

// Subsetores da indústria
const industrySubsectors: Record<string, { code: string; name: string }> = {
  alimentar: { code: '10-12', name: 'Indústria Alimentar' },
  textil: { code: '13-14', name: 'Têxtil e Vestuário' },
  madeira: { code: '16', name: 'Madeira e Cortiça' },
  papel: { code: '17', name: 'Papel e Cartão' },
  quimica: { code: '20', name: 'Química' },
  farmaceutica: { code: '21', name: 'Farmacêutica' },
  plasticos: { code: '22', name: 'Borracha e Plásticos' },
  ceramica: { code: '23', name: 'Cerâmica e Vidro' },
  metalurgia: { code: '24', name: 'Metalurgia' },
  metalomecanica: { code: '25', name: 'Metalomecânica' },
  eletronica: { code: '26-27', name: 'Eletrónica' },
  automovel: { code: '29', name: 'Automóvel' },
  mobiliario: { code: '31', name: 'Mobiliário' },
};

export const SetoresActividade = () => {
  const sectorEntries = useMemo(() => Object.entries(sectorCAEMapping), []);
  const subsectorEntries = useMemo(() => Object.entries(industrySubsectors), []);

  return (
  <>
    <SectionHeader
      id="setores"
      title="Classificação de Setores"
      icon={Briefcase}
      description="Classificação de atividades económicas segundo a CAE Rev.3"
    />

    <div className="space-y-6">
      <p className="text-muted-foreground">
        Os setores de atividade seguem a <strong>Classificação Portuguesa de Atividades Económicas (CAE Rev.3)</strong>,
        definida pelo INE - Instituto Nacional de Estatística.
      </p>

          {/* Obtenção do Setor */}
          <div className="border rounded-lg p-4 space-y-4 bg-primary/5 border-primary/20">
            <h3 className="font-bold">Como é obtido o Setor de Atividade?</h3>
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                O setor de atividade é obtido automaticamente a partir do <strong>NIF/NIPC</strong> da empresa
                durante o processo de criação de clusters ou onboarding. A informação é consultada
                nos registos oficiais portugueses.
              </p>
              <p className="text-muted-foreground">
                Caso o NIF/NIPC não esteja disponível ou a informação não possa ser obtida automaticamente,
                o utilizador pode indicar manualmente o setor durante o processo de registo.
              </p>
            </div>
          </div>

          {/* CAE Principal vs Secundário */}
          <div className="border rounded-lg p-4 space-y-4 bg-card">
            <h3 className="font-bold">CAE Principal vs CAEs Secundários</h3>
            <p className="text-sm text-muted-foreground">
              Em Portugal, as empresas podem ter múltiplos códigos CAE:
            </p>
            <div className="grid gap-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-success/5 border border-success/20">
                <Badge className="bg-success shrink-0">Principal</Badge>
                <div>
                  <p className="text-sm font-bold">CAE Principal</p>
                  <p className="text-xs text-muted-foreground">
                    A atividade económica principal da empresa, que representa mais de 50% do volume de negócios.
                    <strong> É este o setor utilizado para benchmarking e comparações.</strong>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Badge variant="secondary" className="shrink-0">Secundários</Badge>
                <div>
                  <p className="text-sm font-bold">CAEs Secundários</p>
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
          <div className="border rounded-lg p-4 space-y-4 bg-card">
            <h3 className="font-bold">Setores Principais (Secções CAE)</h3>
            <p className="text-sm text-muted-foreground">
              Os setores principais correspondem às secções da CAE e agrupam
              atividades económicas com características semelhantes.
            </p>

            <div className="grid gap-2">
              {sectorEntries.map(([key, { code, description }]) => (
                <div key={key} className="flex items-start gap-3 p-2 rounded hover:bg-muted/50">
                  <Badge variant="outline" className="font-mono shrink-0">{code}</Badge>
                  <div>
                    <span className="font-bold">{sectorLabels[key] || key}</span>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subsetores da Indústria */}
          <div className="border rounded-lg p-4 space-y-4 bg-card">
            <h3 className="font-bold">Subsetores da Indústria (Divisões CAE - Seção C)</h3>
            <p className="text-sm text-muted-foreground">
              O setor industrial é subdividido em subsetores mais específicos para permitir
              comparações mais precisas entre empresas com atividades semelhantes.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {subsectorEntries.map(([key, { code, name }]) => (
                <div key={key} className="flex items-center gap-2 p-2 rounded bg-muted/30">
                  <Badge variant="secondary" className="font-mono text-xs shrink-0">{code}</Badge>
                  <span className="text-sm">{name}</span>
                </div>
              ))}
            </div>
          </div>
    </div>
  </>
  );
};
