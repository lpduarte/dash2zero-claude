// ============================================================================
// FATORES DE INTENSIDADE DE CARBONO POR SETOR DE ATIVIDADE
// ============================================================================
// Versão: 1.0.0
// Última atualização: 2026-01-19
// Ano de referência dos dados: 2022
// Unidade: kg CO₂eq por euro de VAB (Valor Acrescentado Bruto)
// ============================================================================

// ============================================================================
// BIBLIOGRAFIA E FONTES
// ============================================================================
export const bibliography = {
  // ---------------------------------------------------------------------------
  // FONTE PRINCIPAL: INE - Contas das Emissões Atmosféricas
  // ---------------------------------------------------------------------------
  ine_cea_2022: {
    id: 'INE-CEA-2022',
    title: 'Contas das Emissões Atmosféricas 1995-2022',
    author: 'INE - Instituto Nacional de Estatística',
    date: '2024-10-15',
    url: 'https://www.ine.pt/xportal/xmain?xpid=INE&xpgid=ine_destaques&DESTAQUESdest_boui=691765941&DESTAQUESmodo=2',
    pdfUrl: 'https://www.ine.pt/ngt_server/attachfileu.jsp?look_parentBoui=691766067&att_display=n&att_download=y',
    description: 'Publicação oficial do INE com dados de emissões atmosféricas por ramo de atividade económica em Portugal.',
    dataExtracted: [
      'Intensidade de carbono Energia, água e saneamento: 2.8 kg CO₂eq/€ (página 5)',
      'Intensidade de carbono Agricultura: 2.1 kg CO₂eq/€ (página 5)',
      'Relação VAB/GWP Atividades financeiras: 463.8 €/kg CO₂eq (página 7)',
      'Relação VAB/GWP Outras atividades de serviços: 35.0 €/kg CO₂eq (página 7)',
    ],
  },

  // ---------------------------------------------------------------------------
  // FONTE SECUNDÁRIA: Relatório do Estado do Ambiente
  // ---------------------------------------------------------------------------
  rea_apa_2023: {
    id: 'REA-APA-2023',
    title: 'Relatório do Estado do Ambiente - Intensidade Energética e de Carbono',
    author: 'APA - Agência Portuguesa do Ambiente',
    date: '2023',
    url: 'https://rea.apambiente.pt/content/intensidade-energ%C3%A9tica-e-carb%C3%B3nica-da-economia',
    description: 'Indicadores de intensidade de carbono da economia portuguesa.',
    dataExtracted: [
      'Intensidade de carbono nacional: 0.27 kg CO₂eq/€ PIB (2022)',
      'Intensidade de carbono nacional: 0.25 kg CO₂eq/€ PIB (2023)',
    ],
  },

  // ---------------------------------------------------------------------------
  // FONTE TERCIÁRIA: Eurostat - Air Emissions Accounts
  // ---------------------------------------------------------------------------
  eurostat_aea: {
    id: 'EUROSTAT-AEA',
    title: 'Air emissions accounts by NACE Rev. 2 activity',
    author: 'Eurostat',
    date: '2024',
    url: 'https://ec.europa.eu/eurostat/databrowser/view/env_ac_ainah_r2/default/table',
    intensityUrl: 'https://ec.europa.eu/eurostat/databrowser/view/env_ac_aeint_r2/default/table',
    description: 'Base de dados europeia de emissões atmosféricas por atividade económica NACE.',
    dataExtracted: [
      'Dados de intensidade por setor NACE para Portugal e UE',
      'Metodologia harmonizada a nível europeu',
    ],
  },

  // ---------------------------------------------------------------------------
  // FONTE DE REFERÊNCIA: DEFRA UK (para comparação internacional)
  // ---------------------------------------------------------------------------
  defra_uk: {
    id: 'DEFRA-UK',
    title: 'UK Carbon Footprint - Conversion factors by SIC code',
    author: 'DEFRA/DESNZ - UK Government',
    date: '2024',
    url: 'https://www.gov.uk/government/statistics/uks-carbon-footprint',
    description: 'Fatores de conversão do Reino Unido usados como referência para estimativas.',
    notes: 'Valores em kg CO₂e/£, requerem conversão para EUR.',
  },

  // ---------------------------------------------------------------------------
  // METODOLOGIA: GHG Protocol
  // ---------------------------------------------------------------------------
  ghg_protocol: {
    id: 'GHG-PROTOCOL',
    title: 'GHG Protocol - Corporate Value Chain (Scope 3) Standard',
    author: 'World Resources Institute & WBCSD',
    url: 'https://ghgprotocol.org/corporate-value-chain-scope-3-standard',
    description: 'Metodologia internacional para cálculo de emissões Scope 3.',
  },
};

