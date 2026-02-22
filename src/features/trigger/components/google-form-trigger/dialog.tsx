"use client"

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog" ;
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { generateGoogleFormScript } from "./utils";

interface GoogleFormTriggerDialogProps{
    open : boolean,
    onOpenChange : (open : boolean) => void
}

export const GoogleFormTriggerDialog = ({ 
    open , 
    onOpenChange 
} : GoogleFormTriggerDialogProps) => {
    const params = useParams() ;
    const workflow = params.workflowId as string ;

    // construct the webhook URL 
    const baseURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000" ;
    const webhookURL = `${baseURL}/api/webhooks/google-form?workflowId=${workflow}` ;

    const copyToClipboard = async() => {
        try{
            await navigator.clipboard.writeText(webhookURL) ;
            toast.success("Webhook URL copied to clipboard") ;
        }
        catch(error){
            toast.error("Failed to copy webhook URL to clipboard") ;
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle> Google Form Trigger Configuration </DialogTitle>
                    <DialogDescription>
                        Use this webhook URL in your Google Form's App Script to trigger the workflow
                        when a new form is submitted.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="webhook-url">
                            Webhook URL
                        </Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="webhook-url"
                                className="font-mono text-sm"
                                value={webhookURL}
                                readOnly
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={copyToClipboard}
                            >
                                <CopyIcon className="size-4"/>
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-lg bg-muted p-4 pt-2 space-y-2">
                        <h4 className="font-medium text-sm"> Setup Instructions </h4>
                        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                            <li> Open your Google Form</li>
                            <li> Click on the three dots menu &rarr; App Script</li>
                            <li> Copy and Paste the script below</li>
                            <li> Replace WEBHOOK_URL with your actual webhook URL above</li>
                            <li> Save and click "Triggers" &rarr; Add Trigger </li>
                            <li> Select event source &rarr; From form </li>
                            <li> Select event type &rarr; On form submit &rarr; Save</li>
                        </ol>
                    </div>
                    <div className="rounded-lg bg-muted px-4 space-y-3">
                        <h4 className="font-medium text-sm">Google Apps Script:</h4>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={async() => {
                                const script = generateGoogleFormScript(webhookURL) ;
                                try{
                                    await navigator.clipboard.writeText(script) ;
                                    toast.success("Script copied to clipboard") ;
                                }
                                catch(error){
                                    toast.error("Failed to copy script to clipboard") ;
                                }
                            }}
                        >
                            <CopyIcon className="size-4 mr-2"/>
                            Copy Google Apps Scirpt
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            This script includes your webhook URL and handles form submissions
                        </p>
                    </div>
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                            <h4 className="font-medium text-sm"> Avaiable Variables </h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                <li>
                                    <code className="bg-background px-1 py-0.5 rounded">
                                        {"{{googleForm.responsentEmail}}"}
                                    </code>
                                    - Respondant's email
                                </li>

                                <li>
                                    <code className="bg-background px-1 py-0.5 rounded">
                                        {"{{googleForm.responses['Question Name']}}"}
                                    </code>
                                    - Specific answer 
                                </li>

                                <li>
                                    <code className="bg-background px-1 py-0.5 rounded">
                                        {"{{json googleForm.responses}}"}
                                    </code>
                                    - All responses as JSON
                                </li>
                            </ul>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}