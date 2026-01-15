import { prefetchWorkflows } from "@/features/workflows/servers/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { WorkflowsContainer, WorkflowsList } from "@/features/workflows/components/workflows";

const Page = async() => {
    await requireAuth() ;
    prefetchWorkflows() ; 

    return (
        <WorkflowsContainer>
            <HydrateClient>
                <ErrorBoundary fallback = { <div>Error!</div> }>
                    <Suspense fallback = { <div>Loading...</div> }>
                        <WorkflowsList/>
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
        </WorkflowsContainer>
    ); 
}

export default Page;