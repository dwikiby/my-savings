'use client';

import { Plus, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { AddTransactionForm } from './add-transaction-form';

export function AddTransactionDrawer({ className }: { className?: string }) {
    const [open, setOpen] = useState(false);

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button size="sm" className={className}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Transaction
                </Button>
            </DrawerTrigger>
            <DrawerContent className="fixed inset-0 h-screen max-h-none rounded-none border-none">
                <div className="flex h-full flex-col">
                    <DrawerHeader className="border-b">
                        <div className="flex items-center justify-between">
                            <DrawerTitle>Add New Transaction</DrawerTitle>
                            <DrawerClose asChild>
                                <Button variant="ghost" size="icon">
                                    <X className="h-4 w-4" />
                                </Button>
                            </DrawerClose>
                        </div>
                        <DrawerDescription>
                            Fill in the details below to add a new transaction to your account. You can add multiple transactions by using the "Save &
                            Add Another" button.
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="flex-1 overflow-auto p-4">
                        <div className="mx-auto w-full max-w-3xl">
                            <AddTransactionForm onClose={() => setOpen(false)} />
                        </div>
                    </div>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
