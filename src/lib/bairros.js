export const BAIRRO_COM_ACENTO = {
  "SAO CRISTOVAO": "São Cristóvão",
  "SAO CRISTOVÃO": "São Cristóvão",
  "SAO BORJA": "São Borja",
  "SAO JOSE": "São José",
  "SAO FRANCISCO": "São Francisco",
  "SAO PEDRO": "São Pedro",
  "SAO SEBASTIAO": "São Sebastião",

  "IRAPUA I": "Irapuá I",
  "IRAPUA II": "Irapuá II",
  IRAPUA: "Irapuá",

  SAMBAIBA: "Sambaíba",
  "SAMBAIBA VELHA": "Sambaíba Velha",
  "PLANALTO SAMBAIBA": "Planalto Sambaíba",

  TIBERAO: "Tiberão",
  MELADAO: "Meladão",
  CURADOR: "Curador",

  "JOSE PARAGUASSU": "José Paraguassú",
  "JOSE PARAGUASSU": "José Paraguassú",
  "PEDRO SIMPLICIO": "Pedro Simplício",
  "ALFREDO DE CARVALHO": "Alfredo de Carvalho",
  "RAIMUNDO FILHO": "Raimundo Filho",
  "JOAO ELIAS OKA": "João Elias Oka",
  "VIANA DE CARVALHO": "Viana de Carvalho",
  "PAULO MARTINS": "Paulo Martins",
  "JASMINA BUCAR": "Jasmina Bucar",
  "N SRA DA GUIA": "N. Sra. da Guia",
  "NOSSA SENHORA DA GUIA": "Nossa Senhora da Guia",
  "DIRCEU ARCOVERDE": "Dirceu Arcoverde",

  "ALTO DA CRUZ": "Alto da Cruz",
  "ALTO DA GUIA": "Alto da Guia",
  "BOM LUGAR": "Bom Lugar",
  "BOSQUE SANTA TEREZINHA": "Bosque Santa Terezinha",
  "CAMPO VELHO": "Campo Velho",
  CANCELA: "Cancela",
  CANOAS: "Canoas",
  CATUMBI: "Catumbi",
  "CAIXA D AGUA": "Caixa d'Água",
  CAJUEIRO: "Cajueiro",
  CENTRO: "Centro",
  "CONJUNTO PARAISO": "Conjunto Paraíso",
  IBIAPABA: "Ibiapaba",
  MANGUINHA: "Manguinha",
  "PAU FERRADO": "Pau Ferrado",
  "PLANALTO BELA VISTA": "Planalto Bela Vista",
  "REDE NOVA": "Rede Nova",
  TABOCA: "Taboca",
  TAMBORIL: "Tamboril",
  VIAZUL: "Viazul",
};

export function formatarBairro(nome) {
  if (!nome) return "Não informado";

  const chave = String(nome)
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  if (BAIRRO_COM_ACENTO[chave]) return BAIRRO_COM_ACENTO[chave];

  return String(nome)
    .toLowerCase()
    .split(" ")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}