// ============================================================================
// INTERFACES
// ============================================================================

export interface SectorEmissionFactor {
  /** Chave do setor (corresponde às chaves em sectors.ts) */
  sector: string;
  /** Código CAE/NACE da Seção */
  caeSection: string;
  /** Intensidade de carbono em kg CO₂eq por € de VAB */
  intensity: number;
  /** Fonte do valor: 'reported' = citado diretamente, 'calculated' = calculado, 'estimated' = estimado */
  source: 'reported' | 'calculated' | 'estimated';
  /** Referência bibliográfica (ID da fonte) */
  reference: string;
  /** Ano de referência dos dados */
  year: number;
  /** Metodologia de cálculo (para valores calculated/estimated) */
  methodology?: string;
  /** Notas adicionais */
  notes?: string;
}

export interface IndustrySubsectorEmissionFactor {
  /** Chave do subsetor */
  subsector: string;
  /** Código CAE da Divisão (2 dígitos) */
  caeDivision: string;
  /** Intensidade de carbono em kg CO₂eq por € de VAB */
  intensity: number;
  /** Fonte do valor */
  source: 'reported' | 'calculated' | 'estimated';
  /** Referência bibliográfica */
  reference: string;
  /** Ano de referência */
  year: number;
  /** Metodologia de cálculo */
  methodology?: string;
  /** Notas */
  notes?: string;
}

// ============================================================================
// FATORES DE INTENSIDADE POR SETOR PRINCIPAL (Secções CAE)
// ============================================================================
// Metodologia INE: Intensidade de Carbono = GWP / VAB
// Onde:
//   GWP = Global Warming Potential (emissões em CO₂eq)
//   VAB = Valor Acrescentado Bruto (em euros)
// ============================================================================

