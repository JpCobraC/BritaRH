/**
 * Utilitários de Máscara para Input (BritaRH)
 */

export const maskCPF = (value: string) => {
  return value
    .replace(/\D/g, "") // Remove tudo o que não é dígito
    .replace(/(\d{3})(\d)/, "$1.$2") // Coloca ponto após os 3 primeiros dígitos
    .replace(/(\d{3})(\d)/, "$1.$2") // Coloca ponto após os 6 primeiros dígitos
    .replace(/(\d{3})(\d{1,2})/, "$1-$2") // Coloca traço após os 9 primeiros dígitos
    .replace(/(-\d{2})\d+?$/, "$1"); // Limita a 11 dígitos
};

export const maskDate = (value: string) => {
  return value
    .replace(/\D/g, "") // Remove tudo o que não é dígito
    .replace(/(\d{2})(\d)/, "$1/$2") // Coloca barra após os 2 primeiros dígitos
    .replace(/(\d{2})(\d)/, "$1/$2") // Coloca barra após os 4 primeiros dígitos
    .replace(/(\d{4})\d+?$/, "$1"); // Limita ao ano (8 dígitos total)
};

export const maskPhone = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1");
};
