"use client" ;

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { LightbulbIcon, MoonIcon } from "lucide-react";
import { SidebarMenuButton } from "./ui/sidebar";

export const ThemeToggleButton = () => {
    const [mounted,setMounted] = useState(false) ; 
    const { theme ,setTheme } = useTheme() ;
    const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

    useEffect(() => setMounted(true),[]) ;
    
    if(!mounted) return null ; 

    return (
        <SidebarMenuButton
            tooltip="Theme"
            className="gap-x-4 h-10 p-4"
            onClick={toggleTheme}
        >
            {
                (theme === "dark") 
                ? <MoonIcon className="h-4 w-4"/> 
                : <LightbulbIcon className="h-4 w-4"/>
            }
            <span>Theme</span>
        </SidebarMenuButton>
    )

}