import { cn } from "@/lib/utils"
import { PropsWithChildren } from "react"
import { ButtonHTMLAttributes } from "react"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "outline"
    className?: string
}

export function Button({ children, variant = "primary", className, ...args }: PropsWithChildren<ButtonProps>) {

    return (
        <button className={cn("button", variant, className)} {...args}>
            {children}
        </button>
    )
}   