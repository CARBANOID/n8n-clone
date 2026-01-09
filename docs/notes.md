# How to use ShadCN

```tsx
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Home1(){
  const temp : boolean = true ; 
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      <Button variant="outline">Click Me</Button>
    </div>
  )
}

export  function Home2(){
  const temp : boolean = true ; 
  return (
    // Applying multiple conditional tailwind classes to a element (here div)
    <div className={cn("text-amber-700 font-extrabold",temp && "text-green-500")}>
      Welcome to the Home Page
    </div>
  )
}
```