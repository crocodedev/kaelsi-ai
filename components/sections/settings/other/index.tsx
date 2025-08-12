import { Section } from "@/components/layouts/section";
import { SectionTitle } from "@/components/ui/section-title";
import { OptionToggler } from "@/components/ui/toggle/option-toggler";
import { useAppDispatch, useAppSelector, userActions } from "@/store";

export function SettingsOther() {
    const isDailyReminderON = useAppSelector(state => state.user.preferences.dailyReminder)
    const cardSpeed = useAppSelector(state => state.user.preferences.cardSpeed)
    const dispatch = useAppDispatch()

    const handleDailyReminderToggle = () => {
        dispatch(userActions.setDailyReminder(!isDailyReminderON))
    }

    const handleCardSpeedChange = (speed: number) => {
        dispatch(userActions.setCardSpeed(speed))
    }

    const speedOptions = [100, 200, 300, 400, 500]

    return (
        <Section className="flex flex-col gap-9 m-0">
            <SectionTitle anchor="left" >Other</SectionTitle>
            <OptionToggler className="mb-6" title="Daily Reminder" description="Get reminded to check your daily card" isOn={isDailyReminderON} onChange={handleDailyReminderToggle} />
            
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h3 className="text-white text-sm font-medium">Card Animation Speed</h3>
                    <div className="flex items-center gap-4">
                        <div className="flex-1 relative">
                            <div className="w-full h-2 bg-gray-700 rounded-full">
                                <div 
                                    className="h-2 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-300"
                                    style={{ width: `${((cardSpeed - 100) / 400) * 100}%` }}
                                />
                            </div>
                            <input
                                type="range"
                                min="100"
                                max="500"
                                step="100"
                                value={cardSpeed}
                                onChange={(e) => handleCardSpeedChange(Number(e.target.value))}
                                className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
                            />
                            {speedOptions.map((speed) => (
                                <div
                                    key={speed}
                                    className={`absolute top-1/2 w-2 h-2 rounded-full transform -translate-y-1/2 transition-all duration-200 ${
                                        speed <= cardSpeed ? 'bg-[#D5A2F2]' : 'bg-gray-600'
                                    } ${speed === cardSpeed ? 'w-5 h-5 -translate-x-3' : ''}`}
                                    style={{ left: `${((speed - 100) / 400) * 100}%` }}
                                />
                            ))}
                        </div>
                      
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>fast</span>
                        <span>slow</span>
                    </div>
                </div>
            </div>
        </Section>
    )
}