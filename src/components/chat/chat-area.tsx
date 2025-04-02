"use client";

import { Response } from "@/components/chat/response";
import type { DocumentTab, Message } from "@/components/chat/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import { ArrowUpCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ChatAreaProps {
  activeTab: number;
  tabs: DocumentTab[];
}

export function ChatArea({ activeTab, tabs }: ChatAreaProps) {
  const chatRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Record<number, Message[]>>({});
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState<Record<number, boolean>>({});
  const supabase = createClient();

  // load messages when component mounts or activeTab changes
  useEffect(() => {
    if (!activeTab) return;

    const loadMessages = async (tabId: number) => {
      setIsLoading((prev) => ({ ...prev, [tabId]: true }));

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("tab_id", tabId)
        .order("timestamp", { ascending: true });

      if (error) {
        toast.error("An error occurred while fetching message history");
      } else {
        setMessages((prev) => ({
          ...prev,
          [tabId]: data as Message[],
        }));
      }

      setIsLoading((prev) => ({ ...prev, [tabId]: false }));
    };

    void loadMessages(activeTab);
  }, [activeTab, supabase]);

  // scroll to bottom when messages change
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, activeTab]);

  const handleSubmit = async (tab_id: number) => {
    if (input.trim() === "" || !activeTab) return;

    const newMessage: Message = {
      id: Date.now(),
      tab_id: tab_id,
      content: {
        text: input,
      },
      is_user: true,
    };
    setMessages((prev) => ({
      ...prev,
      [tab_id]: [...(prev[tab_id] ?? []), newMessage],
    }));

    setInput("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FOLIO_API_URL}/chat/investment-query`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tab_id: tab_id,
            thesis: input,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data || !data.error) {
        toast.error("An error occurred, please try again later");
        return;
      }

      const newResponse: Message = {
        id: Date.now() + 1,
        tab_id: tab_id,
        content: data,
        is_user: false,
      };
      setMessages((prev) => ({
        ...prev,
        [tab_id]: [...(prev[tab_id] ?? []), newResponse],
      }));
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred, please try again later");
      return;
    }

    // const newQuery = data[0] as Message;

    // setMessages((prev) => ({
    //   ...prev,
    //   [activeTab]: [...(prev[activeTab] ?? []), newQuery],
    // }));
  };

  return (
    <>
      {tabs.map((tab) => (
        <TabsContent
          key={tab.id}
          value={tab.id.toString()}
          className="h-screen w-[calc(100%-256px)] py-4 pl-4 pr-16"
        >
          <div className="flex h-full w-full flex-col items-center justify-between rounded-2xl border-[0.5px] p-6">
            <div
              ref={tab.id === activeTab ? chatRef : undefined}
              className="mb-6 flex w-full flex-col gap-2 overflow-y-auto"
            >
              {isLoading[tab.id] ? (
                <div className="flex justify-center py-4">
                  <div className="text-sm text-muted-foreground">
                    Loading messages...
                  </div>
                </div>
              ) : (
                messages[tab.id]?.map((message) => (
                  <div
                    key={message.id}
                    className={`max-w-5xl ${message.is_user ? "ml-auto" : "mr-auto"}`}
                  >
                    <div
                      className={`rounded-xl p-3 text-sm text-muted-foreground ${message.is_user ? "rounded-br-none bg-primary text-primary-foreground" : "rounded-bl-none bg-muted"}`}
                    >
                      {message.is_user && message.content.text}
                      {!message.is_user && message.content.portfolio && (
                        <Response
                          components={
                            message.content.portfolio.portfolio_components
                          }
                          active={activeTab === tab.id}
                        />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex w-full flex-col items-center justify-center gap-4 text-center">
              {(!messages[tab.id] || messages[tab.id]?.length === 0) && (
                <div className="text-sm text-border">
                  e.g., generate a portfolio of agentic AI companies
                </div>
              )}
              <div className="relative flex w-3/5 max-w-xl items-center justify-center">
                <Input
                  placeholder="What are you looking for? Give us a brief description."
                  className="h-fit w-full rounded-3xl border-[0.5px] px-6 py-4 placeholder:text-center placeholder:text-border"
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      void handleSubmit(tab.id);
                    }
                  }}
                  autoComplete="off"
                  autoCorrect="off"
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full"
                  onClick={() => handleSubmit(tab.id)}
                >
                  <ArrowUpCircle className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      ))}
    </>
  );
}
