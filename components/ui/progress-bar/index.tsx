import { Icon } from "../icon/Icon";
import { useTranslation } from "react-i18next";

type TProps = {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressSteps({currentStep = 0, totalSteps = 0}: TProps) {
  const { t } = useTranslation()

  return (
    <div className="w-full">
      <div className="relative flex flex-col items-start pb-6">
        <p data-id='label' className="text-white text-sm font-medium mb-4 w-4/6">
          {t('quests.progressBar.label')}
        </p>

        <div data-id="progress-bar" className="relative w-full">
          <div className="absolute top-1/2 left-0 w-full h-[6px] bg-[#d9d9d91a] rounded-full -translate-y-1/2"/>
          <div
            className="absolute top-1/2 left-0 h-[6px] bg-gradient-to-r from-[#9F95D8] to-[#DDA2F2] rounded-full -translate-y-1/2 transition-all duration-300"
            style={{width: currentStep 
            ? `calc(${(currentStep) * (100 / (totalSteps+1 - 1))}% + ${totalSteps+1 - currentStep}px)` 
            : 0
            }}/>

          <div className="relative flex justify-between w-full">
            {[...Array(totalSteps+1)].map((_, i) => (
              <div data-id='step-circle' className={`relative w-[6px] h-[6px] rounded-full  transition-all duration-300 bg-[#5b5b5b80]`} key={i}>
                <span data-id='step-number' className="absolute top-full left-1/2 -translate-x-1/2 translate-y-1 text-gray-400">{i}</span>

                {i === totalSteps && (
                  <div data-id='icon' className="absolute left-1/2 bottom-full -translate-x-1/2 -translate-y-3">
                    <Icon name={"questsActive"} width={16} height={16} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
