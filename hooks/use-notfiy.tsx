import { NotifyType } from "@/components/notify/types"
import { useState } from "react"

interface NotifyData {
    type: NotifyType
    text: string
}

export function useNotify() {
    const [notifyData, setNotifyData] = useState<NotifyData | null>(null)

    const notify = (type: NotifyType, text: string) => {
        setNotifyData({ type, text })

        setTimeout(() => {
            setNotifyData(null)
        }, 1500)
    }

    return { notify, notifyData }
}   