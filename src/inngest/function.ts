import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("fetching", "3s");
    await step.sleep("transcribing", "3s");
    await step.sleep("summary", "3s");

    return { message: `Hello ${event.data.email}!` };
  },
);