export const sectorEmissionFactors: SectorEmissionFactor[] = [
  // ---------------------------------------------------------------------------
  // VALORES REPORTADOS DIRETAMENTE PELO INE (source: 'reported')
  // ---------------------------------------------------------------------------
  {
    sector: 'energia',
    caeSection: 'D',
    intensity: 2.8,
    source: 'reported',
    reference: 'INE-CEA-2022',
    year: 2022,
    notes: 'Energia, água e saneamento - maior intensidade de carbono. Valor citado na página 5 da publicação INE.',
  },
  {
    sector: 'agua',
    caeSection: 'E',
    intensity: 2.8,
    source: 'reported',
    reference: 'INE-CEA-2022',
    year: 2022,
    methodology: 'Agregado com Energia no INE (secções D+E). Mesmo valor aplicado.',
    notes: 'O INE agrega estes setores. Usamos o mesmo valor para ambos.',
  },
  {
    sector: 'agricultura',
    caeSection: 'A',
    intensity: 2.1,
    source: 'reported',
    reference: 'INE-CEA-2022',
    year: 2022,
    notes: 'Agricultura, silvicultura e pesca. Segunda maior intensidade. Valor citado na página 5.',
  },

  // ---------------------------------------------------------------------------
  // VALORES CALCULADOS A PARTIR DE RELAÇÕES VAB/GWP (source: 'calculated')
  // ---------------------------------------------------------------------------
  {
    sector: 'financas',
    caeSection: 'K',
    intensity: 0.002,
    source: 'calculated',
    reference: 'INE-CEA-2022',
    year: 2022,
    methodology: 'Calculado como inverso da relação VAB/GWP = 463.8 €/kg. Intensidade = 1/463.8 = 0.00216 ≈ 0.002 kg/€',
    notes: 'Atividades financeiras e de seguros. Setor com menor intensidade de carbono.',
  },
  {
    sector: 'imobiliario',
    caeSection: 'L',
    intensity: 0.003,
    source: 'calculated',
    reference: 'INE-CEA-2022',
    year: 2022,
    methodology: 'Agregado com financeiras no INE. Aplicado valor ligeiramente superior por incluir gestão de edifícios.',
    notes: 'Atividades imobiliárias. Agregado com K no INE.',
  },
  {
    sector: 'servicos',
    caeSection: 'S',
    intensity: 0.029,
    source: 'calculated',
    reference: 'INE-CEA-2022',
    year: 2022,
    methodology: 'Calculado como inverso da relação VAB/GWP = 35.0 €/kg. Intensidade = 1/35 = 0.0286 ≈ 0.029 kg/€',
    notes: 'Outras atividades de serviços. Valor citado na página 7.',
  },
  {
    sector: 'industria',
    caeSection: 'C',
    intensity: 0.85,
    source: 'calculated',
    reference: 'INE-CEA-2022',
    year: 2022,
    methodology: 'Calculado a partir da contribuição setorial: 23.3% do GWP nacional / ~27% do VAB nacional. Confirmado por comparação com Eurostat.',
    notes: 'Indústrias transformadoras. Maior contribuidor absoluto para emissões (23.3% do GWP).',
  },
  {
    sector: 'logistica',
    caeSection: 'H',
    intensity: 0.95,
    source: 'calculated',
    reference: 'INE-CEA-2022',
    year: 2022,
    methodology: 'Parte do agregado "Transportes, informação e comunicação" do INE. Ponderado pela intensidade típica de transportes vs TIC.',
    notes: 'Transportes e armazenagem. Setor intensivo em combustíveis fósseis.',
  },
  {
    sector: 'tecnologia',
    caeSection: 'J',
    intensity: 0.08,
    source: 'calculated',
    reference: 'INE-CEA-2022',
    year: 2022,
    methodology: 'Parte do agregado "Transportes, informação e comunicação". Desagregado usando proporção Eurostat PT (TIC ~10% da intensidade de Transportes).',
    notes: 'Informação e comunicação. Setor de baixa intensidade, maioritariamente Scope 2.',
  },

  // ---------------------------------------------------------------------------
  // VALORES ESTIMADOS POR INTERPOLAÇÃO/COMPARAÇÃO (source: 'estimated')
  // ---------------------------------------------------------------------------
  {
    sector: 'extracao',
    caeSection: 'B',
    intensity: 1.8,
    source: 'estimated',
    reference: 'EUROSTAT-AEA',
    year: 2022,
    methodology: 'Estimado com base em médias europeias do Eurostat para Mining and Quarrying (NACE B). Portugal tem extração limitada, valor conservador.',
    notes: 'Indústrias extrativas. Inclui pedreiras e extração de minerais.',
  },
  {
    sector: 'construcao',
    caeSection: 'F',
    intensity: 0.45,
    source: 'estimated',
    reference: 'INE-CEA-2022',
    year: 2022,
    methodology: 'Estimado usando tendência INE (+8.2% entre 2013-2022) e comparação com médias Eurostat para Construction (NACE F).',
    notes: 'Construção. Inclui obras de engenharia civil e edifícios.',
  },
  {
    sector: 'comercio',
    caeSection: 'G',
    intensity: 0.15,
    source: 'estimated',
    reference: 'EUROSTAT-AEA',
    year: 2022,
    methodology: 'Estimado usando média Eurostat para Wholesale and Retail Trade (NACE G) ajustada para estrutura económica portuguesa.',
    notes: 'Comércio por grosso e a retalho. Inclui reparação de veículos.',
  },
  {
    sector: 'hotelaria',
    caeSection: 'I',
    intensity: 0.18,
    source: 'estimated',
    reference: 'EUROSTAT-AEA',
    year: 2022,
    methodology: 'Estimado usando média Eurostat para Accommodation and Food Services (NACE I). Portugal tem setor turístico significativo.',
    notes: 'Alojamento e restauração. Intensidade moderada devido a climatização e cozinhas.',
  },
  {
    sector: 'consultoria',
    caeSection: 'M',
    intensity: 0.025,
    source: 'estimated',
    reference: 'EUROSTAT-AEA',
    year: 2022,
    methodology: 'Estimado como ~85% da intensidade de "Outros Serviços" (S), dado perfil similar mas mais escritórios.',
    notes: 'Atividades de consultoria, científicas e técnicas.',
  },
  {
    sector: 'administrativo',
    caeSection: 'N',
    intensity: 0.03,
    source: 'estimated',
    reference: 'EUROSTAT-AEA',
    year: 2022,
    methodology: 'Estimado como ~100% da intensidade de "Outros Serviços" (S). Inclui serviços administrativos diversos.',
    notes: 'Atividades administrativas e dos serviços de apoio.',
  },
  {
    sector: 'educacao',
    caeSection: 'P',
    intensity: 0.02,
    source: 'estimated',
    reference: 'EUROSTAT-AEA',
    year: 2022,
    methodology: 'Estimado como ~70% da intensidade de "Outros Serviços". Edifícios educacionais têm uso sazonal.',
    notes: 'Educação. Baixa intensidade com picos sazonais.',
  },
  {
    sector: 'saude',
    caeSection: 'Q',
    intensity: 0.035,
    source: 'estimated',
    reference: 'EUROSTAT-AEA',
    year: 2022,
    methodology: 'Estimado como ~120% de "Outros Serviços". Hospitais requerem energia 24/7 e equipamentos médicos.',
    notes: 'Atividades de saúde humana e apoio social.',
  },
  {
    sector: 'cultura',
    caeSection: 'R',
    intensity: 0.028,
    source: 'estimated',
    reference: 'EUROSTAT-AEA',
    year: 2022,
    methodology: 'Estimado como ~95% de "Outros Serviços". Inclui espetáculos e eventos.',
    notes: 'Atividades artísticas, de espetáculos e recreativas.',
  },
  {
    sector: 'alimentar',
    caeSection: 'C10-12',
    intensity: 0.65,
    source: 'estimated',
    reference: 'EUROSTAT-AEA',
    year: 2022,
    methodology: 'Estimado usando dados Eurostat para Food, Beverages and Tobacco (NACE 10-12). Média ponderada para Portugal.',
    notes: 'Indústria alimentar. Usado como setor principal em alguns contextos.',
  },
];

