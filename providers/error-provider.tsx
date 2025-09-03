import { useAppSelector, useAppDispatch, authActions, userActions } from "@/store";
import { useEffect, useCallback, useRef } from "react";
import { useNotify } from "./notify-provider";
import { tarotActions, astroActions } from "@/store";

export function ErrorProvider({ children }: { children: React.ReactNode }) {
    const tarotError = useAppSelector(state => state.tarot.error);
    const authError = useAppSelector(state => state.auth.error);
    const natalChartError = useAppSelector(state => state.astro.error);
    const userError = useAppSelector(state => state.user.error)
    const { notify } = useNotify();
    const dispatch = useAppDispatch();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const clearTarotError = useCallback(() => {
        dispatch(tarotActions.clearError());
    }, [dispatch]);

    const clearNatalChartError = useCallback(() => {
        dispatch(astroActions.clearError());
    }, [dispatch]);

    const clearAuthError = useCallback(() => {
        dispatch(authActions.clearError());
    }, [dispatch]);

    const clearUserError = useCallback(() => {
        dispatch(userActions.clearError())
    }, [dispatch])

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        if (tarotError) {
            notify('error', tarotError);
            timeoutRef.current = setTimeout(clearTarotError, 100);
        }

        if (authError) {
            notify('error', authError);
            timeoutRef.current = setTimeout(clearAuthError, 100);
        }

        if (natalChartError) {
            notify('error', natalChartError);
            timeoutRef.current = setTimeout(clearNatalChartError, 100);
        }


        if (userError) {
            notify('error', userError);
            timeoutRef.current = setTimeout(clearUserError, 100);
        }


        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [tarotError, natalChartError, notify, clearTarotError, clearNatalChartError, userError]);

    return <>{children}</>;
}