import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import { LogOutButton } from "./logout";

const Home = async() => {
  await requireAuth() ;  // for User Experience , the real auth check is done in trpc protected procedures
  const data = await caller.getUsers()
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6">
      protected server component
      <div>
        {JSON.stringify(data,null,2)}
      </div>
        <LogOutButton/>
    </div>
  )
}

export default Home ;