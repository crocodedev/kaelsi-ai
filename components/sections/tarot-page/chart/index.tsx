import { ChartCanvas } from "./chart-canvas";
import { useAppSelector, useAppDispatch, userActions, tarotActions } from "@/store";
import { Button } from "@/components/ui/button";
import { usePreloadingContext } from "@/contexts/animation";
import { Loader } from "@/components/ui/loader";
import { transformMatrixToArray } from "@/lib/utils/validation";
import { useEffect, useMemo, useCallback, useState } from "react";
import { resetTarotResponse, setIsFirstAnimationDone } from "@/store/slices/tarot";
import { ResultContainer } from "@/components/result";
import { useTranslation } from "@/hooks/useTranslation";

type ResultTarot = {
    final: string;
    introductory: string;
    synthesis: string;
}

export function Chart() {
    const { t } = useTranslation()
    const dispatch = useAppDispatch();
    const response = useAppSelector(state => state.tarot.response);
    const [resultTarot, setResultTarot] = useState<ResultTarot | null>(null);
    const matrix = response?.tarot?.matrix;
    const category = useAppSelector(state => state.tarot.selectedCategory);
    const spread = useAppSelector(state => state.tarot.selectedSpread);
    const isUserCanStoreMore = useAppSelector(state => state.user.permissions?.tarotStore)
    const cards = response?.cards;
    const isLoading = useAppSelector(state => state.tarot.isLoading);
    const reading = useAppSelector(state => state.tarot.response?.reading);
    const { isPreloadingFinish } = usePreloadingContext();

    const memoizedMatrix = useMemo(() => {
        if (!matrix) return null;
        return transformMatrixToArray(matrix);
    }, [matrix]);

    const memoizedCards = useMemo(() => {
        return cards || {};
    }, [cards]);

    useEffect(() => {
        if (category || spread) {
            dispatch(resetTarotResponse());
            dispatch(setIsFirstAnimationDone(false));
        }
    }, [category, spread, dispatch]);

    const createResult = (): ResultTarot => {
        return {
            final: reading?.interpretation?.final || "",
            introductory: reading?.interpretation?.intro || "",
            synthesis: reading?.interpretation?.analysis || ""
        }
    }

    useEffect(() => {
        const result = createResult();
        setResultTarot(result)
    }, [reading])


    if (isLoading || !isPreloadingFinish) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <Loader />
            </div>
        );
    }

    const handleGenerateNew = () => {
        dispatch(tarotActions.clearChart());
        dispatch(userActions.clearLastTarot());
    }


    if (!memoizedCards || !memoizedMatrix) return null;


    return (
        <>
            <ChartCanvas
                matrix={memoizedMatrix}
                cards={memoizedCards}
            />

            {resultTarot && <ResultContainer result={resultTarot} />}
            {isUserCanStoreMore && <Button onClick={handleGenerateNew}>{t('tarot.chart.button.text')}</Button>}
        </>
    );
}