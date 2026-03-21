import { Sparkles } from "lucide-react"
import { SheetDescription, SheetTitle } from "../ui/sheet"

export const AIHero = () =>{
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 shadow-sm">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>

            <div className="flex flex-col">
              <SheetTitle className="text-base font-bold leading-tight text-foreground tracking-tight">
                AI Assistant
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground/80 leading-tight mt-0.5">
                Build and automate smarter
              </SheetDescription>
            </div>
        </div>
    )
}