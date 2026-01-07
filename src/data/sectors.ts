// Configuração centralizada de setores/atividades
// Usado em toda a aplicação para garantir consistência

// Mapeamento de setores (chave técnica -> nome em português)
export const sectorLabels: Record<string, string> = {
  all: "Todas as atividades",
  technology: "Tecnologia",
  construction: "Construção",
  logistics: "Logística",
  manufacturing: "Indústria",
  food: "Alimentar",
  services: "Serviços",
  energia: "Energia"
};

// Função helper para obter nome do setor em português
export const getSectorName = (sectorKey: string): string => {
  return sectorLabels[sectorKey] || sectorKey;
};

// Função helper para calcular setores com contagem a partir de uma lista de fornecedores
export interface SectorWithCount {
  sector: string;
  name: string;
  count: number;
}

export const getSectorsWithCounts = (suppliers: { sector: string }[]): SectorWithCount[] => {
  const sectorCounts = suppliers.reduce((acc, s) => {
    acc[s.sector] = (acc[s.sector] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(sectorCounts)
    .map(([sector, count]) => ({
      sector,
      name: getSectorName(sector),
      count
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
};
