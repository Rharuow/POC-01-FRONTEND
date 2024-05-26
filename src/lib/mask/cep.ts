export function applyCEPMask(cep: string): string {
  // Remove non number characters
  cep = cep.replace(/\D/g, "");

  // Apply the mask: 99999-999
  cep = cep.replace(/^(\d{5})(\d{3})/, "$1-$2");

  return cep;
}
