import { inngest } from "./client";
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from 'ai';
import * as Sentry from "@sentry/nextjs";

export const execute = inngest.createFunction(
  { id: "math" },
  { event: "testAI/sum" },
  async ({ event, step }) => {
      const {steps : geminiSteps} = await step.ai.wrap("gemini-generate-text", 
        generateText , {
          model : google("gemini-2.5-flash") , 
          system : "You are an helpful assistant" , 
          prompt : "What is 2 + 2 ?",
          experimental_telemetry : {
            isEnabled: true,
            recordInputs: true,
            recordOutputs: true,
          },  
        }
      ) ; 

      Sentry.logger.warn("Rate limit approaching", { current: 95, max: 100 });
      
      const {steps : openaiSteps} = await step.ai.wrap("openai-generate-text", 
        generateText , {
          model : openai("gpt-5") , 
          system : "You are an helpful assistant" , 
          prompt : "What is 2 + 2 ?",
          experimental_telemetry : {
            isEnabled: true,
            recordInputs: true,
            recordOutputs: true,
          },
        }
      ) ; 

      const {steps : anthropicSteps} = await step.ai.wrap("anthropic-generate-text", 
        generateText , {
          model : anthropic("claude-sonnet-4-5") , 
          system : "You are an helpful assistant" , 
          prompt : "What is 2 + 2 ?",
          experimental_telemetry : {
            isEnabled: true,
            recordInputs: true,
            recordOutputs: true,
          },
        }
      ) ; 
      
      return { geminiSteps , openaiSteps , anthropicSteps}  ;
      
     
      // return geminiSteps ; 
  },
);  