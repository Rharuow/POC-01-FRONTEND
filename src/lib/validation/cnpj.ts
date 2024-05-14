const calculateVerifyingDigit = (
  numbers: number[],
  weights: number[]
): number => {
  let sum = 0;

  // Calculate the sum of the multiplication of each number by its respective weight
  for (let i = 0; i < weights.length; i++) sum += numbers[i] * weights[i];

  // Calculate the remainder after dividing the sum by 11
  const remainder = sum % 11;

  // Calculate the digit based on the remainder
  const digit = remainder < 2 ? 0 : 11 - remainder;

  return digit;
};

export const cnpjIsValid = (cnpj: string): boolean => {
  const cleanedCnpj = cnpj.replace(/\.|-|\//g, "");

  if (cleanedCnpj.length !== 14 || !/^\d{14}$/.test(cleanedCnpj)) {
    return false;
  }

  if (/^(\d)\1{13}$/.test(cleanedCnpj)) {
    return false; // Reject CNPJs with all identical digits
  }

  const numbers = cleanedCnpj.split("").map(Number);
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const firstDigit = calculateVerifyingDigit(numbers.slice(0, 12), weights1);
  const secondDigit = calculateVerifyingDigit(numbers.slice(0, 13), weights2);

  return numbers[12] === firstDigit && numbers[13] === secondDigit;
};
