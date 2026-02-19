import { GetStepTools , Inngest } from "inngest";

export type WorkflowContext = Record<string,unknown>;

export type StepTools = GetStepTools<Inngest.Any>;

export interface NodeExecutionParams<TData = Record<string,unknown>>{
    data : TData ;
    nodeId : string ; 
    context : WorkflowContext ;
    step : StepTools ;
    // publish : TODO add real time later 
}

export type NodeExecutor<Tdata = Record<string,unknown>> = (
    params : NodeExecutionParams<Tdata>,
) => Promise<WorkflowContext> ;