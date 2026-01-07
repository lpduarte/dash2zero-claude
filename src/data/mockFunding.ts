import type { FundingSource, MeasureCategory } from '@/types/actionPlan';

export const mockFunding: FundingSource[] = [
  // === SUBSÍDIOS ===
  {
    id: 'fund-001',
    type: 'subsidio',
    name: 'Fundo Ambiental - Descarbonização',
    provider: 'Ministério do Ambiente',
    description: 'Apoio a projetos de redução de emissões em PME',
    maxAmount: 50000,
    percentage: 50,
    deadline: '2026-06-30',
    requirements: ['PME', 'Sede em Portugal', 'Certificação energética'],
    applicableTo: {
      measureCategories: ['energia', 'mobilidade'],
      maxCompanySize: 'media',
    },
    currentlyOpen: true,
    remainingBudget: 320000,
  },
  {
    id: 'fund-002',
    type: 'subsidio',
    name: 'Cascais Sustentável',
    provider: 'Câmara Municipal de Cascais',
    description: 'Programa municipal de apoio à transição energética',
    maxAmount: 15000,
    percentage: 60,
    deadline: '2026-12-31',
    requirements: ['Sede no concelho', 'Mínimo 2 anos actividade'],
    applicableTo: {
      measureCategories: ['energia', 'residuos', 'agua'],
      maxCompanySize: 'pequena',
    },
    currentlyOpen: true,
    remainingBudget: 85000,
  },
  {
    id: 'fund-003',
    type: 'subsidio',
    name: 'PRR - Descarbonização da Indústria',
    provider: 'Plano de Recuperação e Resiliência',
    description: 'Apoio a investimentos em eficiência energética e energias renováveis',
    maxAmount: 100000,
    percentage: 40,
    deadline: '2026-03-31',
    requirements: ['Projeto aprovado', 'Compromisso de redução de 30% emissões'],
    applicableTo: {
      measureCategories: ['energia', 'mobilidade'],
      sectors: ['Indústria', 'Serviços'],
    },
    currentlyOpen: true,
    remainingBudget: 1500000,
  },
  {
    id: 'fund-004',
    type: 'subsidio',
    name: 'Portugal 2030 - Economia Verde',
    provider: 'Portugal 2030',
    description: 'Financiamento para transição para economia de baixo carbono',
    maxAmount: 75000,
    percentage: 45,
    deadline: '2026-09-30',
    requirements: ['PME', 'Plano de descarbonização'],
    applicableTo: {
      measureCategories: ['energia', 'mobilidade', 'residuos'],
      maxCompanySize: 'media',
    },
    currentlyOpen: true,
    remainingBudget: 2000000,
  },
  
  // === INCENTIVOS ===
  {
    id: 'fund-005',
    type: 'incentivo',
    name: 'Incentivo à Mobilidade Elétrica',
    provider: 'Fundo Ambiental',
    description: 'Apoio à aquisição de veículos elétricos para empresas',
    maxAmount: 20000,
    percentage: 30,
    deadline: 'Contínuo',
    requirements: ['Aquisição de veículo elétrico novo', 'Abate de veículo antigo'],
    applicableTo: {
      measureCategories: ['mobilidade'],
    },
    currentlyOpen: true,
    remainingBudget: 450000,
  },
  {
    id: 'fund-006',
    type: 'incentivo',
    name: 'Incentivo Solar Empresas',
    provider: 'DGEG',
    description: 'Dedução fiscal para instalação de painéis solares',
    maxAmount: 30000,
    percentage: 25,
    deadline: 'Contínuo',
    requirements: ['Instalação certificada', 'Potência mínima 5kWp'],
    applicableTo: {
      measureCategories: ['energia'],
    },
    currentlyOpen: true,
  },
  {
    id: 'fund-007',
    type: 'incentivo',
    name: 'Vale Eficiência Energética',
    provider: 'ADENE',
    description: 'Voucher para auditorias e pequenas intervenções de eficiência',
    maxAmount: 5000,
    percentage: 75,
    deadline: '2026-12-31',
    requirements: ['PME', 'Primeira candidatura'],
    applicableTo: {
      measureCategories: ['energia'],
      maxCompanySize: 'pequena',
    },
    currentlyOpen: true,
    remainingBudget: 150000,
  },
  
  // === FINANCIAMENTO ===
  {
    id: 'fund-008',
    type: 'financiamento',
    name: 'Linha BPF Verde',
    provider: 'Banco Português de Fomento',
    description: 'Financiamento a taxa bonificada para projetos de sustentabilidade',
    maxAmount: 500000,
    interestRate: 'Euribor + 1.5%',
    deadline: 'Contínuo',
    requirements: ['Projeto de sustentabilidade aprovado', 'Garantias'],
    applicableTo: {
      measureCategories: ['energia', 'mobilidade', 'residuos', 'agua'],
    },
    currentlyOpen: true,
  },
  {
    id: 'fund-009',
    type: 'financiamento',
    name: 'Crédito Verde CGD',
    provider: 'Caixa Geral de Depósitos',
    description: 'Linha de crédito para investimentos ambientais',
    maxAmount: 250000,
    interestRate: 'Euribor + 2.0%',
    deadline: 'Contínuo',
    requirements: ['Certificação ambiental ou compromisso'],
    applicableTo: {
      measureCategories: ['energia', 'mobilidade', 'residuos'],
    },
    currentlyOpen: true,
  },
  {
    id: 'fund-010',
    type: 'financiamento',
    name: 'Leasing Equipamento Verde',
    provider: 'Millennium BCP',
    description: 'Leasing para equipamentos de eficiência energética',
    maxAmount: 100000,
    interestRate: 'Taxa fixa 4.5%',
    deadline: 'Contínuo',
    requirements: ['Equipamento elegível', 'Análise de crédito'],
    applicableTo: {
      measureCategories: ['energia', 'mobilidade'],
    },
    currentlyOpen: true,
  },
];

