"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check, Copy } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email("Please enter a valid university email"),
  university: z.string().min(2),
  financeOrg: z.string().optional(),
});

export function RegisterButton({ arrow = true }: { arrow?: boolean }) {
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      university: "",
      financeOrg: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values }),
      });
      setOpen(false);

      if (response.ok) {
        toast.success("Success! Thanks for signing up.");
        form.reset();
        // Show success dialog after successful registration
        setShowSuccess(true);
      } else {
        throw new Error();
      }
    } catch {
      toast.error("An error occurred, please try again later.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleShare() {
    if (navigator.share) {
      navigator
        .share({
          title: "Stock Competition",
          text: "Join me in the university stock competition!",
          url: "https://runfolio.com",
        })
        .catch((error) => console.log("Error sharing:", error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      copyToClipboard();
    }
  }

  function copyToClipboard() {
    navigator.clipboard
      .writeText("https://runfolio.com")
      .then(() => {
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => toast.error("Failed to copy link"));
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className={
              arrow ? "hidden pl-6 md:inline-flex" : "hidden md:inline-flex"
            }
          >
            {arrow && <ArrowRight />}Register
          </Button>
        </DialogTrigger>
        <DialogTrigger asChild>
          <Button
            className={
              arrow ? "inline-flex pl-3 md:hidden" : "inline-flex md:hidden"
            }
          >
            {arrow && <ArrowRight />}Register
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Stock Competition Signup</DialogTitle>
            <DialogDescription>
              Compete with investors from the best universities.
            </DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 text-muted-foreground"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-background" />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="university"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>University</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="financeOrg"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Finance Organization (optional)</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? "Submitting..." : "Sign Up"}
                </Button>
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-md rounded-3xl p-8">
          <div className="flex flex-col items-center space-y-6 text-center">
            <h2 className="text-4xl font-medium text-gray-700">Good Luck!</h2>

            <p className="font-instrument-sans text-black">
              The market opens on Tuesday (4/8) @ 9:30AM ET. We&apos;ll email
              you with more instructions on Monday.
            </p>

            <p className="font-instrument-sans mt-2 text-lg text-black">
              See you on the Leaderboard
            </p>

            <div className="mt-4 flex w-full gap-4">
              <div
                className="flex h-12 flex-1 cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 transition-colors hover:bg-gray-100"
                onClick={copyToClipboard}
              >
                <span className="font-normal text-gray-500">runfolio.com</span>
                <button className="text-gray-400 hover:text-gray-600">
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
              <Button
                onClick={handleShare}
                className="h-12 flex-none rounded-lg bg-black px-8 font-normal text-white hover:bg-gray-800"
              >
                Share
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
