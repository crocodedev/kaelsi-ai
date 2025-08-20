import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { authActions } from '@/store';

export function useAutoLogin() {
    const dispatch = useAppDispatch();
    const { isAuthenticated, loading } = useAppSelector(state => state.auth);
    const user = useAppSelector(state => state.user);

    useEffect(() => {
        if (!isAuthenticated && !loading && !user) {
            dispatch(authActions.autoLoginMockUser());
        }
    }, [dispatch, isAuthenticated, loading, user]);

    return { isAuthenticated, loading, user };
} 