'use client';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, Download, Filter } from 'lucide-react';
import { useState } from 'react';

interface FilterSectionProps {
    period: string;
    year: string;
    onPeriodChange: (value: string) => void;
    onYearChange: (value: string) => void;
}

export function FilterSection({ period, year, onPeriodChange, onYearChange }: FilterSectionProps) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    return (
        <div className="flex flex-col gap-4">
            <div>
                <p className="text-muted-foreground">Analysis of spending trends and categories</p>
            </div>

            {/* Mobile filter collapsible */}
            <div className="md:hidden">
                <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen} className="w-full space-y-2">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold">Filter & Periode</h4>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="w-9 p-0">
                                <ChevronDown className="h-4 w-4" />
                                <span className="sr-only">Toggle</span>
                            </Button>
                        </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="space-y-2">
                        <Select value={period} onValueChange={onPeriodChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Periode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={year} onValueChange={onYearChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Tahun" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2024">2024</SelectItem>
                                <SelectItem value="2025">2025</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                                <Filter className="mr-2 h-4 w-4" />
                                Filter
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                                <Download className="mr-2 h-4 w-4" />
                                Unduh
                            </Button>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </div>

            {/* Desktop filter row */}
            <div className="hidden gap-2 md:flex md:flex-row md:items-center md:justify-between">
                <div className="flex flex-row gap-2">
                    <Select value={period} onValueChange={onPeriodChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Pilih Periode" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={year} onValueChange={onYearChange}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Pilih Tahun" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2025">2025</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
