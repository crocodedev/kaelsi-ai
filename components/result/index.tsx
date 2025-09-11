import { useTranslation } from "@/hooks/useTranslation";
import { ResultField } from "../sections/natal-chart/chart/result-field"


type ResultContainerProps = {
    result: {
        final: string;
        introductory: string;
        synthesis: string;
    }
}


export const ResultContainer = ({ result }: ResultContainerProps) => {
    const { t } = useTranslation();
    return (
        <>
            {result.introductory && <ResultField category={t('result.introductory')} answer={result.introductory} />}
            {result.synthesis && <ResultField category={t('result.synthesis')} answer={result.synthesis} />}
            {result.final && <ResultField category={t('result.final')} answer={result.final} />}
        </>
    )
}