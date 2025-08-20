import { ChartCanvas } from "./chart-canvas";
import { useAppSelector, useAppDispatch, userActions } from "@/store";
import { ResultField } from "@/components/sections/natal-chart/chart/result-field";
import { Button } from "@/components/ui/button";
import { usePreloadingContext } from "@/contexts/animation";
import { Loader } from "@/components/ui/loader";
import { transformMatrixToArray } from "@/lib/utils/validation";
import { useEffect, useMemo, useCallback } from "react";
import { setSelectedCategory, setSelectedSpread, setReaderStyle, setQuestion, resetTarotResponse } from "@/store/slices/tarot";

export function Chart() {
    const dispatch = useAppDispatch();
    const response = useAppSelector(state => state.tarot.response);
    const matrix = response?.tarot?.matrix;
    const category = useAppSelector(state => state.tarot.selectedCategory);
    const spread = useAppSelector(state => state.tarot.selectedSpread);
    const cards = response?.cards;
    const isLoading = useAppSelector(state => state.tarot.isLoading);
    const subscription = useAppSelector(state => state.user.subscription)
    const { isPreloadingFinish } = usePreloadingContext();

    const memoizedMatrix = useMemo(() => {
        if (!matrix) return null;
        return transformMatrixToArray(matrix);
    }, [matrix]);

    const memoizedCards = useMemo(() => {
        return cards || {};
    }, [cards]);

    useEffect(() => {
        return () => {
            dispatch(setSelectedCategory(null));
            dispatch(setSelectedSpread(null));
            dispatch(setReaderStyle(null));
            dispatch(setQuestion(null));
            dispatch(resetTarotResponse());
        };
    }, [dispatch]);

    const mockData = [
        { category: 'Answer', answer: 'You are a very creative person and you are very good at expressing yourself.' },
    ];

    if (isLoading || !isPreloadingFinish) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <Loader />
            </div>
        );
    }

    const handleSave = () => {
        if (subscription.id == null) {
            dispatch(userActions.setShowSubscription(true));
            return;
        }

    }

    if (!memoizedCards || !memoizedMatrix || !category || !spread) return null;

    return (
        <>
            <ChartCanvas
                matrix={memoizedMatrix}
                cards={memoizedCards}
            />
            {mockData.map(item => (
                <ResultField key={item.category} category={item.category} answer={item.answer} />
            ))}
            <Button onClick={handleSave}>Save</Button>
        </>
    );
}