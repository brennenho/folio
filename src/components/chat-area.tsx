"use client";

import { DocumentTab } from "@/components/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import { ArrowUpCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  id: number;
  content: string;
  isUser: boolean;
  tab_id: number;
}

interface ChatAreaProps {
  activeTab: number;
  tabs: DocumentTab[];
}

export function ChatArea({ activeTab, tabs }: ChatAreaProps) {
  const chatRef = useRef<HTMLDivElement>(null);
  const [messagesMap, setMessagesMap] = useState<Record<number, ChatMessage[]>>(
    {},
  );
  const [input, setInput] = useState("");
  const supabase = createClient();

  // Initialize messages for each tab
  useEffect(() => {
    const fetchMessages = async () => {
      // You could fetch messages from Supabase here for each tab
      const initialMessagesMap: Record<number, ChatMessage[]> = {};

      tabs.forEach((tab) => {
        initialMessagesMap[tab.id] = [];
      });

      setMessagesMap(initialMessagesMap);
    };

    if (tabs.length > 0) {
      fetchMessages();
    }
  }, [tabs]);

  // scroll to bottom when messages change
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messagesMap, activeTab]);

  const handleSubmit = () => {
    if (input.trim() === "" || !activeTab) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      content: input,
      isUser: true,
      tab_id: activeTab,
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] || []), newMessage],
    }));

    setInput("");

    // Simulate a response from the assistant
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        content: "This is a simulated response for tab " + activeTab,
        isUser: false,
        tab_id: activeTab,
      };

      setMessagesMap((prev) => ({
        ...prev,
        [activeTab]: [...(prev[activeTab] || []), assistantMessage],
      }));
    }, 1000);
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
              {messagesMap[tab.id]?.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-3xl ${message.isUser ? "ml-auto" : "mr-auto"}`}
                >
                  <div
                    className={`rounded-xl p-3 ${message.isUser ? "rounded-br-none bg-primary text-primary-foreground" : "rounded-bl-none bg-muted"}`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-4 text-center">
              {(!messagesMap[tab.id] || messagesMap[tab.id]?.length === 0) && (
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
                      handleSubmit();
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
                  onClick={handleSubmit}
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
