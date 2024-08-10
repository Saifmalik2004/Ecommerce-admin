"use client"

import { StoreModal } from "@/components/modals/store-modal";

import { useEffect,useState } from "react";

export const ModalProvider=()=>{
    const [isMounted,setIsMonted]  = useState(false);


    useEffect(() => {
      setIsMonted(true);
    
      
    }, [])

    if (!isMounted)  {
        return null;
      }

      return(
        <>
        <StoreModal/>
        </>
      );
    
};