import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { useState } from "react";

export function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-bounce"
          style={{ animationDelay: `${i * 150}ms`, animationDuration: "900ms" }}
        />
      ))}
    </div>
  );
}

export function KeyBoardShortcuts(){
    return (
        <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-muted-foreground/40 font-medium">
            <span className="flex items-center gap-1">
              <kbd className="font-mono rounded bg-muted/50 px-2 border border-border/20">↵</kbd>
              New line
            </span>
            <span className="flex items-center gap-1">
              <kbd className="font-mono rounded bg-muted/50 px-2 border border-border/20">⇧ ↵</kbd>
              Send
            </span>
          </div>
    )
}


export function EmptyState({ sendPrompt }: { sendPrompt: (prompt?: string | null) => void }) {
  const [isDisabled,setIsDisabled] = useState(false) ;
  const suggestions = [
    {
      text: "When a Google Form is submitted, analyze with AI and save to Sheets",
      icon: "📊"
    },
    {
      text: "Send a Slack alert when a Stripe payment fails",
      icon: "💬"
    },
  ];

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 py-12 text-center max-w-[320px] mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="relative group">
        <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-all duration-500 opacity-60" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-background border border-primary/20 shadow-xl ring-1 ring-primary/10">
          <Sparkles className="h-10 w-10 text-primary animate-pulse" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-bold text-foreground tracking-tight">AI Workflow Co-pilot</h3>
        <p className="text-sm text-muted-foreground/70 leading-relaxed">
          Unlock the power of automation with natural language. Just describe what you need.
        </p>
      </div>

      <div className="w-full space-y-3">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-bold">
          Quick Starts
        </p>
        <div className="grid gap-2">
          {suggestions.map((s, i) => (
            <button
              key={i}
              disabled={isDisabled}
              className={cn(
                "w-full rounded-xl border border-border/40 bg-muted/30 p-3 transition-all duration-300",
                "text-left text-xs text-muted-foreground/80 leading-relaxed font-medium group",
                "hover:bg-primary/5 hover:text-foreground hover:border-primary/30 hover:shadow-md",
                "flex items-start gap-3"
              )}
              onClick={() => {
                setIsDisabled(true)
                sendPrompt(s.text)
                setIsDisabled(false)
              }}
            >
              <span className="text-lg grayscale group-hover:grayscale-0 transition-all">{s.icon}</span>
              {s.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

