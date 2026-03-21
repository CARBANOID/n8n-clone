import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ArrowRightIcon, Loader2 } from "lucide-react";
import { RefObject } from "react";

type SendPromptButtonProps = {
  promptRef: RefObject<HTMLTextAreaElement | null> ;
  isPending: boolean;
  sendPrompt: (prompt: string) => void;
}

export const SendPromptButton = ({
  promptRef,
  isPending,
  sendPrompt
}: SendPromptButtonProps) => {
  return (
        <Button
              size="icon"
              className={cn(
                "h-8 w-8 shrink-0 rounded-full transition-all duration-300 shadow-sm",
                "hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100",
                "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
              onClick={() => {
                if (!promptRef?.current) return;
                sendPrompt(promptRef.current.value);
              }}
              disabled={isPending}
              aria-label="Send message"
            >
              { 
                (isPending) ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRightIcon className="h-4 w-4 font-bold" />
              }
      </Button>
  )
}

