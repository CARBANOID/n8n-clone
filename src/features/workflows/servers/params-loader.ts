import { createLoader } from "nuqs/server";
import { workflowsParams } from "../params";

export const workflowsParamsLoader = createLoader(workflowsParams) ;   // createLoader for parsing params from url in server side