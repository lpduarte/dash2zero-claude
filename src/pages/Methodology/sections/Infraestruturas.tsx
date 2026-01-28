import {
  Database, Zap, Bus, Route, Wind, Recycle, Bike,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SectionHeader from "../SectionHeader";

export const Infraestruturas = () => (
  <>
    <SectionHeader
      id="infraestruturas"
      title="Infraestruturas Municipais"
      icon={Database}
      description="Dados de infraestruturas públicas para municípios"
    />

    <div className="space-y-6">
      <p className="text-muted-foreground">
        O sistema permite pré-popular dados de infraestruturas municipais através de APIs públicas.
        Quando um novo município é criado, os dados disponíveis são sincronizados automaticamente,
        reduzindo o tempo de configuração inicial.
      </p>

      {/* Sincronização Automática */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Sincronização Automática</h3>
        <p className="text-sm text-muted-foreground">
          Ao criar um cliente do tipo <strong>Município</strong>, o sistema executa automaticamente:
        </p>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Consulta a todas as APIs configuradas</li>
          <li>Filtra dados pelo nome do município</li>
          <li>Armazena os resultados para pré-preenchimento</li>
          <li>Regista a data e estado de cada sincronização</li>
        </ul>
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-primary">
            <strong>Nota:</strong> A sincronização pode ser executada manualmente a qualquer momento
            através da tab "Infraestruturas" no Painel de Controlo.
          </p>
        </div>
      </div>

      {/* Fontes de Dados */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Fontes de Dados Públicas</h3>
        <p className="text-sm text-muted-foreground mb-4">
          As seguintes APIs públicas são utilizadas para obter dados de infraestruturas:
        </p>

        <div className="space-y-4">
          {/* Open Charge Map */}
          <div className="p-4 rounded-lg bg-muted/30 border">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-status-complete/10">
                <Zap className="h-5 w-5 text-status-complete" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold">Postos de Carregamento Elétrico</p>
                  <Badge className="bg-status-complete/10 text-status-complete border-status-complete/20">
                    Disponível
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Fonte:</strong> Open Charge Map (openchargemap.io)
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Base de dados global colaborativa</li>
                  <li>Cobertura: Nacional (Portugal)</li>
                  <li>Dados: localização, operador, conectores, potência</li>
                  <li>Endpoint: <code className="bg-muted px-1 rounded">api.openchargemap.io/v3/poi/</code></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Carris Metropolitana */}
          <div className="p-4 rounded-lg bg-muted/30 border">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Bus className="h-5 w-5 text-warning" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold">Paragens de Transporte Público</p>
                  <Badge className="bg-warning/10 text-warning border-warning/20">
                    Parcial
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Fonte:</strong> Carris Metropolitana API
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Cobertura: Área Metropolitana de Lisboa (18 municípios)</li>
                  <li>Dados: paragens, linhas, rotas</li>
                  <li>Endpoint: <code className="bg-muted px-1 rounded">api.carrismetropolitana.pt/v2/</code></li>
                  <li className="text-warning">Limitação: não cobre restante país</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Ciclovias */}
          <div className="p-4 rounded-lg bg-muted/30 border">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-status-complete/10">
                <Route className="h-5 w-5 text-status-complete" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold">Ciclovias</p>
                  <Badge className="bg-status-complete/10 text-status-complete border-status-complete/20">
                    Disponível
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Fonte:</strong> Ciclovias.pt
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Mapeamento colaborativo de ciclovias</li>
                  <li>Cobertura: Nacional</li>
                  <li>Dados: percursos, extensão, tipo (dedicada/partilhada)</li>
                  <li>Formato: GeoJSON</li>
                </ul>
              </div>
            </div>
          </div>

          {/* QualAr */}
          <div className="p-4 rounded-lg bg-muted/30 border">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Wind className="h-5 w-5 text-warning" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold">Estações de Qualidade do Ar</p>
                  <Badge className="bg-warning/10 text-warning border-warning/20">
                    Parcial
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Fonte:</strong> QualAr - Agência Portuguesa do Ambiente
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Rede nacional de monitorização</li>
                  <li>Dados: estações, poluentes medidos, índice de qualidade</li>
                  <li>Formato: WFS/WMS (serviços geográficos)</li>
                  <li className="text-warning">Requer cliente WFS para integração completa</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Ecopontos */}
          <div className="p-4 rounded-lg bg-muted/30 border">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Recycle className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold">Ecopontos</p>
                  <Badge variant="secondary" className="bg-muted text-muted-foreground">
                    Indisponível
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Fonte:</strong> Dados municipais fragmentados
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Não existe API nacional centralizada</li>
                  <li>Dados disponíveis por município/empresa de resíduos</li>
                  <li>Requer integração manual por região</li>
                  <li className="text-muted-foreground">Exemplos: Valorsul, Lipor, Amarsul (APIs próprias)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bike Sharing */}
          <div className="p-4 rounded-lg bg-muted/30 border">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Bike className="h-5 w-5 text-warning" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold">Bike Sharing</p>
                  <Badge className="bg-warning/10 text-warning border-warning/20">
                    Parcial
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Fonte:</strong> GIRA (Lisboa) / Sistemas municipais
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>GIRA: sistema de bicicletas partilhadas de Lisboa</li>
                  <li>Outros sistemas variam por município</li>
                  <li>Cobertura: Lisboa, Porto, Cascais (principais)</li>
                  <li className="text-warning">Não existe API unificada nacional</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estados de Disponibilidade */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Estados de Disponibilidade</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="p-3 rounded-lg bg-status-complete/5 border border-status-complete/20">
            <Badge className="mb-2 bg-status-complete/10 text-status-complete border-status-complete/20">
              Disponível
            </Badge>
            <p className="text-sm text-muted-foreground">
              API funcional com cobertura nacional. Sincronização automática ativa.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-warning/5 border border-warning/20">
            <Badge className="mb-2 bg-warning/10 text-warning border-warning/20">
              Parcial
            </Badge>
            <p className="text-sm text-muted-foreground">
              API disponível mas com limitações geográficas ou técnicas.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 border border-border">
            <Badge variant="secondary" className="mb-2 bg-muted text-muted-foreground">
              Indisponível
            </Badge>
            <p className="text-sm text-muted-foreground">
              Sem API pública centralizada. Requer configuração manual.
            </p>
          </div>
        </div>
      </div>

      {/* Configuração no Painel de Controlo */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Configuração no Painel de Controlo</h3>
        <p className="text-sm text-muted-foreground">
          A tab "Infraestruturas" no Painel de Controlo permite:
        </p>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Visualizar estado de cada fonte de dados</li>
          <li>Testar conectividade com as APIs</li>
          <li>Executar sincronização manual por API</li>
          <li>Ver última data de sincronização</li>
          <li>Aceder à documentação de cada API</li>
        </ul>
      </div>
    </div>
  </>
);
