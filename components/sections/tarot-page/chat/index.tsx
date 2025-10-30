"use client";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { useNotify } from "@/providers/notify-provider";
import { tarotActions, useAppDispatch, useAppSelector, userActions } from "@/store";
import { useKeyboardAdjust } from "@/hooks/useKeyboardAdjust";
import { cn, debounce } from "@/lib/utils";
import { useState } from "react";
import { Modal } from "@/components/modals";
import { AnimatePresence, motion } from "framer-motion";

export function Chat() {
  const user = useAppSelector(state => state.user);
  const isHaveSubscription = user?.subscription !== undefined;
  const question = useAppSelector(state => state.tarot.question);
  const [openModalChat, setOpenModalChat] = useState(false)
  const { selectedCategory, selectedSpread, readerStyle } = useAppSelector(state => state.tarot);
  const isUserCanStoreTarot = useAppSelector(state => state.user.permissions?.tarotStore);
  const isDisabled = !selectedCategory || !selectedSpread || !readerStyle || !question;
  const dispatch = useAppDispatch();
  const { notify } = useNotify();
  const { t } = useTranslation();
  const response = useAppSelector(state => state.tarot.response);


  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(tarotActions.setQuestion(e.target.value))
  };

  const handleGetReading = () => {
    if (!isHaveSubscription) {
      dispatch(userActions.setShowSubscription(true));
      return;
    }

    if (!isUserCanStoreTarot) {
      notify("error", t("common.subscribe"));
      dispatch(userActions.setShowSubscription(true));
      return;
    }

    const fetchTarotCards = async () => {
      try {
        const data = {
          question: question || "",
          category_id: selectedCategory?.id || "",
          tarot_id: selectedSpread?.id || "",
          speaker_id: readerStyle?.id || "",
        };

        const result = (await dispatch(tarotActions.getTarotResponse(data))) as {
          payload: { id: number };
        };
        await dispatch(userActions.setLastTarotId(result.payload?.id));
      } catch (error) {
        console.error("Error fetching tarot cards:", error);
      }
    };
    fetchTarotCards();
    toggleFocusOnChat();
  };

  const toggleFocusOnChat = () => {
    setOpenModalChat(prev => !prev)
  }

  if (!selectedCategory || !selectedSpread || response) {
    return null;
  }

  const baseClassNameText = 'text-white gradient-dark-section disable-border w-full rounded-xl bg-transparent p-4 h-[270px] resize-none   transition-all duration-300'

  return (
    <div
      className="flex flex-col gap-4 transition-transform duration-300"
    >
      <label className="text-white text-sm">{t("tarot.chat.askLabel")}</label>
      {openModalChat ?
        <Modal isOpen={openModalChat} className="z-50">
              <span onClick={toggleFocusOnChat} className="absolute text-white top-4 right-4 font-bold text-xl">{'X'}</span>
              <textarea
                value={question || ""}
                autoFocus={true}
                onChange={handleQuestionChange}
                placeholder={t("tarot.chat.placeholder")}
                className={cn(baseClassNameText, 'absolute w-[90%] top-14 h-[35%] max-h-[200px]')}
                style={{ lineHeight: "1.5" }}
              />
              <Button
                onClick={handleGetReading}
                disabled={isDisabled}
                className="w-[90%] absolute top-[min(300px,38%)] transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                {t("tarot.chat.getReading")}
              </Button>

        </Modal>
        :
        <textarea
          value={question || ""}
          onChange={handleQuestionChange}
          onFocus={toggleFocusOnChat}
          placeholder={t("tarot.chat.placeholder")}
          className={baseClassNameText}
          style={{ lineHeight: "1.5" }}
        />
      }

      <Button
        onClick={handleGetReading}
        disabled={isDisabled}
        className="w-full transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
      >
        {t("tarot.chat.getReading")}
      </Button>
    </div>
  );
}
