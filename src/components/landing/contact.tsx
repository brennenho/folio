"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10),
});

export function Contact() {
  const [sending, setSending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSending(true);
    try {
      console.log(values);

      form.reset();
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="bg-foreground text-background flex w-full justify-center py-24">
      <div className="flex w-3/4">
        <div className="flex w-2/5 flex-col gap-2">
          <h1 className="text-4xl font-medium tracking-wide">Contact Us</h1>
          <p className="tracking-tight">
            We&apos;re happy to answers all your questions.
          </p>
        </div>
        <div className="w-3/5 rounded-2xl bg-[#1F1D1A] p-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="text-muted-foreground space-y-4"
            >
              <input type="hidden" name="from_name" value="Folio" />
              <div className="flex w-full gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          placeholder="Full Name"
                          {...field}
                          className="bg-background"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          placeholder="Email"
                          {...field}
                          className="bg-background"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Textarea
                        placeholder="Message"
                        {...field}
                        className="bg-background h-36 resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                variant="secondary"
                type="submit"
                disabled={sending}
                className="w-full bg-[#B1C9D3] text-black"
              >
                {sending ? "Sending..." : "Send"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
