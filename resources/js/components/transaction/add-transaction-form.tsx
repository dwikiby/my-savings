'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { VoiceInput } from '../voice-input/voice-input';

const categories = {
    income: ['Salary', 'Freelance', 'Investments', 'Other Income'],
    expense: ['Food', 'Transportation', 'Utilities', 'Shopping', 'Entertainment', 'Other Expenses'],
};

interface AddTransactionFormProps {
    onClose?: () => void;
}

export function AddTransactionForm({ onClose }: AddTransactionFormProps) {
    const [isListening, setIsListening] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '',
        type: 'expense',
        category: '',
        description: '',
        transaction_date: format(new Date(), 'yyyy-MM-dd'),
        remember_category: false,
    });

    const handleVoiceResult = (result: { type: 'income' | 'expense'; amount: number; description: string; category?: string }) => {
        setData({
            ...data,
            type: result.type,
            amount: result.amount.toString(),
            description: result.description,
            category: result.category || (result.type === 'income' ? 'Other Income' : 'Other Expenses'),
        });
    };

    const handleSubmit = (e: React.FormEvent, addAnother = false) => {
        e.preventDefault();
        setIsSubmitting(true);

        post(route('transactions.store'), {
            onSuccess: () => {
                toast.success('Transaction added successfully');

                if (addAnother) {
                    const resetData = {
                        amount: '',
                        description: '',
                        transaction_date: data.transaction_date,
                    };

                    if (!data.remember_category) {
                        resetData['type'] = 'expense';
                        resetData['category'] = '';
                    } else {
                        resetData['type'] = data.type;
                        resetData['category'] = data.category;
                    }
                    resetData['remember_category'] = data.remember_category;

                    // Reset form dengan nilai yang dipertahankan
                    for (const key in resetData) {
                        setData(key, resetData[key]);
                    }
                } else {
                    // Reset form dan tutup dialog
                    reset();
                    if (onClose) {
                        onClose();
                    }
                }
            },
            onError: () => {
                toast.error('Failed to add transaction');
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
            preserveScroll: addAnother,
        });
    };

    useEffect(() => {
        return () => {
            if (isListening) {
                setIsListening(false);
            }
        };
    }, [isListening]);
    return (
        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="flex items-start gap-2">
                    <div className="relative flex-1">
                        <span className="absolute top-1.5 left-3">Rp</span>
                        <Input
                            id="amount"
                            type="text"
                            className="pl-9"
                            placeholder="0"
                            value={data.amount}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^\d]/g, '');
                                setData('amount', value);
                            }}
                        />
                    </div>
                    <VoiceInput onResult={handleVoiceResult} isListening={isListening} setIsListening={setIsListening} />
                </div>
                {errors.amount && <p className="mt-1 text-sm text-red-500">{errors.amount}</p>}
                <p className="text-muted-foreground text-xs">Enter amount in Rupiah without dots or commas</p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                    <SelectTrigger id="type">
                        <SelectValue placeholder="Select transaction type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                </Select>
                {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                    <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories[data.type as 'income' | 'expense'].map((category) => (
                            <SelectItem key={category} value={category}>
                                {category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    placeholder="Enter transaction description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="transaction_date">Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="transaction_date"
                            variant={'outline'}
                            className={cn('w-full pl-3 text-left font-normal', !data.transaction_date && 'text-muted-foreground')}
                        >
                            {data.transaction_date ? format(new Date(data.transaction_date), 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={data.transaction_date ? new Date(data.transaction_date) : undefined}
                            onSelect={(date) => date && setData('transaction_date', format(date, 'yyyy-MM-dd'))}
                            disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                {errors.transaction_date && <p className="mt-1 text-sm text-red-500">{errors.transaction_date}</p>}
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="remember_category"
                    checked={data.remember_category}
                    onCheckedChange={(checked) => setData('remember_category', !!checked)}
                />
                <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="remember_category">Remember category and type</Label>
                    <p className="text-muted-foreground text-sm">Keep these selections for your next transaction</p>
                </div>
                {errors.remember_category && <p className="mt-1 text-sm text-red-500">{errors.remember_category}</p>}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" disabled={processing || isSubmitting} onClick={(e) => handleSubmit(e, true)}>
                    {processing || isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        'Save & Add Another'
                    )}
                </Button>
                <Button type="submit" disabled={processing || isSubmitting}>
                    {processing || isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        'Save & Close'
                    )}
                </Button>
            </div>
        </form>
    );
}
