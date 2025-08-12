"use client"

import { Button } from "@/components/ui/button";
import { tarotActions, useAppDispatch, useAppSelector, userActions } from "@/store";

export function Chat() {
    const user = useAppSelector(state => state.auth.user);
    const isHaveSubscription = user?.subscription_id !== undefined;
    const question = useAppSelector(state => state.tarot.question);
    const { selectedCategory, selectedSpread, readerStyle } = useAppSelector(state => state.tarot)
    const isDisabled = !selectedCategory || !selectedSpread || !readerStyle || !question;
    const dispatch = useAppDispatch();

    const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(tarotActions.setQuestion(e.target.value));
    }

    

    const handleGetReading = () => {
        console.log(user?.subscription_id)
        if (!isHaveSubscription) {
            dispatch(userActions.setShowSubscription(true));
            return;
        }
    }

    if (!selectedCategory || !selectedSpread) {
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