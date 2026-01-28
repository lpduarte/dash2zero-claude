import { TrendingDown, Building2, Landmark, Info } from "lucide-react";
import SectionHeader from "../SectionHeader";

export const PotencialMelhoria = () => (
  <>
    <SectionHeader
      id="potencial"
      title="Potencial de Melhoria"
      icon={TrendingDown}
      description="Metodologia para cálculo do potencial de redução de emissões"
    />
    <div className="space-y-6">
      <p className="text-muted-foreground">
        O cálculo do potencial de melhoria é diferenciado consoante o tipo de utilizador,
        refletindo as diferentes estratégias disponíveis para redução de emissões.
      </p>

          {/* Vista Empresa */}
          <div className="border rounded-lg p-4 space-y-4 bg-card">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-blue-500/10">
                <Building2 className="h-4 w-4 text-blue-500" />
              </div>
              <h3 className="font-bold">Vista Empresa: Potencial de Substituição</h3>
            </div>

            <p className="text-sm text-muted-foreground">
              Uma empresa pode otimizar a sua cadeia de valor substituindo fornecedores ou parceiros
              com elevada pegada de carbono por alternativas mais eficientes no mesmo setor.
            </p>

            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <p className="text-sm font-bold">Metodologia:</p>
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
                do mesmo setor, priorizando aqueles com menor intensidade de carbono.
              </p>
            </div>
          </div>

          {/* Vista Município */}
          <div className="border rounded-lg p-4 space-y-4 bg-card">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-purple-500/10">
                <Landmark className="h-4 w-4 text-purple-500" />
              </div>
              <h3 className="font-bold">Vista Município: Potencial de Melhoria Setorial</h3>
            </div>

            <p className="text-sm text-muted-foreground">
              Um município não pode substituir as empresas do seu território. O seu papel é apoiar
              e incentivar as empresas a implementarem medidas de redução de emissões.
            </p>

            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <p className="text-sm font-bold">Metodologia:</p>
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
          <div className="border rounded-lg p-4 space-y-4 bg-card">
            <h3 className="font-bold">Classificação do Nível de Potencial</h3>
            <p className="text-sm text-muted-foreground">
              O nível de potencial é determinado pela percentagem de redução possível face às emissões atuais:
            </p>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-danger/10 border border-danger/20">
                <p className="font-bold text-danger">Alto</p>
                <p className="text-sm text-muted-foreground mt-1">Redução &gt; 20%</p>
              </div>
              <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                <p className="font-bold text-warning">Médio</p>
                <p className="text-sm text-muted-foreground mt-1">Redução 10-20%</p>
              </div>
              <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                <p className="font-bold text-success">Baixo</p>
                <p className="text-sm text-muted-foreground mt-1">Redução ≤ 10%</p>
              </div>
            </div>
          </div>
    </div>
  </>
);
