import { HistoryIcon, Loader2, PlusIcon, TrashIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSuspenseConversationNames } from "@/features/chats/hooks/use-conversations";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

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
}
  : PastConversationsProps) => {
  const conversationNames = useSuspenseConversationNames(workflowId);

  return (
    <div className="mt-4 flex items-center gap-2">
      <Select onValueChange={(id) => setConversationId(id)} value={conversationId}>
        <SelectTrigger className="flex-1 h-9 text-xs bg-muted/30 border-border/40 hover:bg-muted/50 transition-colors focus:ring-1 focus:ring-primary/40 relative overflow-hidden">
          <div className="flex items-center gap-2 w-full">
            <HistoryIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            {isCreating ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                <span>Creating...</span>
              </div>
            ) : (
              <SelectValue placeholder="Chat History">
                <span className="truncate">
                  {conversationId ? conversationNames.data.find(c => c.id === conversationId)?.title : ""}
                </span>
              </SelectValue>
            )}
          </div>
        </SelectTrigger>
        <SelectContent
          position="popper"
          sideOffset={6}
          className="bg-background border-border/40 max-h-[300px] overflow-y-auto scrollbar-none w-[var(--radix-select-trigger-width)]"
        >
          {conversationNames.data.map((conversation) => (
            <div key={conversation.id} className="relative group flex items-center px-1">
              <SelectItem
                value={conversation.id}
                className="flex-1 py-3 text-xs cursor-pointer focus:bg-primary/5 rounded-md"
              >
                <div className="flex items-center gap-3 w-full pr-8">
                  <div className="flex flex-col gap-1 overflow-hidden min-w-0">
                    <div className="font-medium truncate text-[13px]">
                      {conversation.title}
                    </div>
                    <span className="text-[10px] text-muted-foreground/70 flex items-center gap-1.5 whitespace-nowrap">
                      {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </SelectItem>

              {
                (conversationId != conversation.id) ?
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
                  :
                  <></>
              }
            </div>
          ))}
        </SelectContent>
      </Select>

      <Button
        onClick={resetConversation}
        size="icon"
        variant="outline"
        className="h-9 w-9 shrink-0 rounded-lg bg-muted/30 border-border/40 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all"
        title="New Chat"
        disabled={isCreating}
      >
        {isCreating ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <PlusIcon className="size-4" />
        )}
      </Button>
    </div>
  )
}