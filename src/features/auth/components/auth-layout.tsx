"use client" ; 

import Link from "next/link";
import Image from "next/image";

const AuthLayout = ({ children } : { children : React.ReactNode }) =>{
    return (
        <div className="bg-muted flex min-h-screen min-w-screen flex-col justify-center items-center gap-6 p-6 md:pd-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link href="/workflows" className="flex items-center gap-1 self-center font-semibold text-[17px]">
                    <Image 
                        src="/logos/logo.svg" 
                        alt="nexus" 
                        width={30} 
                        height={30}
                        className="-mb-2" 
                    />
                    Nexus
                </Link>
             { children } 
            </div>
        </div>
    )
}

export default AuthLayout ;