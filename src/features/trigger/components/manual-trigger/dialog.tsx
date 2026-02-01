"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog" ;

interface ManualTriggerNodeDialogProps{
    open : boolean,
    onOpenChange : (open : boolean) => void
}

export const ManualTriggerNodeDialog = ({ 
    open , 
    onOpenChange 
} : ManualTriggerNodeDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle> Manual Trigger </DialogTitle>
                    <DialogDescription>
                        Configure settings for the manual trigger node.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                        Used to manualy execute a workflow , no configration available.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}