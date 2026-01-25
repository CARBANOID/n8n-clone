import { prefetchWorkflow } from "@/features/workflows/servers/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { Editor, EditorError, EditorLoading } from "@/features/editor/components/editor";
import { EditorHeader } from "@/features/editor/components/editor-header";


interface pageProps {
    params : Promise<{ workflowId: string }>;
}

const Page = async({ params }: pageProps) => {
    await requireAuth() ;
    const { workflowId } = await params;
    prefetchWorkflow(workflowId) ;

    return (
        <HydrateClient>
            <ErrorBoundary fallback= {<EditorError/>}>
                <Suspense fallback= {<EditorLoading/>}>
                    <EditorHeader workflowId={workflowId} />  {/* will cache the workflow data cause it also uses useSuspenseWorkflow just as Editor*/}        
                    <main className="flex-1 ">
                        <Editor workflowId={workflowId}/>  {/*will retrive the data from cache instead of calling useSuspenseWorkflow again */}
                    </main>
                </Suspense>
            </ErrorBoundary>
        </HydrateClient>
    ); 
}

export default Page;