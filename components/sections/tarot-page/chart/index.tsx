import { ChartCanvas } from "./chart-canvas";
import { useEffect, useState } from "react";
import { astroApiService } from "@/lib/services/astro-api";
import { useAppSelector, useAppDispatch } from "@/store";
import { setMatrix, transformMatrixToArray } from "@/store/slices/tarot";
import { selectMaxCoordinates } from "@/store/selectors/tarot";
import { ChartShuffle } from "./chart-anim";
import { ResultField } from "@/components/sections/natal-chart/chart/result-field";
import { Button } from "@/components/ui/button";
import { usePreloadingContext } from "@/contexts/animation";
import { Loader } from "@/components/ui/loader";

export function Chart() {
    const dispatch = useAppDispatch();
    const layout = useAppSelector(state => state.tarot.layout);
    const { maxX, maxY } = useAppSelector(selectMaxCoordinates);
    const isFirstAnimationDone = useAppSelector(state => state.tarot.isFirstAnimationDone);
    const { isPreloadingFinish } = usePreloadingContext();
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const fetchTarotCards = async () => {
            const response = await astroApiService.getTarotCards();
            const matrixArray = transformMatrixToArray(response?.data[7]?.matrix);
            dispatch(setMatrix(matrixArray));
        };
        fetchTarotCards();
    }, [dispatch]);



    const mockData = [
        { category: 'Answer', answer: 'You are a very creative person and you are very good at expressing yourself.' },
    ];

    if (!isPreloadingFinish) {
        return <Loader />;
    }

    return (
        <>
            {!isFirstAnimationDone ? (
                <ChartShuffle />
            ) : (
                <>
                    {layout?.matrix && (
                        <>
                            <ChartCanvas matrix={layout.matrix} isShowingResults={showResults} maxX={maxX} maxY={maxY} />
                            {mockData.map(item => (
                                <ResultField key={item.category} category={item.category} answer={item.answer} />
                            ))}
                            <Button>Save</Button>
                        </>
                    )}
                </>
            )}
        </>
    );
}