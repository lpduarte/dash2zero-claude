// Lista completa dos 308 municípios de Portugal agrupados por distrito

export interface Municipio {
  nome: string;
  distrito: string;
}

export interface DistritoGroup {
  distrito: string;
  municipios: string[];
}

// Municípios agrupados por distrito
export const municipiosPorDistrito: DistritoGroup[] = [
  {
    distrito: 'Aveiro',
    municipios: [
      'Águeda', 'Albergaria-a-Velha', 'Anadia', 'Arouca', 'Aveiro',
      'Castelo de Paiva', 'Espinho', 'Estarreja', 'Ílhavo', 'Mealhada',
      'Murtosa', 'Oliveira de Azeméis', 'Oliveira do Bairro', 'Ovar',
      'Santa Maria da Feira', 'São João da Madeira', 'Sever do Vouga',
      'Vagos', 'Vale de Cambra'
    ]
  },
  {
    distrito: 'Beja',
    municipios: [
      'Aljustrel', 'Almodôvar', 'Alvito', 'Barrancos', 'Beja', 'Castro Verde',
      'Cuba', 'Ferreira do Alentejo', 'Mértola', 'Moura', 'Odemira',
      'Ourique', 'Serpa', 'Vidigueira'
    ]
  },
  {
    distrito: 'Braga',
    municipios: [
      'Amares', 'Barcelos', 'Braga', 'Cabeceiras de Basto', 'Celorico de Basto',
      'Esposende', 'Fafe', 'Guimarães', 'Póvoa de Lanhoso', 'Terras de Bouro',
      'Vieira do Minho', 'Vila Nova de Famalicão', 'Vila Verde', 'Vizela'
    ]
  },
  {
    distrito: 'Bragança',
    municipios: [
      'Alfândega da Fé', 'Bragança', 'Carrazeda de Ansiães', 'Freixo de Espada à Cinta',
      'Macedo de Cavaleiros', 'Miranda do Douro', 'Mirandela', 'Mogadouro',
      'Torre de Moncorvo', 'Vila Flor', 'Vimioso', 'Vinhais'
    ]
  },
  {
    distrito: 'Castelo Branco',
    municipios: [
      'Belmonte', 'Castelo Branco', 'Covilhã', 'Fundão', 'Idanha-a-Nova',
      'Oleiros', 'Penamacor', 'Proença-a-Nova', 'Sertã', 'Vila de Rei',
      'Vila Velha de Ródão'
    ]
  },
  {
    distrito: 'Coimbra',
    municipios: [
      'Arganil', 'Cantanhede', 'Coimbra', 'Condeixa-a-Nova', 'Figueira da Foz',
      'Góis', 'Lousã', 'Mira', 'Miranda do Corvo', 'Montemor-o-Velho',
      'Oliveira do Hospital', 'Pampilhosa da Serra', 'Penacova', 'Penela',
      'Soure', 'Tábua', 'Vila Nova de Poiares'
    ]
  },
  {
    distrito: 'Évora',
    municipios: [
      'Alandroal', 'Arraiolos', 'Borba', 'Estremoz', 'Évora', 'Montemor-o-Novo',
      'Mora', 'Mourão', 'Portel', 'Redondo', 'Reguengos de Monsaraz',
      'Vendas Novas', 'Viana do Alentejo', 'Vila Viçosa'
    ]
  },
  {
    distrito: 'Faro',
    municipios: [
      'Albufeira', 'Alcoutim', 'Aljezur', 'Castro Marim', 'Faro', 'Lagoa',
      'Lagos', 'Loulé', 'Monchique', 'Olhão', 'Portimão', 'São Brás de Alportel',
      'Silves', 'Tavira', 'Vila do Bispo', 'Vila Real de Santo António'
    ]
  },
  {
    distrito: 'Guarda',
    municipios: [
      'Aguiar da Beira', 'Almeida', 'Celorico da Beira', 'Figueira de Castelo Rodrigo',
      'Fornos de Algodres', 'Gouveia', 'Guarda', 'Manteigas', 'Mêda',
      'Pinhel', 'Sabugal', 'Seia', 'Trancoso', 'Vila Nova de Foz Côa'
    ]
  },
  {
    distrito: 'Leiria',
    municipios: [
      'Alcobaça', 'Alvaiázere', 'Ansião', 'Batalha', 'Bombarral', 'Caldas da Rainha',
      'Castanheira de Pêra', 'Figueiró dos Vinhos', 'Leiria', 'Marinha Grande',
      'Nazaré', 'Óbidos', 'Pedrógão Grande', 'Peniche', 'Pombal', 'Porto de Mós'
    ]
  },
  {
    distrito: 'Lisboa',
    municipios: [
      'Alenquer', 'Amadora', 'Arruda dos Vinhos', 'Azambuja', 'Cadaval',
      'Cascais', 'Lisboa', 'Loures', 'Lourinhã', 'Mafra', 'Odivelas',
      'Oeiras', 'Sintra', 'Sobral de Monte Agraço', 'Torres Vedras',
      'Vila Franca de Xira'
    ]
  },
  {
    distrito: 'Portalegre',
    municipios: [
      'Alter do Chão', 'Arronches', 'Avis', 'Campo Maior', 'Castelo de Vide',
      'Crato', 'Elvas', 'Fronteira', 'Gavião', 'Marvão', 'Monforte',
      'Nisa', 'Ponte de Sor', 'Portalegre', 'Sousel'
    ]
  },
  {
    distrito: 'Porto',
    municipios: [
      'Amarante', 'Baião', 'Felgueiras', 'Gondomar', 'Lousada', 'Maia',
      'Marco de Canaveses', 'Matosinhos', 'Paços de Ferreira', 'Paredes',
      'Penafiel', 'Porto', 'Póvoa de Varzim', 'Santo Tirso', 'Trofa',
      'Valongo', 'Vila do Conde', 'Vila Nova de Gaia'
    ]
  },
  {
    distrito: 'Santarém',
    municipios: [
      'Abrantes', 'Alcanena', 'Almeirim', 'Alpiarça', 'Benavente', 'Cartaxo',
      'Chamusca', 'Constância', 'Coruche', 'Entroncamento', 'Ferreira do Zêzere',
      'Golegã', 'Mação', 'Ourém', 'Rio Maior', 'Salvaterra de Magos',
      'Santarém', 'Sardoal', 'Tomar', 'Torres Novas', 'Vila Nova da Barquinha'
    ]
  },
  {
    distrito: 'Setúbal',
    municipios: [
      'Alcácer do Sal', 'Alcochete', 'Almada', 'Barreiro', 'Grândola',
      'Moita', 'Montijo', 'Palmela', 'Santiago do Cacém', 'Seixal',
      'Sesimbra', 'Setúbal', 'Sines'
    ]
  },
  {
    distrito: 'Viana do Castelo',
    municipios: [
      'Arcos de Valdevez', 'Caminha', 'Melgaço', 'Monção', 'Paredes de Coura',
      'Ponte da Barca', 'Ponte de Lima', 'Valença', 'Viana do Castelo',
      'Vila Nova de Cerveira'
    ]
  },
  {
    distrito: 'Vila Real',
    municipios: [
      'Alijó', 'Boticas', 'Chaves', 'Mesão Frio', 'Mondim de Basto',
      'Montalegre', 'Murça', 'Peso da Régua', 'Ribeira de Pena',
      'Sabrosa', 'Santa Marta de Penaguião', 'Valpaços', 'Vila Pouca de Aguiar',
      'Vila Real'
    ]
  },
  {
    distrito: 'Viseu',
    municipios: [
      'Armamar', 'Carregal do Sal', 'Castro Daire', 'Cinfães', 'Lamego',
      'Mangualde', 'Moimenta da Beira', 'Mortágua', 'Nelas', 'Oliveira de Frades',
      'Penalva do Castelo', 'Penedono', 'Resende', 'Santa Comba Dão',
      'São João da Pesqueira', 'São Pedro do Sul', 'Sátão', 'Sernancelhe',
      'Tabuaço', 'Tarouca', 'Tondela', 'Vila Nova de Paiva', 'Viseu', 'Vouzela'
    ]
  },
  {
    distrito: 'Região Autónoma dos Açores',
    municipios: [
      'Angra do Heroísmo', 'Calheta (Açores)', 'Corvo', 'Horta', 'Lagoa (Açores)',
      'Lajes das Flores', 'Lajes do Pico', 'Madalena', 'Nordeste',
      'Ponta Delgada', 'Povoação', 'Praia da Vitória', 'Ribeira Grande',
      'Santa Cruz da Graciosa', 'Santa Cruz das Flores', 'São Roque do Pico',
      'Velas', 'Vila do Porto', 'Vila Franca do Campo'
    ]
  },
  {
    distrito: 'Região Autónoma da Madeira',
    municipios: [
      'Calheta (Madeira)', 'Câmara de Lobos', 'Funchal', 'Machico',
      'Ponta do Sol', 'Porto Moniz', 'Porto Santo', 'Ribeira Brava',
      'Santa Cruz (Madeira)', 'Santana', 'São Vicente'
    ]
  }
];

// Lista flat de todos os municípios com distrito
export const todosMunicipios: Municipio[] = municipiosPorDistrito.flatMap(
  grupo => grupo.municipios.map(nome => ({
    nome,
    distrito: grupo.distrito
  }))
);

// Lista apenas dos nomes de municípios (para validação rápida)
export const nomesMunicipios: string[] = todosMunicipios.map(m => m.nome);

// Função para verificar se um nome é um município válido
export const isMunicipioValido = (nome: string): boolean => {
  return nomesMunicipios.some(m => m.toLowerCase() === nome.toLowerCase());
};

// Função para obter o distrito de um município
export const getDistritoByMunicipio = (nome: string): string | undefined => {
  const municipio = todosMunicipios.find(m => m.nome.toLowerCase() === nome.toLowerCase());
  return municipio?.distrito;
};

// Função para pesquisar municípios (case-insensitive, partial match)
export const pesquisarMunicipios = (termo: string): Municipio[] => {
  const termoLower = termo.toLowerCase();
  return todosMunicipios.filter(m =>
    m.nome.toLowerCase().includes(termoLower)
  );
};
