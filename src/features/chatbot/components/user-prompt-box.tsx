import { RefTextarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { RefObject } from "react";

type UserPromptBoxProps = {
    promptRef: RefObject<HTMLTextAreaElement | null>
    handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export const UserPromptBox = ({
    promptRef,
    handleKeyDown,
}: UserPromptBoxProps) => {
    return (
        <div className="flex-1">
            <RefTextarea
                ref={promptRef}
                placeholder="Ask anything or describe a workflow..."
                rows={1}
                spellCheck={false}
                className={cn(
                    "w-full resize-none border-0 bg-transparent dark:bg-transparent p-0 text-sm",
                    "placeholder:text-muted-foreground/50",
                    "focus-visible:ring-0 focus-visible:border-0 shadow-none outline-none",
                    "min-h-[24px] max-h-[120px] field-sizing-content",
                    "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                )}
                onKeyDown={handleKeyDown}
            />
        </div>
    )
}