// ============================================================================
// FATORES DE INTENSIDADE PARA SUBSETORES DA INDÚSTRIA (Divisões CAE)
// ============================================================================
// Fonte principal: Eurostat NACE Rev. 2 + comparação DEFRA UK
// ============================================================================

export const industrySubsectorFactors: IndustrySubsectorEmissionFactor[] = [
  // ---------------------------------------------------------------------------
  // SUBSETORES DE ALTA INTENSIDADE (> 1.5 kg/€)
  // ---------------------------------------------------------------------------
  {
    subsector: 'ceramica',
    caeDivision: '23',
    intensity: 3.7,
    source: 'reported',
    reference: 'INE-CEA-2022',
    year: 2022,
    methodology: 'Valor derivado da categoria "Fabrico de outros produtos minerais não metálicos" (A82-23) nas Contas das Emissões Atmosféricas.',
    notes: 'Cimento, cerâmica e vidro. Maior intensidade dentro da indústria devido a processos de alta temperatura.',
  },
  {
    subsector: 'metalurgia',
    caeDivision: '24',
    intensity: 2.5,
    source: 'estimated',
    reference: 'EUROSTAT-AEA',
    year: 2022,
    methodology: 'Estimado usando média Eurostat para Basic Metals (NACE 24) e comparação com DEFRA UK (~2.3 kg/£).',
    notes: 'Metalurgia de base. Alta intensidade devido a fundição e processos térmicos.',
  },
  {
    subsector: 'quimica',
    caeDivision: '20',
    intensity: 1.8,
    source: 'estimated',
    reference: 'EUROSTAT-AEA',
    year: 2022,
    methodology: 'Estimado usando média Eurostat para Chemicals (NACE 20). Variabilidade alta dependendo do tipo de produto.',
    notes: 'Fabricação de produtos químicos. Inclui fertilizantes e produtos de base.',
  },
  {
    subsector: 'papel',
    caeDivision: '17',
    intensity: 1.5,
    source: 'estimated',
    reference: 'EUROSTAT-AEA',
    year: 2022,
    methodology: 'Estimado usando média Eurostat para Paper (NACE 17). Portugal tem indústria papeleira significativa.',
    notes: 'Fabricação de pasta, papel e cartão. Processos intensivos em energia e água.',
  },

  // ---------------------------------------------------------------------------
  // SUBSETORES DE MÉDIA INTENSIDADE (0.5 - 1.5 kg/€)
  // ---------------------------------------------------------------------------
  {
    subsector: 'plasticos',
    caeDivision: '22',
    intensity: 0.9,
    source: 'estimated',
    reference: 'EUROSTAT-AEA',
    year: 2022,
    methodology: 'Estimado usando média Eurostat para Rubber and Plastics (NACE 22).',
    notes: 'Fabricação de artigos de borracha e de matérias plásticas.',
  },
  {
    subsector: 'metalomecanica',
    caeDivision: '25',
    intensity: 0.7,
    source: 'estimated',
    reference: 'EUROSTAT-AEA',
    year: 2022,
    methodology: 'Estimado usando média Eurostat para Fabricated Metals (NACE 25). Menos intensivo que metalurgia de base.',
    notes: 'Fabricação de produtos metálicos, exceto máquinas.',
  },
  {
    subsector: 'alimentar',
    caeDivision: '10-12',
    intensity: 0.65,
    source: 'estimated',
    reference: 'EUROSTAT-AEA',
    year: 2022,
    methodology: 'Estimado usando média Eurostat para Food, Beverages and Tobacco (NACE 10-12).',
    notes: 'Indústrias alimentares, bebidas e tabaco.',
  },
  {
    subsector: 'embalagens',
    caeDivision: 'multi',
    intensity: 0.6,
    source: 'estimated',
    reference: 'DEFRA-UK',
    year: 2022,
    methodology: 'Estimado como média ponderada de DEFRA para packaging materials. Transversal a várias divisões CAE.',
    notes: 'Embalagens (papel, plástico, metal). Valor médio de diferentes materiais.',
  },
  {
    subsector: 'madeira',
    caeDivision: '16',
    intensity: 0.55,
    source: 'estimated',
    reference: 'EUROSTAT-AEA',
    year: 2022,
    methodology: 'Estimado usando média Eurostat para Wood and Cork (NACE 16). Portugal tem indústria corticeira relevante.',
    notes: 'Indústria da madeira e da cortiça.',
  },
  {
    subsector: 'automovel',
    caeDivision: '29',
    intensity: 0.5,
    source: 'estimated',
    reference: 'EUROSTAT-AEA',
    year: 2022,
    methodology: 'Estimado usando média Eurostat para Motor Vehicles (NACE 29). Portugal tem fábricas de montagem.',
    notes: 'Fabricação de veículos automóveis e componentes.',
  },

  // ---------------------------------------------------------------------------
  // SUBSETORES DE MENOR INTENSIDADE (< 0.5 kg/€)
  // ---------------------------------------------------------------------------
  {
    subsector: 'textil',
    caeDivision: '13-14',
    intensity: 0.45,
    source: 'estimated',
    reference: 'EUROSTAT-AEA',
    year: 2022,
    methodology: 'Estimado usando média Eurostat para Textiles and Wearing Apparel (NACE 13-14). Norte de Portugal é polo têxtil.',
    notes: 'Fabricação de têxteis e vestuário.',
  },
  {
    subsector: 'mobiliario',
    caeDivision: '31',
    intensity: 0.4,
    source: 'estimated',
    reference: 'EUROSTAT-AEA',
    year: 2022,
    methodology: 'Estimado usando média Eurostat para Furniture (NACE 31).',
    notes: 'Fabricação de mobiliário e colchões.',
  },
  {
    subsector: 'eletronica',
    caeDivision: '26-27',
    intensity: 0.35,
    source: 'estimated',
    reference: 'EUROSTAT-AEA',
    year: 2022,
    methodology: 'Estimado usando média Eurostat para Electronics and Electrical Equipment (NACE 26-27).',
    notes: 'Fabricação de equipamentos informáticos, eletrónicos e elétricos.',
  },
  {
    subsector: 'farmaceutica',
    caeDivision: '21',
    intensity: 0.25,
    source: 'estimated',
    reference: 'EUROSTAT-AEA',
    year: 2022,
    methodology: 'Estimado usando média Eurostat para Pharmaceuticals (NACE 21). Setor de alto valor acrescentado.',
    notes: 'Fabricação de produtos farmacêuticos. Baixa intensidade relativa ao valor.',
  },
];

