export interface VoiceProcessingResult {
    type: 'income' | 'expense';
    amount: number;
    description: string;
    category?: string;
}

export interface CategoryMapping {
    [key: string]: {
        [key: string]: string[];
    };
}
