import { NotifyType } from "@/components/notify/types"
import { useState } from "react"

interface NotifyData {
    type: NotifyType
    text: string
}

export function useNotify() {
    const [notifyData, setNotifyData] = useState<NotifyData | null>(null)

    const notify = (type: NotifyType, text: string) => {
        if (notifyData) return;

        setNotifyData({ type, text })
        const timer = setTimeout(() => {
            setNotifyData(null)
        }, 1500)

        return (() => clearTimeout(timer))
    }


    return { notify, notifyData }
}   