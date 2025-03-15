'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HelpCircle } from 'lucide-react';

export function VoiceInputHelp() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <HelpCircle className="h-4 w-4" />
                    <span className="sr-only">Voice Input Help</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Voice Input Examples</DialogTitle>
                    <DialogDescription>Here are some examples of phrases you can say to add transactions using voice input.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <h4 className="mb-2 font-medium">Income Examples:</h4>
                        <ul className="list-disc space-y-1 pl-5">
                            <li>"Terima gaji 5 juta rupiah"</li>
                            <li>"Pendapatan freelance 500 ribu dari proyek desain"</li>
                            <li>"Pemasukan 2.5 juta dari investasi saham"</li>
                            <li>"Terima bonus 1 juta dari kantor"</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="mb-2 font-medium">Expense Examples:</h4>
                        <ul className="list-disc space-y-1 pl-5">
                            <li>"Beli Kopi 19 ribu"</li>
                            <li>"Belanja Bulanan 200 ribu"</li>
                            <li>"Beli Bensin 23 ribu"</li>
                            <li>"Beli baju 250 ribu"</li>
                            <li>"Makan Nasi Padang 25 ribu"</li>
                        </ul>
                    </div>
                    <div className="text-muted-foreground text-sm">
                        <p>The system will try to detect:</p>
                        <ul className="list-disc pl-5">
                            <li>Transaction type (income/expense)</li>
                            <li>Amount (in Rupiah)</li>
                            <li>Category</li>
                            <li>Description</li>
                        </ul>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
