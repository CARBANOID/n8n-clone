  import { streamText, UIMessage, convertToModelMessages, generateText, LanguageModel } from 'ai';
  import { createGoogleGenerativeAI } from '@ai-sdk/google';
  import { getWorkFlowContext } from '@/config/workflow-context';
  import { ChatRole } from '@prisma/client';
  import pClient from '@/lib/db';
  import { inngest } from '@/inngest/client';
  import { createId } from '@paralleldrive/cuid2';
  import { createOpenAI } from '@ai-sdk/openai';
  import { createAnthropic } from '@ai-sdk/anthropic';
import { decrypt } from '@/lib/encryption';

  type credentialPayload = {
    credentialType : string
    selectedModel : string
    credential : string
  }

  type payload = {
    messages: UIMessage[]
    conversationId : string
    workflowId : string
  } & credentialPayload

  function getModel(credential: string, credentialType: string, selectedModel: string): LanguageModel {
    credential = decrypt(credential)
    switch (credentialType) {
      case 'GEMINI': {
        const google = createGoogleGenerativeAI({ apiKey: credential });
        return google(selectedModel); // e.g. "gemini-2.5-flash"
      }
      case 'OPENAI': {
        const openai = createOpenAI({ apiKey: credential });
        return openai(selectedModel); // e.g. "gpt-4o"
      }
      case 'ANTHROPIC': {
        const anthropic = createAnthropic({ apiKey: credential });
        return anthropic(selectedModel); // e.g. "claude-sonnet-4-5"
      }
      default:
        throw new Error(`Unsupported credential type: ${credentialType}`);
    }
  }


  export async function POST(req: Request) {
    const { 
      messages , conversationId , credential , credentialType , selectedModel , workflowId 
    }: payload = await req.json();

    try{
      await pClient.chat.create({
        data : {
          conversationId,
          role : ChatRole.USER,
          // @ts-ignore 
          message : messages[messages.length - 1].parts[0].text
        }
      })
    } 
    catch (e) {
      return Response.json({ message : "Server side error !!"}, { status: 500 });
    }

    const result = streamText({
      model: getModel(credential, credentialType, selectedModel),
      system : getWorkFlowContext() ,
      messages: await convertToModelMessages(messages),
      onFinish : async({ text }) =>{

        if(text.startsWith(process.env.WORKFLOW_CREATION_CODE as string)){
          const len = (process.env.WORKFLOW_CREATION_CODE as string).length ;
          text = text.slice(len).trim() ;
          const jsonData = JSON.parse(text) ;
          
          await inngest.send({
            name : "workflows/create.ai.workflow",
            id : createId(),
            data : {
              workflowId,
              nodes : jsonData.nodes ,
              connections : jsonData.connections
            }
          })
        }

        await pClient.chat.create({
          data : {
            conversationId,
            role : ChatRole.AI,
            message : text
          }
        })
      }
    });

    return result.toUIMessageStreamResponse();
  }

  export async function PUT(req: Request) {
    const { prompt , credential , credentialType , selectedModel } : { prompt : string } & credentialPayload = await req.json();

    try { 
      const result = await generateText({
        model: getModel(credential, credentialType, selectedModel),
        system : "Just provide me a single suitable title for this conversation . No extra text" ,
        prompt : prompt ,
      });
      return Response.json(result.content[0],{ status : 200 });
    }
    catch(e : any){
      return Response.json(e.message || JSON.stringify(e),{ status : 500 });
    }
  }