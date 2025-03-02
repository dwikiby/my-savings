'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
    amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Amount must be a positive number in Rupiah',
    }),
    type: z.enum(['income', 'expense']),
    category: z.string().min(1, 'Please select a category'),
    description: z.string().min(2, 'Description must be at least 2 characters'),
    date: z.date(),
    rememberCategory: z.boolean().default(false),
});

const categories = {
    income: ['Salary', 'Freelance', 'Investments', 'Other Income'],
    expense: ['Food', 'Transportation', 'Utilities', 'Shopping', 'Entertainment', 'Other Expenses'],
};

type FormData = z.infer<typeof formSchema>;

interface AddTransactionFormProps {
    onSubmit?: (values: FormData) => void;
    onClose?: () => void;
}

export function AddTransactionForm({ onSubmit, onClose }: AddTransactionFormProps) {
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: 'expense',
            date: new Date(),
            rememberCategory: false,
        },
    });

    const transactionType = form.watch('type');
    const rememberCategory = form.watch('rememberCategory');

    function handleSubmit(values: FormData, addAnother = false) {
        onSubmit?.(values);
        toast('Transaction added successfully');

        if (addAnother) {
            // Reset form but keep some values if remember is checked
            form.reset({
                type: rememberCategory ? values.type : 'expense',
                category: rememberCategory ? values.category : '',
                date: values.date,
                rememberCategory: values.rememberCategory,
            });
        } else {
            form.reset();
            onClose?.();
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((values) => handleSubmit(values))} className="space-y-6">
                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <span className="absolute top-2.5 left-3">Rp</span>
                                    <Input
                                        type="text"
                                        className="pl-9"
                                        placeholder="0"
                                        value={field.value}
                                        onChange={(e) => {
                                            // Only allow numbers and format them
                                            const value = e.target.value.replace(/[^\d]/g, '');
                                            field.onChange(value);
                                        }}
                                    />
                                </div>
                            </FormControl>
                            <FormDescription className="text-xs">Enter amount in Rupiah without dots or commas</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select transaction type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="income">Income</SelectItem>
                                    <SelectItem value="expense">Expense</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {categories[transactionType].map((category) => (
                                        <SelectItem key={category} value={category.toLowerCase()}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Enter transaction description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={'outline'}
                                            className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                                        >
                                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="rememberCategory"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Remember category and type</FormLabel>
                                <FormDescription>Keep these selections for your next transaction</FormDescription>
                            </div>
                        </FormItem>
                    )}
                />
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            console.log('Save & Add Another');
                        }}
                    >
                        Save & Add Another
                    </Button>
                    <Button type="submit">Save & Close</Button>
                </div>
            </form>
        </Form>
    );
}
