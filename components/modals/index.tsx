import { PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";


type ModalProps = PropsWithChildren<{
    isOpen: boolean;
    onClose: () => void;
    className?: string;
}>

export function Modal({ children, isOpen, onClose, className }: ModalProps) {

    if (!isOpen) return null;

    return (createPortal(
        <div className={cn("fixed inset-0 backdrop-blur-md flex justify-center items-center", className)}>
            {children}
        </div>,
        document.body
    ))
}