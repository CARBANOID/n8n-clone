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


