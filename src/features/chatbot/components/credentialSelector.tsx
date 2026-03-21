import { CLAUDE_MODELS, GEMINI_MODELS, OPENAI_MODELS } from "@/config/ai-models";
import { useCredentials } from "@/features/credentials/hooks/use-credentials";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { ChevronUp, Loader2 } from "lucide-react";
import { useEntitySearch } from "@/hooks/use-entity-search";

const logos = {
  "OPENAI": "/logos/openai.svg",
  "GEMINI": "/logos/gemini.svg",
  "ANTHROPIC": "/logos/anthropic.svg"
}

type CredentialSelectorProps = {
  credential: string | null;
  credentialType: string | null;
  selectedModel: string | null;
  setCredential: (credential: string) => void;
  setCredentialType: (credentialType: string) => void;
  setSelectedModel: (model: string | null) => void;
}

export const CredentialSelector = ({
  credential,
  credentialType,
  selectedModel,
  setCredential,
  setCredentialType,
  setSelectedModel
}: CredentialSelectorProps) => {

  const [models, setModels] = useState<string[]>([]);
  const [openCred, setOpenCred] = useState(false);
  const [openModel, setOpenModel] = useState(false);

  const [pageInfo, setPageInfo] = useState({
    page: 1,
    search: "",
  });

  const { searchValue, onSearchChange } = useEntitySearch({  // debouncer for search input
    params: pageInfo,
    setParams: setPageInfo,
  });

  const getCredentials = useCredentials(pageInfo);

  useEffect(() => {
    if (credentialType === "OPENAI") setModels(OPENAI_MODELS);
    else if (credentialType === "GEMINI") setModels(GEMINI_MODELS);
    else if (credentialType === "ANTHROPIC") setModels(CLAUDE_MODELS);
    else setModels([]);

    setSelectedModel(null);
  }, [credentialType]);


  return (
    <div className="flex items-center gap-2">
      <Popover open={openCred} onOpenChange={setOpenCred}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 px-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all rounded-lg"
          >
            <ChevronUp className="h-3.5 w-3.5" />
            {credential ? (
              <span className="truncate max-w-[100px]">
                {getCredentials.data?.items.find((c) => c.value === credential)?.name || "Credential"}
              </span>
            ) : (
              "Select Credential"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64 p-0" side="top" sideOffset={12}>
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search credentials..."
              className="h-9"
              value={searchValue}
              onValueChange={onSearchChange}
            />
            <CommandList className="max-h-[250px]">
              <CommandGroup heading="Credentials">
                {!getCredentials.isLoading && <CommandEmpty>No credential found.</CommandEmpty>}
                {getCredentials.isLoading ? (
                  <div className="p-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Loading...
                  </div>
                ) : (
                  getCredentials.data?.items.map((cred) => (
                    <CommandItem
                      key={cred.id}
                      onSelect={() => {
                        setCredentialType(cred.type);
                        setCredential(cred.value);
                        setOpenCred(false);
                      }}
                      className="cursor-pointer py-2"
                    >
                      <div className="flex items-center gap-2 w-full">
                        <img
                          src={logos[cred.type as keyof typeof logos]}
                          width={14}
                          height={14}
                          alt=""
                          className="shrink-0"
                        />
                        <span className="flex-1 truncate">{cred.name}</span>
                      </div>
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
              <div className="flex items-center justify-between p-1 border-t border-border/40">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={pageInfo.page <= 1}
                  onClick={() => setPageInfo((p) => ({ ...p, page: p.page - 1 }))}
                >
                  <ChevronUp className="h-3.5 w-3.5 rotate-270" />
                </Button>
                <span className="text-[10px] text-muted-foreground">Page {pageInfo.page}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  disabled={getCredentials.data?.items.length! < 5}
                  onClick={() => setPageInfo((p) => ({ ...p, page: p.page + 1 }))}
                >
                  <ChevronUp className="h-3.5 w-3.5 rotate-90" />
                </Button>
              </div>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {credentialType && (
        <Popover open={openModel} onOpenChange={setOpenModel}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 px-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all rounded-lg"
            >
              <ChevronUp className="h-3.5 w-3.5" />
              {selectedModel ? (
                <span className="truncate max-w-[120px]">{selectedModel}</span>
              ) : (
                "Select Model"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-72 p-0" side="top" sideOffset={12}>
            <Command>
              <CommandInput placeholder="Search models..." className="h-9" />
              <CommandList className="max-h-[300px]">
                <CommandEmpty>No model found.</CommandEmpty>
                <CommandGroup heading={`${credentialType} Models`}>
                  {models.map((modelName) => (
                    <CommandItem
                      key={modelName}
                      onSelect={() => {
                        setSelectedModel(modelName);
                        setOpenModel(false);
                      }}
                      className="cursor-pointer py-2"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="truncate">{modelName}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};