/**
 * Helper para obter fundos aplicáveis às medidas selecionadas
 */
export const getApplicableFunding = (
  selectedMeasureCategories: MeasureCategory[],
  companySize: string,
  sector: string
): { fund: FundingSource; eligible: boolean; reason?: string }[] => {
  return mockFunding
    .filter(fund => {
      // Filtrar por categoria de medida
      const hasMatchingCategory = fund.applicableTo.measureCategories?.some(
        cat => selectedMeasureCategories.includes(cat)
      );
      return hasMatchingCategory && fund.currentlyOpen;
    })
    .map(fund => {
      // Verificar elegibilidade
      let eligible = true;
      let reason: string | undefined;
      
      // Verificar tamanho da empresa
      if (fund.applicableTo.maxCompanySize) {
        const sizeOrder = ['micro', 'pequena', 'media', 'grande'];
        const maxIndex = sizeOrder.indexOf(fund.applicableTo.maxCompanySize);
        const companyIndex = sizeOrder.indexOf(companySize);
        if (companyIndex > maxIndex) {
          eligible = false;
          reason = `Apenas para empresas até ${fund.applicableTo.maxCompanySize}`;
        }
      }
      
      // Verificar sector
      if (fund.applicableTo.sectors && !fund.applicableTo.sectors.includes(sector)) {
        eligible = false;
        reason = `Apenas para sectores: ${fund.applicableTo.sectors.join(', ')}`;
      }
      
      return { fund, eligible, reason };
    })
    .sort((a, b) => {
      // Elegíveis primeiro, depois por montante
      if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
      return b.fund.maxAmount - a.fund.maxAmount;
    });
};

/**
 * Calcula fundos elegíveis baseado nas medidas selecionadas (legacy)
 */
export function getEligibleFunding(
  selectedMeasures: { category: MeasureCategory }[],
  companySize: 'micro' | 'pequena' | 'media' | 'grande',
  allFunding: FundingSource[] = mockFunding
): FundingSource[] {
  const measureCategories = [...new Set(selectedMeasures.map(m => m.category))];
  
  return allFunding.filter(fund => {
    // Filtro por estado aberto
    if (fund.currentlyOpen === false) {
      return false;
    }
    
    // Filtro por categoria de medida
    if (fund.applicableTo.measureCategories && 
        fund.applicableTo.measureCategories.length > 0 &&
        !fund.applicableTo.measureCategories.some(cat => 
          measureCategories.includes(cat)
        )) {
      return false;
    }
    
    // Filtro por dimensão máxima da empresa
    if (fund.applicableTo.maxCompanySize) {
      const sizeOrder = ['micro', 'pequena', 'media', 'grande'];
      const maxIndex = sizeOrder.indexOf(fund.applicableTo.maxCompanySize);
      const companyIndex = sizeOrder.indexOf(companySize);
      if (companyIndex > maxIndex) return false;
    }
    
    return true;
  });
}

/**
 * Calcula total de fundos disponíveis por categoria
 */
export function getFundingByCategory(
  allFunding: FundingSource[] = mockFunding
): { category: MeasureCategory; available: number }[] {
  const categories: MeasureCategory[] = ['energia', 'mobilidade', 'residuos', 'agua'];
  
  return categories.map(category => ({
    category,
    available: allFunding
      .filter(f => 
        f.currentlyOpen !== false && 
        (!f.applicableTo.measureCategories || 
         f.applicableTo.measureCategories.includes(category))
      )
      .reduce((sum, f) => sum + (f.remainingBudget || 0), 0)
  }));
}
