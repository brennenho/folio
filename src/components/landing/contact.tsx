"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AnimationWrapper } from "@/components/animation";
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
import { toast } from "sonner";

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSending(true);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3_FORMS_KEY,
          from_name: "Folio Contact",
          subject: `Folio Inquiry | ${values.name}`,
          ...values,
        }),
      });
      const { success } = (await response.json()) as { success: boolean };

      form.reset();

      if (success) {
        toast.success("Success! Thanks for reaching out.");
      } else {
        throw new Error("Web3Forms API error");
      }
    } catch {
      toast.error("An error occurred, please try again later.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className="flex w-full justify-center bg-foreground text-background"
      id="contact"
    >
      <div className="flex w-5/6 flex-col md:w-3/4 md:flex-row">
        <AnimationWrapper className="flex w-full flex-col gap-2 pb-8 md:w-2/5">
          <h1 className="text-2xl font-medium tracking-wide md:text-4xl">
            Contact Us
          </h1>
          <p className="tracking-tight">
            We&apos;re happy to answers all your questions.
          </p>
        </AnimationWrapper>
        <AnimationWrapper className="w-full rounded-2xl bg-[#1F1D1A] p-4 md:w-3/5">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 text-muted-foreground"
            >
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
                        className="h-36 resize-none bg-background"
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
                className="w-full bg-[#83A160] text-black"
              >
                {sending ? "Sending..." : "Send"}
              </Button>
            </form>
          </Form>
        </AnimationWrapper>
      </div>
    </div>
  );
}
