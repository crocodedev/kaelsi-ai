import { PropsWithChildren } from "react";

type CardProps = PropsWithChildren & {
    className?: string;
    onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
    return (
        <div onClick={onClick} className={"flex items-center justify-center gap-2 bg-gradient-card rounded-xl p-2 h-28 flex-1 min-w-0 w-full " + className}>
            {children}
        </div>
    )
}