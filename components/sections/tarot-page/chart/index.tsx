import { ChartCanvas } from "./chart-canvas";
import { useEffect, useState } from "react";
import { astroApiService } from "@/lib/services/astro-api";
import { useAppSelector, useAppDispatch } from "@/store";
import { setMatrix, setLoading, setLoadingProgress } from "@/store/slices/tarot";
import { selectMaxCoordinates } from "@/store/selectors/tarot";
import { ResultField } from "@/components/sections/natal-chart/chart/result-field";
import { Button } from "@/components/ui/button";
import { usePreloadingContext } from "@/contexts/animation";
import { Loader } from "@/components/ui/loader";

export function Chart() {
    const dispatch = useAppDispatch();
    const layout = useAppSelector(state => state.tarot.layout);
    const { maxX, maxY } = useAppSelector(selectMaxCoordinates);
    const isLoading = useAppSelector(state => state.tarot.isLoading);
    const { isPreloadingFinish } = usePreloadingContext();


    useEffect(() => {
        const fetchTarotCards = async () => {
            try {
                dispatch(setLoading(true));
                dispatch(setLoadingProgress(25));
                
                const response = await astroApiService.getTarotCards();
                const matrixArray = transformMatrixToArray(response?.data[7]?.matrix);
                
                dispatch(setLoadingProgress(75));
                dispatch(setMatrix(matrixArray));
                
                dispatch(setLoadingProgress(100));
                dispatch(setLoading(false));
            } catch (error) {
                console.error('Error fetching tarot cards:', error);
                dispatch(setLoading(false));
            }
        };
        fetchTarotCards();
    }, [dispatch]);


    const transformMatrixToArray = (matrix: any) => {
        if (matrix && typeof matrix === 'object' && !Array.isArray(matrix)) {
            let result: { x: number; y: number }[] = [];
            Object.values(matrix).forEach((value: any) => {
                if (Array.isArray(value) && value.length === 2) {
                    const [x, y] = value;
                    result.push({ x, y });
                }
            });
            return result;
        }
        return matrix || [];
    };

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

    return (
        <>
            {layout?.matrix && (
                <ChartCanvas
                    matrix={layout.matrix}
                    maxX={maxX}
                    maxY={maxY}
                />
            )}

            <>
                {mockData.map(item => (
                    <ResultField key={item.category} category={item.category} answer={item.answer} />
                ))}
                <Button>Save</Button>
            </>
        </>
    );
}