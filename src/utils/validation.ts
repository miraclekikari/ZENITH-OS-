export const validateGeminiInput = (input: string): {valid: boolean, error?: string} => {
  // Longueur maximale
  if (input.length > 2000) {
    return { valid: false, error: 'Message trop long (max 2000 caractères)' };
  }
  
  // Caractères dangereux
  const dangerousPatterns = [
    /<script.*?>.*?<\/script>/gi,
    /eval\(/gi,
    /document\./gi,
    /localStorage\./gi,
    /window\./gi,
    /fetch\(/gi,
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(input)) {
      return { valid: false, error: 'Contenu potentiellement dangereux détecté' };
    }
  }
  
  // Spam detection
  const repeatedChars = /(.)\1{10,}/g;
  if (repeatedChars.test(input)) {
    return { valid: false, error: 'Message suspect détecté' };
  }
  
  return { valid: true };
};
