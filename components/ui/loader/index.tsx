import { Portal } from "../portal";

interface LoaderProps {
    text?: string;
}

export function Loader({ text }: LoaderProps) {
    return (
        <Portal>
            <div className="absolute top-0 left-0 backdrop-blur-sm flex items-center flex-col g-4 justify-center h-screen w-screen">
                <span className="text-white text-sm">{text}</span>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        </Portal>
    );
}