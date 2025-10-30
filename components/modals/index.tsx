import { PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";


type ModalProps = PropsWithChildren<{
    isOpen: boolean;
    className?: string;
}>

export function Modal({ children, isOpen, className }: ModalProps) {

    if (!isOpen) return null;

    return (createPortal(
        <AnimatePresence>
            <motion.div initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }} className={cn("fixed inset-0 backdrop-blur-md flex justify-center items-center", className)}>
                {children}
            </motion.div>
        </AnimatePresence>,
        document.body
    ))
}