"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import {toast} from "react-hot-toast";
import axios from "axios"

import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
     Form,
     FormControl,
     FormField,
     FormItem,
     FormLabel,
     FormMessage
     } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(1),
});
export const StoreModal = () => {
  const storeModal = useStoreModal();

  const [loading , setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
        const response = await axios.post('/api/stores', values);
        console.log(response.data);
        // Show success toast
        toast.success('Store created successfully!');
        // Close modal or handle success response
        storeModal.onClose();
    } catch (error) {
        console.error('Error creating store:', error);
        // Show error toast
        toast.error('Failed to create store. Please try again.');
    } finally {
        setLoading(false);
    }
};

  return (
    <Modal
      title="Create Store"
      description="Add anew store to manage product and categories"
      isOpen={storeModal.isOpen}
      onClose={() => {
        storeModal.onClose;
      }}
    >
      
      <div>
        <div className="space-y-4 py-2 pb-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                    control={form.control}
                    name="name"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="E-Commerce" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                    <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                    <Button disabled={loading} variant="outline" onClick={storeModal.onClose}>Cancel</Button>
                    <Button disabled={loading} type="submit">Submit</Button>

                    </div>

                </form>

            </Form>
        </div>
      </div>
    </Modal>
  );
};
