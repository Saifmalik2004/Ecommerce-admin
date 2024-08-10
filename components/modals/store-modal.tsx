"use client";

import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";
 export const StoreModal=()=>{
  
    const storeModal= useStoreModal();

    return (
    <Modal
    title="Create Store"
    description="Add anew store to manage product and categories"
    isOpen={storeModal.isOpen}
    onClose={()=>{storeModal.onClose}}

    >
        Future Create store form
        

    </Modal>
    )
 }