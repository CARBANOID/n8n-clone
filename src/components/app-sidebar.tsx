"use client" ; 

import {
    CreditCardIcon , 
    FolderOpenIcon, 
    HistoryIcon , 
    KeyIcon , 
    LogOutIcon , 
    StarIcon
} from "lucide-react" ;

import Image from "next/image";
import Link from "next/link";
import { usePathname , useRouter } from "next/navigation";

import {
    Sidebar ,
    SidebarContent , 
    SidebarFooter , 
    SidebarGroup , 
    SidebarGroupContent , 
    SidebarHeader , 
    SidebarMenu , 
    SidebarMenuButton ,
    SidebarMenuItem
} from "@/components/ui/sidebar" ;
import { authClient } from "@/lib/auth-client";
import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-subscriptions";
import { ThemeToggleButton } from "./theme-toggle-button";


const menuItems = [
    {
        title : "Main" , 
        items : [
            {
                title : "WorkFlows" ,
                icon  : FolderOpenIcon ,
                url   : "/workflows"
            },
           {
                title : "Credentials" ,
                icon  : KeyIcon ,
                url   : "/credentials"
            },
           {
                title : "Executions" ,
                icon  : HistoryIcon ,
                url   : "/executions"
            }
        ]
    }
] ; 

export const AppSideBar = () => {
    const router = useRouter() ; 
    const pathname = usePathname() ; 
    const { hasActiveSubscriptions , isLoading } = useHasActiveSubscription() ;

    return (
        <Sidebar collapsible="icon"> 
            <SidebarHeader>
                <SidebarMenuItem>
                    <SidebarMenuButton 
                     className="gap-x-4 h-10 p-4"
                     asChild
                    >
                        <Link href="/workflows" prefetch >    {/* prefetch will fetch the content of linked page when current page is loaded thus making it faster*/}
                            <Image 
                                src="/logos/logo.svg" 
                                alt="nexus"  
                                width={30} 
                                height={30}
                                className="pt-1"
                            />
                            <span className="font-semibold text-[17px] -ml-[10px] pb-[3px]"> Nexus </span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarHeader>
            <SidebarContent>
                { 
                    menuItems.map((group) => (
                        <SidebarGroup key = { group.title}>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                { 
                                    group.items.map((item) => (
                                        <SidebarMenuItem key = { item.title }>
                                            <SidebarMenuButton
                                                tooltip={item.title}
                                                isActive={ 
                                                    (item.url === "/") 
                                                      ? (pathname === "/") 
                                                      :  pathname.startsWith(item.url) 
                                                }
                                                asChild    // aschild will make this component as it's 1st child component i.e Button as Link
                                                className="gap-x-4 h-10 px-4"
                                            > 
                                                <Link href={item.url} prefetch>    {/* prefetch will fetch the content of linked page when current page is loaded thus making it faster*/}
                                                    <item.icon className="size-4"/>
                                                    <span>{item.title} </span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))
                                }
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ))
                }
            </SidebarContent>
            <SidebarFooter>
                { 
                !hasActiveSubscriptions && !isLoading &&  // remove this button if user has pro tier already
                <SidebarMenuItem>
                    <SidebarMenuButton 
                     tooltip="upgrade to pro"
                     className="gap-x-4 h-10 p-4"
                     onClick={() => { authClient.checkout( {slug : "pro"} )}}   // to add pro tier thorugh polar
                    >
                        <StarIcon className="h-4 w-4"/>
                        <span>Upgrade to Pro</span>
                    </SidebarMenuButton>
                </SidebarMenuItem> 
                }

                <SidebarMenuItem>
                    <ThemeToggleButton/>
                </SidebarMenuItem>

                <SidebarMenuItem>
                    <SidebarMenuButton 
                     tooltip="Billing Portal"
                     className="gap-x-4 h-10 p-4"
                     onClick={() => authClient.customer.portal() }  // to add the polar billing portal
                    >
                        <CreditCardIcon className="h-4 w-4"/>
                        <span>Billing Portal</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                    <SidebarMenuButton 
                     tooltip="Sign out"
                     className="gap-x-4 h-10 p-4"
                     onClick={() => {
                        authClient.signOut({
                            fetchOptions : {
                                onSuccess : () => router.push("/login") 
                            }
                        }) ;
                    }}
                    >
                        <LogOutIcon className="h-4 w-4"/>
                        <span>Sign out</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarFooter>
        </Sidebar>
    ) ;
}