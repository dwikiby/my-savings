// components/VoiceInput.tsx
'use client';

import { Button } from '@/components/ui/button';
import { VoiceProcessingResult } from '@/lib/voice-processing/types';
import { Mic, MicOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface VoiceInputProps {
    onResult: (result: VoiceProcessingResult) => void;
    isListening: boolean;
    setIsListening: (value: boolean) => void;
}

export function VoiceInput({ onResult, isListening, setIsListening }: VoiceInputProps) {
    const [recognition, setRecognition] = useState<any>(null);
    const [interimTranscript, setInterimTranscript] = useState('');
    const [finalTranscript, setFinalTranscript] = useState('');

    const toggleListening = () => {
        if (!recognition) {
            toast("Your browser doesn't support voice recognition.");
            return;
        }

        if (isListening) {
            recognition.stop();
            toast('Voice input has been stopped.');
        } else {
            try {
                recognition.start();
                setIsListening(true);
                toast('Speak now to add a transaction.');
            } catch (error) {
                console.error('Speech recognition error:', error);
                toast('Failed to start voice recognition.');
            }
        }
    };

    useEffect(() => {
        if (!isListening && recognition) {
            recognition.stop();
            setInterimTranscript('');
            setFinalTranscript('');
        }
    }, [isListening, recognition]);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
            const recognitionInstance = new SpeechRecognition();

            recognitionInstance.continuous = true;
            recognitionInstance.interimResults = true;
            recognitionInstance.lang = 'id-ID';

            recognitionInstance.onresult = (event: any) => {
                let interim = '';
                let final = '';

                for (let i = 0; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        final = event.results[i][0].transcript;
                        setFinalTranscript(final);
                        processVoiceInput(final.toLowerCase());
                    } else {
                        interim = event.results[i][0].transcript;
                        setInterimTranscript(interim);
                    }
                }
            };

            recognitionInstance.onend = () => {
                setIsListening(false);
                setInterimTranscript('');
            };

            recognitionInstance.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
                setInterimTranscript('');
                toast.error(`Speech recognition error: ${event.error}`);
            };

            setRecognition(recognitionInstance);

            // Cleanup function
            return () => {
                if (recognitionInstance) {
                    recognitionInstance.stop();
                    setIsListening(false);
                    setInterimTranscript('');
                    setFinalTranscript('');
                }
            };
        }
    }, []);
    const processVoiceInput = (transcript: string) => {
        const incomePatterns = ['terima', 'pendapatan', 'pemasukan'];
        const expensePatterns = ['belanja', 'bayar', 'pengeluaran', 'beli', 'makan'];

        // Deteksi tipe transaksi
        const type = incomePatterns.some((pattern) => transcript.toLowerCase().includes(pattern))
            ? 'income'
            : expensePatterns.some((pattern) => transcript.toLowerCase().includes(pattern))
              ? 'expense'
              : 'expense';

        // Bersihkan transcript untuk processing
        const cleanTranscript = transcript.toLowerCase();

        const extractDescription = (text: string): string => {
            let cleaned = text;
            [...incomePatterns, ...expensePatterns].forEach((pattern) => {
                cleaned = cleaned.replace(new RegExp(`^${pattern}\\s+`, 'i'), '');
            });

            cleaned = cleaned
                .replace(/\s*rp\.?\s*\d+[\d.,]*(?:\s*(?:ribu|rb|k|juta))?\s*/gi, '')
                .replace(/\s*\d+[\d.,]*\s*(?:ribu|rb|k|juta)\s*/gi, '')
                .replace(/\s*\d+[\d.,]*\s*/g, '')
                .replace(/[.,]/g, '')
                .replace(/\s+/g, ' ')
                .trim();

            // Kapitalisasi huruf pertama
            return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
        };

        let amount = 0;

        // Function untuk mengkonversi string angka ke number
        const parseAmount = (numStr: string): number => {
            return parseInt(numStr.replace(/\./g, ''));
        };

        // 1. Coba deteksi format dengan unit (juta/ribu/rb/k)
        const unitPatterns = [
            { pattern: /(\d+(?:\.\d{3})*)\s*juta/i, multiplier: 1000000 },
            { pattern: /(\d+(?:\.\d{3})*)\s*(?:ribu|rb|k)/i, multiplier: 1000 },
        ];

        for (const { pattern, multiplier } of unitPatterns) {
            const match = cleanTranscript.match(pattern);
            if (match) {
                amount = parseAmount(match[1]) * multiplier;
                break;
            }
        }

        // 2. Jika tidak ada format dengan unit, coba deteksi angka dengan format ribuan (12.000)
        if (amount === 0) {
            const thousandPattern = /(\d+(?:\.\d{3})+)/;
            const match = cleanTranscript.match(thousandPattern);
            if (match) {
                amount = parseAmount(match[1]);
            }
        }
        if (amount === 0) {
            const numberPattern = /\b(\d+)\b/;
            const match = cleanTranscript.match(numberPattern);
            if (match) {
                amount = parseInt(match[1]);
                if (amount < 1000 && !cleanTranscript.includes('rupiah')) {
                    amount *= 1000;
                }
            }
        }

        const categoryMapping = {
            income: {
                Salary: ['gaji', 'upah', 'salary'],
                Freelance: ['freelance', 'proyek', 'project', 'desain'],
                Investments: ['investasi', 'saham', 'dividend', 'bunga'],
                'Other Income': ['bonus', 'hadiah', 'pemberian'],
            },
            expense: {
                Food: ['makanan', 'makan', 'restoran', 'cafe', 'kopi', 'snack', 'jajan'],
                Transportation: ['bensin', 'parkir', 'transportasi', 'taksi', 'ojek', 'bus', 'kereta'],
                Utilities: ['listrik', 'air', 'internet', 'pulsa', 'wifi', 'gas'],
                Shopping: ['beli', 'belanja', 'mall', 'toko', 'baju', 'sepatu'],
                Entertainment: ['hiburan', 'film', 'bioskop', 'game', 'musik'],
                'Other Expenses': ['lainnya', 'other'],
            },
        };

        let category = '';
        const categoryMap = categoryMapping[type];
        for (const [cat, keywords] of Object.entries(categoryMap)) {
            if (keywords.some((keyword) => cleanTranscript.includes(keyword))) {
                category = cat;
                break;
            }
        }
        const description = extractDescription(cleanTranscript);

        onResult({
            type,
            amount,
            description: description || 'Transaksi baru',
            category: category || (type === 'income' ? 'Other Income' : 'Other Expenses'),
        });
    };

    return (
        <div className="relative">
            <Button
                type="button"
                variant={isListening ? 'destructive' : 'secondary'}
                size="icon"
                onClick={toggleListening}
                className={`h-10 w-10 ${isListening ? 'animate-pulse' : ''}`}
            >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                <span className="sr-only">{isListening ? 'Stop Voice Input' : 'Start Voice Input'}</span>
            </Button>

            {/* Preview Panel */}
            {(isListening || interimTranscript || finalTranscript) && (
                <div className="bg-card absolute top-full right-0 z-50 mt-2 w-80 rounded-lg border p-3 shadow-lg">
                    <div className="space-y-3">
                        {isListening && (
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                                <span className="text-muted-foreground text-sm">Listening...</span>
                            </div>
                        )}

                        {interimTranscript && (
                            <div className="bg-muted/50 rounded-md p-2">
                                <p className="text-muted-foreground mb-1 text-xs font-medium">Currently hearing:</p>
                                <p className="text-muted-foreground text-sm italic">{interimTranscript}</p>
                            </div>
                        )}

                        {finalTranscript && (
                            <div className="bg-muted/30 rounded-md p-2">
                                <p className="mb-1 text-xs font-medium">Final transcript:</p>
                                <p className="text-sm">{finalTranscript}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
