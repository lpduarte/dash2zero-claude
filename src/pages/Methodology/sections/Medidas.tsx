import { Leaf, Zap, Car, Droplets, Factory } from "lucide-react";
import SectionHeader from "../SectionHeader";

export const Medidas = () => (
  <>
    <SectionHeader
      id="medidas"
      title="Medidas de Descarbonização"
      icon={Leaf}
      description="Catálogo de medidas para redução de emissões"
    />

    <div className="space-y-6">
      <p className="text-muted-foreground">
        A plataforma disponibiliza um catálogo de medidas de descarbonização organizadas
        por categoria, com estimativa de impacto e custo de implementação.
      </p>

      {/* Categorias de Medidas */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Categorias de Medidas</h3>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
            <Zap className="h-5 w-5 text-yellow-500 shrink-0" />
            <div>
              <p className="font-bold text-sm">Energia</p>
              <p className="text-xs text-muted-foreground">
                Eficiência energética, energias renováveis, iluminação LED,
                painéis solares, bombas de calor.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
            <Car className="h-5 w-5 text-blue-500 shrink-0" />
            <div>
              <p className="font-bold text-sm">Mobilidade</p>
              <p className="text-xs text-muted-foreground">
                Frota eléctrica, car sharing, teletrabalho,
                incentivo ao transporte público.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
            <Droplets className="h-5 w-5 text-cyan-500 shrink-0" />
            <div>
              <p className="font-bold text-sm">Água e Resíduos</p>
              <p className="text-xs text-muted-foreground">
                Redução de consumo de água, reciclagem, economia circular,
                compostagem.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
            <Factory className="h-5 w-5 text-orange-500 shrink-0" />
            <div>
              <p className="font-bold text-sm">Processos</p>
              <p className="text-xs text-muted-foreground">
                Optimização de processos produtivos, substituição de matérias-primas,
                digitalização.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Informação por Medida */}
      <div className="border rounded-lg p-4 space-y-4 bg-card">
        <h3 className="font-bold">Informação por Medida</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">Atributos de cada medida de descarbonização</caption>
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-bold">Campo</th>
                <th className="text-left py-2 font-bold">Descrição</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="py-2 pr-4 font-bold">Nome</td>
                <td className="py-2 text-muted-foreground">Designação da medida</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-bold">Categoria</td>
                <td className="py-2 text-muted-foreground">Energia, Mobilidade, Água/Resíduos ou Processos</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-bold">Impacto estimado</td>
                <td className="py-2 text-muted-foreground">Redução esperada em t CO₂e/ano</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-bold">Custo</td>
                <td className="py-2 text-muted-foreground">Investimento estimado em euros</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-bold">Payback</td>
                <td className="py-2 text-muted-foreground">Tempo estimado de retorno do investimento</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-bold">Complexidade</td>
                <td className="py-2 text-muted-foreground">Baixa, Média ou Alta</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </>
);
