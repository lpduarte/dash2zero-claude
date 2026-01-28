import { FileSpreadsheet, CheckCircle2, Info } from "lucide-react";
import SectionHeader from "../SectionHeader";

export const DadosRecolher = () => (
  <>
    <SectionHeader
      id="dados"
      title="Dados a Recolher por Empresa"
      icon={FileSpreadsheet}
      description="Informação necessária para cálculo e comparação de emissões"
    />

    <div className="space-y-6">
      <p className="text-muted-foreground">
        Para permitir o cálculo de emissões e a comparação entre empresas, devem ser recolhidos
        os seguintes dados de cada organização:
      </p>

          {/* Dados Obrigatórios */}
          <div className="border rounded-lg p-4 space-y-4 bg-card">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <h3 className="font-bold">Dados Obrigatórios</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">Dados obrigatórios por empresa</caption>
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 font-bold">Campo</th>
                    <th className="text-left py-2 pr-4 font-bold">Descrição</th>
                    <th className="text-left py-2 font-bold">Unidade</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-2 pr-4 font-bold">Identificação</td>
                    <td className="py-2 pr-4 text-muted-foreground">Nome da empresa e NIF</td>
                    <td className="py-2 text-muted-foreground">—</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-bold">Setor de Atividade</td>
                    <td className="py-2 pr-4 text-muted-foreground">Classificação CAE principal</td>
                    <td className="py-2 text-muted-foreground">Código CAE</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-bold">Localização</td>
                    <td className="py-2 pr-4 text-muted-foreground">Distrito, município e freguesia</td>
                    <td className="py-2 text-muted-foreground">—</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-bold">Scope 1</td>
                    <td className="py-2 pr-4 text-muted-foreground">Emissões diretas (combustíveis, processos)</td>
                    <td className="py-2 text-muted-foreground">t CO₂e/ano</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-bold">Scope 2</td>
                    <td className="py-2 pr-4 text-muted-foreground">Emissões indiretas (energia comprada)</td>
                    <td className="py-2 text-muted-foreground">t CO₂e/ano</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-bold">Scope 3</td>
                    <td className="py-2 pr-4 text-muted-foreground">Outras emissões indiretas (cadeia de valor)</td>
                    <td className="py-2 text-muted-foreground">t CO₂e/ano</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-bold">Faturação</td>
                    <td className="py-2 pr-4 text-muted-foreground">Volume de negócios anual</td>
                    <td className="py-2 text-muted-foreground">M€</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-bold">Colaboradores</td>
                    <td className="py-2 pr-4 text-muted-foreground">Número de funcionários (FTE)</td>
                    <td className="py-2 text-muted-foreground">nº</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-bold">Área</td>
                    <td className="py-2 pr-4 text-muted-foreground">Área das instalações</td>
                    <td className="py-2 text-muted-foreground">m²</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Dados Opcionais */}
          <div className="border rounded-lg p-4 space-y-4 bg-card">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-bold">Dados Opcionais (Recomendados)</h3>
            </div>

            <div className="grid gap-2">
              {[
                { field: "Subsetor", desc: "Detalhe do tipo de atividade industrial (se aplicável)" },
                { field: "Certificações", desc: "ISO 14001, ISO 50001, certificações ambientais" },
                { field: "Metas de Redução", desc: "Compromissos de redução de emissões assumidos" },
                { field: "Fonte de Dados", desc: "Origem dos dados de emissões (calculadora, relatório, estimativa)" },
                { field: "Ano de Referência", desc: "Ano a que os dados se referem" },
              ].map((item) => (
                <div key={item.field} className="flex items-start gap-3 p-2 rounded bg-muted/30">
                  <span className="font-bold text-sm shrink-0">{item.field}</span>
                  <span className="text-sm text-muted-foreground">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

      {/* Nota sobre qualidade dos dados */}
      <div className="flex items-start gap-2 p-3 bg-warning/5 rounded-lg border border-warning/20">
        <Info className="h-4 w-4 text-warning mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-bold">Qualidade dos Dados</p>
          <p className="text-sm text-muted-foreground">
            A fiabilidade das análises depende da qualidade dos dados fornecidos. Recomenda-se
            que as empresas utilizem dados verificados ou provenientes de relatórios de sustentabilidade
            auditados sempre que possível.
          </p>
        </div>
      </div>
    </div>
  </>
);
