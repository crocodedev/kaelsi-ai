"use client"

import { createContext, useContext, ReactNode } from "react";
import { Notify } from "@/components/notify/index";
import { useNotify as useNotifySimple } from "@/hooks/use-notfiy";

interface NotifyContextType {
    notify: (type: 'success' | 'error' | 'warning' | 'info', text: string) => void;
}

const NotifyContext = createContext<NotifyContextType | null>(null);

export function NotifyProvider({ children }: { children: ReactNode }) {
    const { notify, notifyData } = useNotifySimple();

    return (
        <NotifyContext.Provider value={{ notify }}>
            {children}
            {notifyData && <Notify type={notifyData.type} text={notifyData.text} />}
        </NotifyContext.Provider>
    );
}

export function useNotify() {
    const context = useContext(NotifyContext);
    if (!context) {
        throw new Error('useNotify must be used within NotifyProvider');
    }
    return context;
} 