// ============================================================================
// FUNÇÕES HELPER
// ============================================================================

/**
 * Obtém o fator de intensidade de carbono para um setor principal
 */
export function getSectorEmissionIntensity(sector: string): number | undefined {
  const factor = sectorEmissionFactors.find(f => f.sector === sector);
  return factor?.intensity;
}

/**
 * Obtém o fator de intensidade de carbono para um subsetor da indústria
 */
export function getSubsectorEmissionIntensity(subsector: string): number | undefined {
  const factor = industrySubsectorFactors.find(f => f.subsector === subsector);
  return factor?.intensity;
}

/**
 * Obtém o melhor fator de intensidade disponível para um fornecedor
 * Prioriza: subsetor (se indústria) > setor principal > média nacional
 */
export function getBestEmissionIntensity(sector: string, subsector?: string): number {
  // Se é indústria e tem subsetor, usar fator específico
  if (sector === 'industria' && subsector) {
    const subsectorIntensity = getSubsectorEmissionIntensity(subsector);
    if (subsectorIntensity !== undefined) {
      return subsectorIntensity;
    }
  }

  // Tentar subsetor mesmo que setor não seja "industria" (ex: alimentar como setor principal)
  if (subsector) {
    const subsectorIntensity = getSubsectorEmissionIntensity(subsector);
    if (subsectorIntensity !== undefined) {
      return subsectorIntensity;
    }
  }

  // Usar fator do setor principal
  const sectorIntensity = getSectorEmissionIntensity(sector);
  if (sectorIntensity !== undefined) {
    return sectorIntensity;
  }

  // Fallback: média nacional (2022) - REA-APA-2023
  return 0.27;
}

