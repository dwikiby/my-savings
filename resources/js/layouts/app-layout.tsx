import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';

import { type BreadcrumbItem } from '@/types';
import { Toaster } from 'sonner';

interface AppLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        <Toaster position="top-right" />
        {children}
    </AppLayoutTemplate>
);
