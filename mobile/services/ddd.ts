export interface DDDOption {
  label: string;
  value: string;
}

const brazilDDDs: DDDOption[] = [
  { label: '11 - São Paulo (Capital e Região Metropolitana)', value: '11' },
  { label: '12 - São José dos Campos e Vale do Paraíba', value: '12' },
  { label: '13 - Santos e Baixada Santista', value: '13' },
  { label: '14 - Bauru, Marília e Jaú', value: '14' },
  { label: '15 - Sorocaba e Itapetininga', value: '15' },
  { label: '16 - Ribeirão Preto, Franca e Araraquara', value: '16' },
  { label: '17 - São José do Rio Preto e Barretos', value: '17' },
  { label: '18 - Presidente Prudente e Araçatuba', value: '18' },
  { label: '19 - Campinas, Piracicaba e Rio Claro', value: '19' },
  { label: '21 - Rio de Janeiro (Capital e Região Metropolitana)', value: '21' },
  { label: '22 - Campos dos Goytacazes e Região dos Lagos', value: '22' },
  { label: '24 - Petrópolis, Volta Redonda e Angra dos Reis', value: '24' },
  { label: '27 - Vitória (Capital e Região Metropolitana)', value: '27' },
  { label: '28 - Cachoeiro de Itapemirim e Região Sul do ES', value: '28' },
  { label: '31 - Belo Horizonte (Capital e Região Metropolitana)', value: '31' },
  { label: '32 - Juiz de Fora e Região da Zona da Mata', value: '32' },
  { label: '33 - Governador Valadares e Vale do Rio Doce', value: '33' },
  { label: '34 - Uberlândia e Triângulo Mineiro', value: '34' },
  { label: '35 - Poços de Caldas e Região Sul de MG', value: '35' },
  { label: '37 - Divinópolis e Região Oeste de MG', value: '37' },
  { label: '38 - Montes Claros e Região Norte de MG', value: '38' },
  { label: '41 - Curitiba (Capital e Região Metropolitana)', value: '41' },
  { label: '42 - Ponta Grossa e Guarapuava', value: '42' },
  { label: '43 - Londrina e Apucarana', value: '43' },
  { label: '44 - Maringá e Campo Mourão', value: '44' },
  { label: '45 - Cascavel e Foz do Iguaçu', value: '45' },
  { label: '46 - Francisco Beltrão e Pato Branco', value: '46' },
  { label: '47 - Joinville, Blumenau e Itajaí', value: '47' },
  { label: '48 - Florianópolis (Capital e Região Metropolitana)', value: '48' },
  { label: '49 - Chapecó e Região Oeste de SC', value: '49' },
  { label: '51 - Porto Alegre (Capital e Região Metropolitana)', value: '51' },
  { label: '53 - Pelotas e Rio Grande', value: '53' },
  { label: '54 - Caxias do Sul e Passo Fundo', value: '54' },
  { label: '55 - Santa Maria e Uruguaiana', value: '55' },
  { label: '61 - Brasília (Capital e Entorno)', value: '61' },
  { label: '62 - Goiânia (Capital e Região Metropolitana)', value: '62' },
  { label: '63 - Palmas e todo o estado do TO', value: '63' },
  { label: '64 - Rio Verde e Região Sul de GO', value: '64' },
  { label: '65 - Cuiabá (Capital e Região Metropolitana)', value: '65' },
  { label: '66 - Rondonópolis e Região Leste/Norte de MT', value: '66' },
  { label: '67 - Campo Grande e todo o estado do MS', value: '67' },
  { label: '68 - Rio Branco e todo o estado do AC', value: '68' },
  { label: '69 - Porto Velho e todo o estado do RO', value: '69' },
  { label: '71 - Salvador (Capital e Região Metropolitana)', value: '71' },
  { label: '73 - Ilhéus, Itabuna e Porto Seguro', value: '73' },
  { label: '74 - Juazeiro e Região Norte da BA', value: '74' },
  { label: '75 - Feira de Santana e Região Leste da BA', value: '75' },
  { label: '77 - Vitória da Conquista e Região Oeste da BA', value: '77' },
  { label: '79 - Aracaju e todo o estado do SE', value: '79' },
  { label: '81 - Recife (Capital e Região Metropolitana)', value: '81' },
  { label: '82 - Maceió e todo o estado do AL', value: '82' },
  { label: '83 - João Pessoa e todo o estado do PB', value: '83' },
  { label: '84 - Natal e todo o estado do RN', value: '84' },
  { label: '85 - Fortaleza (Capital e Região Metropolitana)', value: '85' },
  { label: '86 - Teresina e Região Norte do PI', value: '86' },
  { label: '87 - Petrolina e Região do Sertão de PE', value: '87' },
  { label: '88 - Juazeiro do Norte e Região Sul do CE', value: '88' },
  { label: '89 - Picos e Região Sul do PI', value: '89' },
  { label: '91 - Belém (Capital e Região Metropolitana)', value: '91' },
  { label: '92 - Manaus (Capital e Região Metropolitana)', value: '92' },
  { label: '93 - Santarém e Região Oeste do PA', value: '93' },
  { label: '94 - Marabá e Região Sudeste do PA', value: '94' },
  { label: '95 - Boa Vista e todo o estado do RR', value: '95' },
  { label: '96 - Macapá e todo o estado do AP', value: '96' },
  { label: '97 - Coari e Região Oeste do AM', value: '97' },
  { label: '98 - São Luís (Capital e Região Metropolitana)', value: '98' },
  { label: '99 - Imperatriz e Região Sul do MA', value: '99' },
];

export const getDDDsByCountry = (countryName?: string, ddi?: string): DDDOption[] => {
  const normalizedCountry = countryName?.toLowerCase() || '';
  const normalizedDDI = ddi?.replace('+', '') || '';

  if (
    normalizedCountry === 'brazil' || 
    normalizedCountry === 'brasil' || 
    normalizedDDI === '55'
  ) {
    return brazilDDDs;
  }
  return [];
};
