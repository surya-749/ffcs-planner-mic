'use client';

import { SessionProvider } from 'next-auth/react';
import { TimetableProvider } from '@/lib/TimeTableContext';
import { PreferencesProvider } from '@/lib/PreferencesContext';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <PreferencesProvider>
                <TimetableProvider>
                    {children}
                </TimetableProvider>
            </PreferencesProvider>
        </SessionProvider>
    );
}
