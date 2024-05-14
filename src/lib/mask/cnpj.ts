export const cnpjMask = (value: string): string => {
  const maxLength = 14; // Maximum length of CNPJ including formatting characters
  const formattedValue = value
    .replace(/\D/g, "") // Remove any non-digit characters
    .slice(0, maxLength); // Limit the length to maximum characters

  const cnpjRegex = /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/;
  const formattedCNPJ = formattedValue.replace(cnpjRegex, "$1.$2.$3/$4-$5");

  return formattedCNPJ;
};
