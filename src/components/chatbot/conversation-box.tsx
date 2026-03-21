import { UIDataTypes, UIMessage, UITools } from "ai";
import { Bot, Loader2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { TypingDots, EmptyState } from "./utils";
import { useEffect, useRef } from "react";

type ConversationBoxProps = {
    conversationId : string,
    isChatLoading : boolean,
    isStreaming : boolean,
    messages : UIMessage<unknown, UIDataTypes, UITools>[]
    sendPrompt : () => void
}

export const ConversationBox = ({
    conversationId,
    isChatLoading,
    isStreaming,
    messages,
    sendPrompt
}: ConversationBoxProps) =>{

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

    return(
          <div className="py-6 min-h-full">
            {conversationId && isChatLoading ? (
              <div className="flex h-[200px] flex-col items-center justify-center gap-3 text-muted-foreground/60 animate-in fade-in duration-500">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-xs font-medium">Loading conversation...</p>
              </div>
            ) : messages.length === 0 ? (
              <EmptyState sendPrompt={sendPrompt} />
            ) : (
              <div className="flex flex-col gap-6">
                {messages.map((message) => {
                  const isUser = message.role === "user";
                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3 items-start animate-in fade-in slide-in-from-bottom-2 duration-300",
                        isUser && "flex-row-reverse"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all shadow-sm",
                          isUser
                            ? "bg-primary text-primary-foreground ring-1 ring-primary/20"
                            : "bg-muted/80 backdrop-blur-md ring-1 ring-border/50 text-muted-foreground"
                        )}
                      >
                        {isUser ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>

                      <div
                        className={cn(
                          "max-w-[calc(100%-48px)] flex flex-col min-w-0 rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-all",
                          isUser
                            ? "bg-primary/95 text-primary-foreground rounded-tr-none hover:bg-primary"
                            : "bg-muted/40 backdrop-blur-md text-foreground ring-1 ring-border/40 rounded-tl-none hover:bg-muted/50"
                        )}
                      >
                        {message.parts.map((part, i) => {
                          if (part.type === "text") {
                            return (
                              <div
                                key={`${message.id}-${i}`}
                                className="whitespace-pre-wrap break-words"
                              >
                                {part.text}
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  );
                })}

                {isStreaming && (
                  <div className="flex gap-3 items-start animate-in fade-in duration-300">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-muted/80 backdrop-blur-md ring-1 ring-border/50 text-muted-foreground shadow-sm">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="rounded-2xl rounded-tl-none bg-muted/40 backdrop-blur-md px-4 py-3 ring-1 ring-border/40 shadow-sm border border-primary/10">
                      <TypingDots />
                    </div>
                  </div>
                )}

                <div ref={bottomRef} className="h-4" />
              </div>
            )}
        </div>
    )
}