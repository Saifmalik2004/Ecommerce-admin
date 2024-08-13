"use client"

import {Store} from '@prisma/client'
import { Popover, PopoverTrigger } from './ui/popover'
import { useParams, useRouter } from 'next/navigation';
import { useStoreModal } from '@/hooks/use-store-modal';
import { useState } from 'react';
import { Button } from './ui/button';
import { Check, ChevronsUpDown, PlusCircle, StoreIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PopoverContent } from '@radix-ui/react-popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from './ui/command';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps{
    items: Store[];

}
function Storewitcher({
    className,
    items=[]
}:StoreSwitcherProps) {
    const storeModal= useStoreModal();
    const params = useParams();
    const router = useRouter();
    const formattedItems = items.map((item)=>({
        label:item.name,
        value:item.id

    }))
    const currentStore = formattedItems.find((itam)=> itam.value === params.storeId)
    const [open,setOpen] = useState(false);

    const onStoreSelect = (store:{value:string,label:string})=>{
        setOpen(false);
        router.push(`/${store.value}`)
    }
  return (
    <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button 
            variant='outline'
            size='sm'
            role='combobox'
            aria-expanded={open}
            aria-label='select a store'
            className={cn("w-[200px] justify-between" ,className)}
            >
                {currentStore?.label}
                <ChevronsUpDown className='ml-auto'/>
             <StoreIcon className='mr-2 h-4 w-4'/>
            </Button>
         </PopoverTrigger>
         <PopoverContent  className='w-[200px] p-0'>
            <Command>
                <CommandList>
                    <CommandInput placeholder='Search store'/>
                    <CommandEmpty>
                        No Store Found
                    </CommandEmpty>
                    <CommandGroup heading="Stores">
                        {formattedItems.map((store)=>(
                            <CommandItem key={store.value}
                            onSelect={()=> onStoreSelect(store)}
                            className='tex-sm'>
                                <StoreIcon className='mr-2 h-4 w-4'/>
                                {store.label}
                                <Check
                                className={cn("ml-auto h-4 w-4", currentStore?.value ===store.value ? "opacity-100" : "opacity-0")}/>

                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
                <CommandSeparator/>
                <CommandList>
                    <CommandGroup>
                        <CommandItem
                        onSelect={()=>{
                            setOpen(false);
                            storeModal.onOpen();
                        }}>
                            <PlusCircle className='mr-2 h-5 w-5'/>
                             create store

                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
         </PopoverContent>
    </Popover>
  )
}

export default Storewitcher