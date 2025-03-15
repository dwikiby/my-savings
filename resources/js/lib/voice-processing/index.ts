import { CATEGORY_MAPPING, EXPENSE_PATTERNS, INCOME_PATTERNS } from './constants';
import { VoiceProcessingResult } from './types';
import { detectAmount, detectCategory, detectTransactionType, processDescription } from './utils';

export const processVoiceInput = (transcript: string, onResult: (result: VoiceProcessingResult) => void): void => {
    const type = detectTransactionType(transcript, INCOME_PATTERNS, EXPENSE_PATTERNS);
    const amount = detectAmount(transcript);
    const category = detectCategory(transcript, type, CATEGORY_MAPPING);
    const description = processDescription(transcript, INCOME_PATTERNS, EXPENSE_PATTERNS);

    // Log untuk debugging
    console.log('Voice Input Processing:', {
        original: transcript,
        cleaned: transcript.toLowerCase(),
        type,
        amount,
        amountFormatted: new Intl.NumberFormat('id-ID').format(amount),
        category,
        description,
    });

    onResult({
        type,
        amount,
        description: description || 'Transaksi baru',
        category,
    });
};
