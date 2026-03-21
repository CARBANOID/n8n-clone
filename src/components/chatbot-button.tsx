import { memo, useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { AIPromptBox } from "@/features/chatbot/components/prompt-box";

export const AIButton = memo(() => {
    const [selectorOpen, setSelectorOpen] = useState(false);

    return (
        <AIPromptBox
            open={selectorOpen}
            onOpenChange={setSelectorOpen}
        >
            <Button
                onClick={() => { setSelectorOpen(true) }}
                size="icon"
                variant="outline"
                className="bg-background"
                title="Generate"
            >
                <Image
                    src={"/generate.svg"}
                    alt="AI"
                    width={26}
                    height={26}
                />
            </Button>
        </AIPromptBox>
    )
})

AIButton.displayName = "AIButton"