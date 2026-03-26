"use client";

import { useRef, useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { NodeType } from "@prisma/client";
import { useParams } from "next/navigation";
import { useCreateConversation, useGetConversationChats, useRemoveConversation } from "@/features/chats/hooks/use-conversations";
import ky from "ky";
import { PastConversations } from "./past-conversations";
import { UserPromptBox } from "./user-prompt-box";
import { ConversationBox } from "./conversation-box";
import { SendPromptButton } from "./sendPromptButton";
import { CredentialSelector } from "./credentialSelector";
import { KeyBoardShortcuts } from "./keyboard-shortcuts";
import { toast } from "sonner";
import { ChatBotHero } from "./hero";

export type NodeTypeOptions = {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string;
};

interface AIPromptBoxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function AIPromptBox({ open, onOpenChange, children }: AIPromptBoxProps) {
  // Workflow Id 
  const params = useParams();
  const workflowId = params.workflowId as string;

  // ChatBot
  const { messages, setMessages, sendMessage, status , stop } = useChat({
    onError : (error) => {
       toast.error(error.message) ;
    }
  });
  
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const isStreaming = (status === "streaming" || status === "submitted") ;

  // Conversations 
  const [currentConversationId, setCurrentConversationId] = useState<string>("");
  const createConversation = useCreateConversation();
  const removeConversation = useRemoveConversation();

  // Credentials
  const [credential, setCredential] = useState<string | null>(null);
  const [credentialType, setCredentialType] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  // Fetching current Chats
  const { data: ChatHistory, isLoading: isChatLoading } = useGetConversationChats(currentConversationId);

  // Methods 

  // Conversation 
  const makeConversation = async (title?: string) => {
    const res = await createConversation.mutateAsync({
      workflowId,
      title
    });
    return res;
  }

  const deleteConversation = async (conversationId: string) => {
    await removeConversation.mutateAsync({
      conversationId
    })
  }

  const resetConversation = () =>{
    setCurrentConversationId("") ; 
    setMessages([]) ;
  }

  const getConversationName = async(prompt : string) : Promise<string> => {
      const res = await ky.put("/api/chat", {
        body: JSON.stringify({
          prompt: prompt,
          credential,
          credentialType,
          selectedModel,
        })
      })
      const { text }: { text: string } = await res.json();

      if(res.status === 500){
        toast.error(text) ;
        return "" ;
      }
      return text ;
  }

  // ChatBot
  const sendMessageToAI = async (prompt: string, conversationId: string) => {
    await sendMessage({
      text: prompt
    }, {
      body: {
        conversationId,
        credential, 
        credentialType,
        selectedModel,
        workflowId
      }
    })
  }

  const sendPrompt = async (prompt?: string | null) : Promise<boolean> => {
    if(!credential || !credentialType) {
      toast.error("Please select a credential") ;
      return false ;
    }
    
    if(!selectedModel){
       toast.error("Please select a model")
       return false ;
    }
    
    if (typeof prompt == "string") prompt = prompt.trim();

    if (!prompt || !promptRef.current) {
      if (promptRef.current) promptRef.current.focus();
      return false ;
    }

    let conversationId : string = currentConversationId ;

    if (messages.length === 0 && currentConversationId.length === 0) {
      const text = await getConversationName(prompt) ;
      if(text === "") return false ;
      const newConversation = await makeConversation(text) ;
      conversationId = newConversation.id ;
    }

    await sendMessageToAI(prompt, conversationId);
    setCurrentConversationId(conversationId);
    promptRef.current.value = "";
    return true ;
  };

  const handleKeyDown = async(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      if (!promptRef.current || isStreaming || createConversation.isPending || isChatLoading) return;
      await sendPrompt(promptRef.current.value);
    }
  };


  useEffect(() => {
    if (ChatHistory) setMessages(ChatHistory);
  }, [ChatHistory, setMessages])


  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent
        side="right"
        className={cn(
          "flex flex-col w-full sm:max-w-[440px] p-0 gap-0",
          "bg-background/80 backdrop-blur-xl border-l border-border/40",
          "shadow-2xl h-full max-h-screen overflow-hidden"
        )}
      >
        <SheetHeader className="flex-none px-6 pt-6 pb-4 bg-background/40 backdrop-blur-md">
          <ChatBotHero/>
          <PastConversations
            workflowId = {workflowId}
            conversationId = {currentConversationId}
            isCreating = {createConversation.isPending}
            isRemoving = {removeConversation.isPending}
            removingConversationId = {removeConversation.variables?.conversationId}
            setConversationId = {setCurrentConversationId}
            resetConversation = {resetConversation}
            deleteConversation = {deleteConversation}
          />

          {isStreaming && (
            <div className="flex items-center justify-end mt-2">
              <Badge
                variant="secondary"
                className="text-[10px] px-2 py-0.5 gap-1.5 animate-in fade-in slide-in-from-top-1 duration-300"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                Thinking…
              </Badge>
            </div>
          )}
        </SheetHeader>

        <Separator className="opacity-30" />

        <ScrollArea className="flex-1 min-h-0">
          <div className="px-6 overflow-hidden w-full">
            <ConversationBox
            conversationId = {currentConversationId}
            isChatLoading = {isChatLoading}
            isStreaming = {isStreaming}
            messages = {messages}
            sendPrompt = {sendPrompt}
          />
          </div>
        </ScrollArea>

        <div className="flex-none p-0 sm:p-6 sm:pb-3">
          <div
            className={cn(
              "relative flex flex-col gap-2 rounded-2xl border bg-muted/40 p-3 shadow-sm",
              "border-border/60 transition-all duration-300",
              "focus-within:border-primary/40 focus-within:bg-background/60",
              "focus-within:ring-4 focus-within:ring-primary/10 focus-within:shadow-md"
            )}
          >
            <UserPromptBox
              promptRef={promptRef}
              handleKeyDown={handleKeyDown}
            />

            <div className="flex items-center justify-between gap-2 mt-1">
              <div className="flex items-center gap-1.5">
                <CredentialSelector
                  credential={credential}
                  credentialType={credentialType}
                  selectedModel={selectedModel}
                  setCredential={setCredential}
                  setCredentialType={setCredentialType}
                  setSelectedModel={setSelectedModel} 
                />
              </div>

              <div className="flex items-center gap-1.5">
                <SendPromptButton
                  promptRef={promptRef}
                  isPending={isStreaming || createConversation.isPending || isChatLoading}
                  sendPrompt={sendPrompt}
                />
              </div>
            </div>
          </div>
          <KeyBoardShortcuts/>
        </div>
      </SheetContent>
    </Sheet>
  );
}