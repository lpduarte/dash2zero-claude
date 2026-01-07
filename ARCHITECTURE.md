# 📐 ARQUITECTURA - Dash2Zero Simple

## Visão Geral

Dashboard de análise de pegadas de carbono para **empresas** e **municípios**.  
Stack: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Recharts

---

## 📁 Estrutura de Ficheiros

```
/src
├── /components
│   ├── /dashboard          # Componentes do dashboard principal
│   ├── /clusters           # Componentes de gestão de clusters
│   └── /ui                 # Componentes shadcn/ui (base)
├── /contexts
│   └── UserContext.tsx     # Contexto de utilizador (empresa/município)
├── /data                   # Dados mock para prototipagem
├── /hooks                  # Custom hooks
├── /lib
│   └── utils.ts            # Utilitários (cn, etc)
├── /pages                  # Páginas/rotas principais
└── /types                  # Definições TypeScript
```

---

## 🧩 Componentes Principais

### Páginas (`/src/pages`)

| Ficheiro | Rota | Descrição |
|----------|------|-----------|
| `Overview.tsx` | `/` | Dashboard principal com KPIs, gráficos e análises |
| `ClusterManagement.tsx` | `/clusters` | Gestão de grupos de fornecedores/clientes/parceiros |
| `NotFound.tsx` | `*` | Página 404 |

### Dashboard (`/src/components/dashboard`)

#### Navegação & Layout
| Componente | Descrição |
|------------|-----------|
| `Header.tsx` | Cabeçalho com navegação e toggle de utilizador |
| `UserTypeToggle.tsx` | Switch empresa ↔ município |
| `WelcomeBanner.tsx` | Banner de boas-vindas contextual |

#### KPIs & Métricas
| Componente | Descrição | Visibilidade |
|------------|-----------|--------------|
| `MetricsOverview.tsx` | KPIs principais de emissões | Todos |
| `GlobalKPIs.tsx` | KPIs globais agregados | Todos |
| `ClusterKPIs.tsx` | KPIs por cluster (fornecedor/cliente/parceiro) | Todos |
| `InfrastructureKPIs.tsx` | KPIs de infraestruturas sustentáveis | **Apenas Município** |

#### Gráficos & Visualizações
| Componente | Descrição |
|------------|-----------|
| `ComparisonChart.tsx` | Gráfico comparativo de emissões (barras empilhadas) |
| `EmissionsBreakdown.tsx` | Breakdown por scope (1, 2, 3) |
| `EmissionsParetoChart.tsx` | Análise Pareto de emissões |
| `TrendsChart.tsx` | Evolução temporal das emissões |
| `ScatterPlot.tsx` | Emissões vs faturação |
| `PerformanceHeatmap.tsx` | Heatmap de performance |
| `RadarComparison.tsx` | Comparação radar multi-dimensional |
| `AverageEmissionsChart.tsx` | Médias de emissões por segmento |

#### Análise de Fornecedores
| Componente | Descrição | Visibilidade |
|------------|-----------|--------------|
| `CriticalSuppliersHighlight.tsx` | Top 5/10 emissores críticos | Adaptado por tipo |
| `TopSuppliersHighlight.tsx` | Top 3 maiores emissores | Todos |
| `TopSuppliersByCAE.tsx` | Ranking por código CAE | Todos |
| `BestWorstSuppliers.tsx` | Melhores vs piores performers | Todos |
| `SupplierCard.tsx` | Card individual de fornecedor | Todos |
| `SupplierDetailsTable.tsx` | Tabela detalhada de fornecedores | Todos |
| `SupplierRecommendations.tsx` | Sugestões de melhoria | **Apenas Empresa** |
| `SupplierSwitchModal.tsx` | Modal de análise de substituição | **Apenas Empresa** |

#### Filtros
| Componente | Descrição |
|------------|-----------|
| `FilterButton.tsx` | Botão compacto "Filtros" |
| `FilterModal.tsx` | Modal de filtros universal |
| `FilterPanel.tsx` | Painel lateral de filtros |
| `AdvancedFilterPanel.tsx` | Filtros avançados (NIF, CAE, etc) |
| `ActiveFiltersDisplay.tsx` | Chips de filtros activos |
| `ClusterSelector.tsx` | Selector de cluster com contagens |

#### Outros
| Componente | Descrição |
|------------|-----------|
| `ActionPlanModal.tsx` | Gerador de planos de acção |
| `ESGScoreCard.tsx` | Score ESG de fornecedor |
| `ExportOptions.tsx` | Opções de exportação (PDF, Excel) |
| `FinancialAnalysis.tsx` | Análise financeira de impacto |
| `SectorBenchmarking.tsx` | Benchmarking sectorial |
| `NotificationBell.tsx` | Sino de notificações |
| `NotificationCenter.tsx` | Centro de notificações |
| `IncentiveEmailDialog.tsx` | Dialog de envio de incentivos |

