import { NodeType } from "@prisma/client";
import { NodeExecutor } from "../types";
import { manualTriggerExecutor } from "@/features/trigger/components/manual-trigger/executor";
import { httpRequestExecutor } from "../components/http-request/executor";

export const executorRegistry : Record<NodeType,NodeExecutor> = {
    [NodeType.INITIAL] : manualTriggerExecutor,
    [NodeType.MANUAL_TRIGGER] : manualTriggerExecutor,
    [NodeType.HTTP_REQUEST] : httpRequestExecutor as NodeExecutor,  // TODO : resolve the types
}

export const getExecutor = (type : NodeType) : NodeExecutor =>{
    const executor = executorRegistry[type] ;
    if(!executor){
        throw new Error(`No executor found for node type : ${type}`)
    }
    return executor ;
}

