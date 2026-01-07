import { Cluster, EmailTemplate, ClusterProvider } from "@/types/cluster";
import { mockSuppliers } from "./mockSuppliers";
import { Supplier } from "@/types/supplier";

// Convert Supplier to ClusterProvider format
const supplierToProvider = (supplier: Supplier): ClusterProvider => ({
  id: supplier.id,
  name: supplier.name,
  nif: `50${supplier.id.padStart(7, '0')}`,
  email: supplier.contact.email,
  status: supplier.rating === 'A' || supplier.rating === 'B' ? 'completed' : 
          supplier.rating === 'C' ? 'in-progress' : 'not-registered',
  emailsSent: Math.floor(Math.random() * 5),
  lastContact: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
});

// Group suppliers by cluster type
const suppliersByCluster = mockSuppliers.reduce((acc, supplier) => {
  if (!acc[supplier.cluster]) {
    acc[supplier.cluster] = [];
  }
  acc[supplier.cluster].push(supplier);
  return acc;
}, {} as Record<string, Supplier[]>);

// Create clusters from real supplier data
export const mockClusters: Cluster[] = [
  {
    id: "fornecedor",
    name: "Fornecedores",
    providers: (suppliersByCluster['fornecedor'] || []).map(supplierToProvider),
    createdAt: new Date("2024-12-01"),
  },
  {
    id: "cliente",
    name: "Clientes",
    providers: (suppliersByCluster['cliente'] || []).map(supplierToProvider),
    createdAt: new Date("2024-12-01"),
  },
  {
    id: "parceiro",
    name: "Parceiros",
    providers: (suppliersByCluster['parceiro'] || []).map(supplierToProvider),
    createdAt: new Date("2024-12-01"),
  },
];

export const emailTemplates: EmailTemplate[] = [
  {
    id: "welcome",
    name: "Boas-vindas",
    subject: "Bem-vindo ao dash2zero - Vamos reduzir a pegada de carbono juntos",
    body: `Olá {{nome}},

É com grande satisfação que convidamos a vossa empresa a juntar-se ao dash2zero, a plataforma que está a revolucionar a forma como as empresas monitorizam e reduzem a sua pegada de carbono.

**Porquê o dash2zero?**
• Monitorização em tempo real das emissões de carbono
• Relatórios automáticos e insights acionáveis
• Apoio na definição de metas de redução
• Certificação e reconhecimento de boas práticas

**Próximos passos:**
1. Aceda à plataforma através do link abaixo
2. Complete o seu perfil empresarial
3. Insira os dados iniciais de emissões
4. Comece a monitorizar e melhorar

Em caso de dúvidas, a nossa equipa está disponível para ajudar.

Juntos por um futuro mais sustentável,
Equipa dash2zero`,
    applicableStatus: ["not-registered"],
  },
  {
    id: "reminder",
    name: "Lembrete de Progresso",
    subject: "dash2zero - Continue o seu progresso",
    body: `Olá {{nome}},

Notámos que iniciou o processo de registo no dash2zero, mas ainda há alguns passos por completar.

**O que falta:**
• Completar o perfil da empresa
• Inserir dados de emissões iniciais
• Validar informações de contacto

Lembre-se: quanto mais cedo completar, mais cedo poderá beneficiar de insights valiosos sobre a sua pegada de carbono.

Aceda à plataforma e continue de onde parou.

Contamos com a vossa colaboração,
Equipa dash2zero`,
    applicableStatus: ["in-progress"],
  },
  {
    id: "followup",
    name: "Acompanhamento Regular",
    subject: "dash2zero - Novidades e atualizações",
    body: `Olá {{nome}},

Obrigado por fazer parte da comunidade dash2zero!

**Novidades:**
• Novos relatórios de benchmark setorial disponíveis
• Webinar gratuito sobre estratégias de redução de carbono
• Novas funcionalidades de análise preditiva

Continue a monitorizar as vossas métricas e explore as novas ferramentas disponíveis na plataforma.

Juntos estamos a fazer a diferença,
Equipa dash2zero`,
    applicableStatus: ["completed", "in-progress"],
  },
];