### Clusters (`/src/components/clusters`)

| Componente | Descrição |
|------------|-----------|
| `ClusterStats.tsx` | Estatísticas de clusters |
| `CreateClusterDialog.tsx` | Dialog de criação de cluster |
| `EmailDialog.tsx` | Dialog de envio de email |
| `ImportDialog.tsx` | Dialog de importação |
| `ProvidersTable.tsx` | Tabela de fornecedores do cluster |

---

## 📊 Modelos de Dados (`/src/types`)

### `supplier.ts`
```typescript
interface Supplier {
  id: string;
  name: string;
  sector: string;
  subsector?: string;
  district: string;      // Distrito (ex: "Porto")
  municipality: string;  // Município (ex: "Cascais")
  parish: string;        // Freguesia
  companySize: 'micro' | 'pequena' | 'media' | 'grande';
  scope1: number;        // t CO₂e
  scope2: number;
  scope3: number;
  totalEmissions: number;
  // ... métricas adicionais
  cluster: 'fornecedor' | 'cliente' | 'parceiro';
}
```

### `user.ts`
```typescript
type UserType = 'empresa' | 'municipio';

interface User {
  id: string;
  name: string;
  email: string;
  userType: UserType;
  municipality?: string;  // Apenas para municípios
  createdAt: Date;
}
```

### `infrastructure.ts`
```typescript
interface InfrastructureData {
  municipality: string;
  chargingStations: number;  // Postos de carregamento
  ecoPoints: number;         // Ecopontos
  bikeStations: number;      // Estações de bicicletas
  organicBins: number;       // Contentores orgânicos
}
```

### `cluster.ts`
```typescript
interface Cluster {
  id: string;
  name: string;
  type: 'fornecedor' | 'cliente' | 'parceiro';
  description?: string;
}
```

---

## 👥 Fluxo de Utilizador

### Empresa (`userType: 'empresa'`)
- Vê **todos** os fornecedores/parceiros
- Pode filtrar por **distrito, município, freguesia**
- Vê **Top 5 Maiores Emissores** (críticos, vermelho)
- Acesso a **sugestões de substituição** de fornecedores
- Foco: **Reduzir emissões da supply chain**

### Município (`userType: 'municipio'`)
- Vê **apenas empresas do seu município** (ex: Cascais)
- Filtros de **distrito/município ocultos** (já está fixo)
- Apenas pode filtrar por **freguesia**
- Vê **Top 10 Empresas para Monitorização** (planeamento, azul)
- Vê **KPIs de Infraestruturas Sustentáveis** (postos, ecopontos, etc)
- **SEM** sugestões de substituição
- Foco: **Apoiar descarbonização local, acesso a fundos**

---

## 🎨 Design System

### Cores Semânticas (usar sempre via Tailwind)
- `primary` / `primary-foreground` - Cor principal
- `secondary` / `secondary-foreground` - Secundária
- `muted` / `muted-foreground` - Elementos subtis
- `destructive` - Alertas/erros
- `accent` - Destaques

### Ícones por Contexto
| Contexto | Ícone |
|----------|-------|
| Empresa | `Building2` |
| Município | `Landmark` (templo) |
| Distrito/Freguesia | `MapPin` |
| Emissões | `Factory`, `Leaf` |

### Padrões de Formatação
```typescript
// Números
value.toLocaleString('pt-PT')

// Emissões
`${emissions.toLocaleString('pt-PT')} t CO₂e`

// Percentagens
`${percentage.toFixed(1)}%`
```

---

## 🔄 Estado da Aplicação

### Context API
- `UserContext` - Tipo de utilizador e dados do user actual

### Estado Local
- Filtros universais (distrito, município, freguesia, dimensão)
- Cluster selecionado
- Sector selecionado

---

## 📦 Dados Mock (`/src/data`)

| Ficheiro | Conteúdo |
|----------|----------|
| `mockSuppliers.ts` | ~50 fornecedores fictícios |
| `mockClusters.ts` | Definições de clusters |
| `mockInfrastructure.ts` | Dados de infraestruturas por município |
| `mockMissingCompanies.ts` | Empresas em falta para importação |
| `sectors.ts` | Lista de sectores e CAEs |

---

## 🚀 Próximas Fases (Planeado)

- **Fase 2.3**: Indicadores de tendência nos KPIs
- **Fase 2.4**: Exportação de relatórios para município
- **Fase 3**: Análises avançadas (scatter plots zonados, mobilidade)
- **Fase 4**: Integração com dados reais (APIs, formulários)
