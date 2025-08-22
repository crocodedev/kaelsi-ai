"use client"

import { Button } from "@/components/ui/button";
import { useNotify } from "@/providers/notify-provider";
import { tarotActions, useAppDispatch, useAppSelector, userActions } from "@/store";

export function Chat() {
    const user = useAppSelector(state => state.user);
    const isHaveSubscription = user?.subscription !== undefined;
    const question = useAppSelector(state => state.tarot.question);
    const { selectedCategory, selectedSpread, readerStyle } = useAppSelector(state => state.tarot)
    const isDisabled = !selectedCategory || !selectedSpread || !readerStyle || !question;
    const dispatch = useAppDispatch();
    const { notify } = useNotify();
    const selectedReaderStyle = useAppSelector(state => state.tarot.readerStyle);
    const response = useAppSelector(state => state.tarot.response);

    const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(tarotActions.setQuestion(e.target.value));
    }

    const handleGetReading = () => {
        if (!isHaveSubscription) {
            dispatch(userActions.setShowSubscription(true));
            return;
        }

        const fetchTarotCards = async () => {

            try {
                const data = {
                    question: question || "",
                    tarot_id: selectedSpread?.id || "",
                    speaker_id: selectedReaderStyle?.id || ""
                }

                await dispatch(tarotActions.getTarotResponse(data));
                
            } catch (error) {
                console.error('Error fetching tarot cards:', error);
            }
        };
        fetchTarotCards();
    }

    if (!selectedCategory || !selectedSpread || response) {
        return null;
    }

    return (
        <div className="flex flex-col gap-4">
            <label className="text-white text-sm">Ask a question</label>
            <textarea
                value={question || ''}
                onChange={handleQuestionChange}
                placeholder="What's bothering you?"
                className="text-white gradient-dark-section w-full rounded-xl bg-transparent p-4 h-[270px] resize-none border border-white/20 focus:outline-none focus:border-white/40 transition-all duration-300 hover:border-white/30"
                style={{ lineHeight: '1.5' }}
            />
            <Button
                onClick={handleGetReading}
                disabled={isDisabled}
                className="w-full transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
            >
                Get a Reading
            </Button>
        </div>
    )
}