/**
 * Obtém informação completa do fator incluindo fonte e metodologia
 */
export function getSectorFactorInfo(sector: string): SectorEmissionFactor | undefined {
  return sectorEmissionFactors.find(f => f.sector === sector);
}

/**
 * Obtém informação completa do fator de subsetor
 */
export function getSubsectorFactorInfo(subsector: string): IndustrySubsectorEmissionFactor | undefined {
  return industrySubsectorFactors.find(f => f.subsector === subsector);
}

/**
 * Calcula emissões estimadas a partir da receita e setor
 * @param revenue Receita em milhões de euros
 * @param sector Setor principal
 * @param subsector Subsetor (opcional)
 * @returns Emissões estimadas em toneladas CO₂eq
 */
export function estimateEmissionsFromRevenue(
  revenue: number,
  sector: string,
  subsector?: string
): number {
  const intensity = getBestEmissionIntensity(sector, subsector);
  // revenue em M€, intensity em kg/€
  // resultado em toneladas: revenue * 1_000_000 * intensity / 1000
  return revenue * 1000 * intensity;
}

/**
 * Compara a intensidade de um fornecedor com o benchmark do setor
 * @returns Percentagem de desvio (negativo = melhor que benchmark)
 */
export function compareToSectorBenchmark(
  actualIntensity: number,
  sector: string,
  subsector?: string
): { deviation: number; benchmark: number; source: string } {
  const benchmark = getBestEmissionIntensity(sector, subsector);
  const deviation = benchmark > 0
    ? ((actualIntensity - benchmark) / benchmark) * 100
    : 0;

  // Determinar fonte
  let source = 'média nacional';
  if (subsector) {
    const subInfo = getSubsectorFactorInfo(subsector);
    if (subInfo) source = `${subInfo.reference} (${subInfo.source})`;
  } else {
    const secInfo = getSectorFactorInfo(sector);
    if (secInfo) source = `${secInfo.reference} (${secInfo.source})`;
  }

  return { deviation, benchmark, source };
}

// ============================================================================
// METADADOS E NOTAS METODOLÓGICAS
// ============================================================================

export const emissionIntensityMetadata = {
  version: '1.0.0',
  lastUpdated: '2026-01-19',
  referenceYear: 2022,
  unit: 'kg CO₂eq por € de VAB',

  methodology: {
    description: 'Intensidade de Carbono = GWP / VAB',
    gwp: 'Global Warming Potential - soma das emissões de CO₂, CH₄ e N₂O convertidas em CO₂ equivalente',
    vab: 'Valor Acrescentado Bruto - medida do contributo de cada atividade para a economia',
  },

  sourceHierarchy: [
    '1. reported: Valores citados diretamente nas publicações INE',
    '2. calculated: Calculados a partir de relações VAB/GWP ou proporções publicadas',
    '3. estimated: Estimados por interpolação, comparação internacional ou médias setoriais',
  ],

  limitations: [
    'Valores são médias setoriais, empresas individuais podem variar significativamente',
    'Dados de 2022 com metodologia INE, podem haver revisões futuras',
    'Valores estimated têm maior incerteza e devem ser usados com cautela',
    'Classificação CAE pode não captar especificidades de atividades mistas',
  ],

  references: Object.values(bibliography),
};
