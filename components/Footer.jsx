'use client';
import { useState } from "react";
import Link from "next/link";


export default function Footer() {
 return (
   <nav className="bg-white border-t sticky  z-50">
     <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
       {/* Logo */}
       <Link href="/" className="text-2xl block font-bold text-dark no-underline">
         Evently
       </Link>

       {/* Menu (Large Screen) */}
       
         <p className="text-sm font-bold">
           &copy; {new Date().getFullYear()} UniTicket. All rights reserved.
         </p>

        
     </div>
   </nav>
 );
}
