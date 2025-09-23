import { ChartCanvas } from "./chart-canvas";
import { useAppSelector, useAppDispatch, userActions, tarotActions } from "@/store";
import { Button } from "@/components/ui/button";
import { usePreloadingContext } from "@/contexts/animation";
import { Loader } from "@/components/ui/loader";
import { transformMatrixToArray } from "@/lib/utils/validation";
import { useEffect, useMemo, useCallback } from "react";
import { resetTarotResponse, setIsFirstAnimationDone } from "@/store/slices/tarot";
import { ResultContainer } from "@/components/result";

export function Chart() {
    const dispatch = useAppDispatch();
    const response = useAppSelector(state => state.tarot.response);
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


    const createResult = () => {
        return {
            final: reading?.interpretation?.final || "",
            introductory: reading?.interpretation?.intro || "",
            synthesis: reading?.interpretation?.analysis || ""
        }
    }

    const result = createResult();

    if (!memoizedCards || !memoizedMatrix) return null;


    return (
        <>
            <ChartCanvas
                matrix={memoizedMatrix}
                cards={memoizedCards}
            />
            {/* {!reading?.interpretation &&
                <div className="w-full mt-1 flex justify-center items-center rounded-lg shadow-lg h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
            } */}
            
            <ResultContainer result={result} />
            {isUserCanStoreMore && <Button onClick={handleGenerateNew}>Generate new Chart</Button>}
        </>
    );
}