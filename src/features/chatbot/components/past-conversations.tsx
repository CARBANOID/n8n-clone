import { HistoryIcon, Loader2, PlusIcon, TrashIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useSuspenseConversationNames } from "@/features/chats/hooks/use-conversations";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";

type PastConversationsProps = {
  workflowId: string;
  conversationId: string;
  isCreating: boolean
  isRemoving: boolean;
  removingConversationId?: string;
  setConversationId: (id: string) => void;
  resetConversation: () => void;
  deleteConversation: (conversationId: string) => void
}

export const PastConversations = ({
  workflowId,
  conversationId,
  isCreating,
  isRemoving,
  removingConversationId,
  setConversationId,
  resetConversation,
  deleteConversation,
}: PastConversationsProps) => {
  const conversationNames = useSuspenseConversationNames(workflowId);
  const [open, setOpen] = useState(false);

  const selectedTitle = conversationId
    ? conversationNames.data.find((c) => c.id === conversationId)?.title
    : null;

  return (
    <div className="mt-4 flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-9 px-3 text-xs bg-muted/30 border-border/40 hover:bg-muted/50 transition-colors focus:ring-1 focus:ring-primary/40 relative overflow-hidden flex items-center justify-start gap-2"
          >
            <HistoryIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            {isCreating ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                <span>Creating...</span>
              </div>
            ) : (
              <span className="truncate">
                {selectedTitle || "Chat History"}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={6}
          className="bg-background border-border/40 p-0 w-(--radix-popover-trigger-width) shadow-md"
        >
          <Command className="max-h-[350px]">
            <CommandInput placeholder="Search Conversation..." className="h-9" />
            <CommandList className="overflow-y-auto">
              <CommandEmpty>No conversation found.</CommandEmpty>
              <CommandGroup>
                {conversationNames.data.map((conversation) => (
                  <div key={conversation.id} className="relative group flex items-center px-1">
                    <CommandItem
                      value={`${conversation.title} ${conversation.id}`}
                      onSelect={() => {
                        setConversationId(conversation.id);
                        setOpen(false);
                      }}
                      className="flex-1 py-3 text-xs cursor-pointer focus:bg-primary/5 rounded-md"
                    >
                      <div className="flex items-center gap-3 w-full pr-8">
                        <div className="flex flex-col gap-1 overflow-hidden min-w-0">
                          <div className="font-medium truncate text-[13px]">
                            {conversation.title.length > 40
                              ? `${conversation.title.slice(0, 40)}...`
                              : conversation.title}
                          </div>
                          <span className="text-[10px] text-muted-foreground/70 flex items-center gap-1.5 whitespace-nowrap">
                            {formatDistanceToNow(new Date(conversation.updatedAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                    </CommandItem>

                    {conversationId !== conversation.id && (
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          deleteConversation(conversation.id);
                        }}
                        size="icon"
                        variant="ghost"
                        className={cn(
                          "absolute right-2 h-7 w-7 transition-all rounded-md z-10",
                          isRemoving && removingConversationId === conversation.id
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        )}
                        disabled={isRemoving}
                        title="Delete chat"
                      >
                        {isRemoving && removingConversationId === conversation.id ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <TrashIcon className="size-3.5" />
                        )}
                      </Button>
                    )}
                  </div>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Button
        onClick={resetConversation}
        size="icon"
        variant="outline"
        className="h-9 w-9 shrink-0 rounded-lg bg-muted/30 border-border/40 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all"
        title="New Chat"
        disabled={isCreating}
      >
        {isCreating ? (
          <Loader2 className="size-4 an imate-spin" />
        ) : (
          <PlusIcon className="size-4" />
        )}
      </Button>
    </div>
  )
}