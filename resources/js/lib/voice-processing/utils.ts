export const parseAmount = (numStr: string): number => {
    return parseInt(numStr.replace(/\./g, ''));
};

export const detectTransactionType = (transcript: string, incomePatterns: string[], expensePatterns: string[]): 'income' | 'expense' => {
    const cleanText = transcript.toLowerCase();
    return incomePatterns.some((pattern) => cleanText.includes(pattern))
        ? 'income'
        : expensePatterns.some((pattern) => cleanText.includes(pattern))
          ? 'expense'
          : 'expense';
};

export const detectAmount = (transcript: string): number => {
    let amount = 0;
    const cleanTranscript = transcript.toLowerCase();

    const unitPatterns = [
        { pattern: /(\d+(?:\.\d{3})*)\s*juta/i, multiplier: 1000000 },
        { pattern: /(\d+(?:\.\d{3})*)\s*(?:ribu|rb|k)/i, multiplier: 1000 },
    ];

    // Check unit patterns first
    for (const { pattern, multiplier } of unitPatterns) {
        const match = cleanTranscript.match(pattern);
        if (match) {
            return parseAmount(match[1]) * multiplier;
        }
    }

    // Check thousand format
    const thousandMatch = cleanTranscript.match(/(\d+(?:\.\d{3})+)/);
    if (thousandMatch) {
        return parseAmount(thousandMatch[1]);
    }

    // Check plain numbers
    const numberMatch = cleanTranscript.match(/\b(\d+)\b/);
    if (numberMatch) {
        amount = parseInt(numberMatch[1]);
        if (amount < 1000 && !cleanTranscript.includes('rupiah')) {
            amount *= 1000;
        }
    }

    return amount;
};

export const detectCategory = (transcript: string, type: 'income' | 'expense', categoryMapping: any): string => {
    const cleanText = transcript.toLowerCase();
    const categoryMap = categoryMapping[type];

    for (const [category, keywords] of Object.entries(categoryMap)) {
        if ((keywords as string[]).some((keyword) => cleanText.includes(keyword))) {
            return category;
        }
    }

    return type === 'income' ? 'Other Income' : 'Other Expenses';
};

export const processDescription = (transcript: string, incomePatterns: string[], expensePatterns: string[]): string => {
    let description = transcript.toLowerCase();

    // Remove trigger words
    [...incomePatterns, ...expensePatterns].forEach((pattern) => {
        description = description.replace(pattern, '');
    });

    // Remove amounts and currency units
    description = description
        .replace(/\d+(?:\.\d{3})*\s*(?:ribu|rb|k|juta|rupiah)/g, '')
        .replace(/\b\d+\b/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    return description.charAt(0).toUpperCase() + description.slice(1);
};
