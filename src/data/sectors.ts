// ============================================================================
// CONFIGURAÇÃO CENTRALIZADA DE SETORES/ATIVIDADES
// ============================================================================
// NOTA: Este software é 100% em Português de Portugal.
// Os setores seguem a Classificação Portuguesa de Atividades Económicas (CAE Rev.3)
// Fonte: INE - Instituto Nacional de Estatística
// ============================================================================

// Mapeamento de setores (chave -> nome em português)
// Inclui tanto chaves em português como em inglês para compatibilidade
export const sectorLabels: Record<string, string> = {
  // Valor especial para filtros
  all: "Todas as atividades",

  // -------------------------------------------------------------------------
  // SETORES PRINCIPAIS (baseados nas Secções CAE)
  // Chaves em português
  // -------------------------------------------------------------------------
  agricultura: "Agricultura",                 // CAE A - Agricultura, produção animal, caça, floresta e pesca
  extracao: "Indústrias Extrativas",          // CAE B - Indústrias extrativas
  industria: "Indústria",                     // CAE C - Indústrias transformadoras
  energia: "Energia",                         // CAE D - Eletricidade, gás, vapor, água quente e fria
  agua: "Água e Saneamento",                  // CAE E - Captação, tratamento e distribuição de água
  construcao: "Construção",                   // CAE F - Construção
  comercio: "Comércio",                       // CAE G - Comércio por grosso e a retalho
  logistica: "Logística",                     // CAE H - Transporte e armazenagem
  hotelaria: "Hotelaria e Restauração",       // CAE I - Alojamento, restauração e similares
  tecnologia: "Tecnologia",                   // CAE J - Informação e Comunicação
  financas: "Banca e Seguros",                // CAE K - Atividades financeiras e de seguros
  imobiliario: "Imobiliário",                 // CAE L - Atividades imobiliárias
  consultoria: "Consultoria",                 // CAE M - Atividades de consultoria, científicas e técnicas
  administrativo: "Serviços Administrativos", // CAE N - Atividades administrativas e dos serviços de apoio
  educacao: "Educação",                       // CAE P - Educação
  saude: "Saúde",                             // CAE Q - Atividades de saúde humana e apoio social
  cultura: "Cultura e Lazer",                 // CAE R - Atividades artísticas, de espetáculos e recreativas
  servicos: "Outros Serviços",                // CAE S - Outras atividades de serviços

  // -------------------------------------------------------------------------
  // ALIASES EM INGLÊS (para compatibilidade com dados legados)
  // -------------------------------------------------------------------------
  agriculture: "Agricultura",
  mining: "Indústrias Extrativas",
  manufacturing: "Indústria",
  energy: "Energia",
  water: "Água e Saneamento",
  construction: "Construção",
  retail: "Comércio",
  trade: "Comércio",
  transport: "Logística",
  logistics: "Logística",
  hospitality: "Hotelaria e Restauração",
  technology: "Tecnologia",
  finance: "Banca e Seguros",
  "real-estate": "Imobiliário",
  consulting: "Consultoria",
  administrative: "Serviços Administrativos",
  education: "Educação",
  health: "Saúde",
  healthcare: "Saúde",
  entertainment: "Cultura e Lazer",
  services: "Outros Serviços",

  // -------------------------------------------------------------------------
  // SUBSETORES DA INDÚSTRIA (Divisões CAE dentro da Seção C)
  // Usados no campo 'subsector' para detalhe adicional
  // -------------------------------------------------------------------------
  alimentar: "Indústria Alimentar",           // CAE 10-12
  textil: "Têxtil e Vestuário",               // CAE 13-14
  madeira: "Madeira e Cortiça",               // CAE 16
  papel: "Papel e Cartão",                    // CAE 17
  quimica: "Química",                         // CAE 20
  farmaceutica: "Farmacêutica",               // CAE 21
  plasticos: "Borracha e Plásticos",          // CAE 22
  ceramica: "Cerâmica e Vidro",               // CAE 23
  metalurgia: "Metalurgia",                   // CAE 24
  metalomecanica: "Metalomecânica",           // CAE 25
  eletronica: "Eletrónica",                   // CAE 26-27
  automovel: "Automóvel",                     // CAE 29
  mobiliario: "Mobiliário",                   // CAE 31
  embalagens: "Embalagens",                   // Transversal

  // -------------------------------------------------------------------------
  // SUBSETORES DE SERVIÇOS E OUTROS
  // -------------------------------------------------------------------------
  restauracao: "Restauração",
  retalho: "Retalho",
  turismo: "Turismo",
  legal: "Serviços Jurídicos",
  contabilidade: "Contabilidade",
  marketing: "Marketing",
  design: "Design",
  seguranca: "Segurança",
  limpeza: "Limpeza",
  formacao: "Formação",
  traducao: "Tradução",
  arquitetura: "Arquitetura",
  rh: "Recursos Humanos",
  eventos: "Eventos",
  grafica: "Artes Gráficas",
  fotografia: "Fotografia",
  catering: "Catering",
  eletricidade: "Eletricidade",
  jardinagem: "Jardinagem",
  manutencao: "Manutenção",
  mobilidade: "Mobilidade",
  veterinario: "Veterinário",
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
