import { useAppSelector, useAppDispatch } from "@/store";
import { useEffect, useCallback, useRef } from "react";
import { useNotify } from "./notify-provider";
import { tarotActions, astroActions } from "@/store";

export function ErrorProvider({ children }: { children: React.ReactNode }) {
    const tarotError = useAppSelector(state => state.tarot.error);
    const natalChartError = useAppSelector(state => state.astro.error);
    const { notify } = useNotify();
    const dispatch = useAppDispatch();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const clearTarotError = useCallback(() => {
        dispatch(tarotActions.clearError());
    }, [dispatch]);

    const clearNatalChartError = useCallback(() => {
        dispatch(astroActions.clearError());
    }, [dispatch]);

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        if (tarotError) {
            notify('error', tarotError);
            timeoutRef.current = setTimeout(clearTarotError, 100);
        }
        
        if (natalChartError) {
            notify('error', natalChartError);
            timeoutRef.current = setTimeout(clearNatalChartError, 100);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [tarotError, natalChartError, notify, clearTarotError, clearNatalChartError]);

    return <>{children}</>;
}