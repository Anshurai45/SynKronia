"use client"



import React from 'react'
import { usePathname , useRouter} from 'next/navigation'
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';




const ExploreLayout= ({children}) => {
    const pathname = usePathname();
    const Router = useRouter();
    const isMainExplorePage = pathname === "/explore";


  return (
    <div className='pb-16 min-h-screen'>
        <div className="max-w-7xl mx-auto px-6">
            {!isMainExplorePage && (
                <div className="mb-6">
                    <Button variant='ghost'
                    onClick={() => Router.push("/explore")}
                    className="gap-2 -ml-2"
                    >
                <ArrowLeft className='w-4 h-4' />
   Back To Explore
                    </Button>
                </div>

        )}


        {children}
        
        
        </div>
      
    </div>
  )
}

export default ExploreLayout