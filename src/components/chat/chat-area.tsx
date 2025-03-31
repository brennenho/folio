"use client";

import { DocumentTab } from "@/components/chat/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import { ArrowUpCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Query {
  id: number;
  tab_id: number;
  content: string;
  is_user: boolean;
}

interface ChatAreaProps {
  activeTab: number;
  tabs: DocumentTab[];
}

export function ChatArea({ activeTab, tabs }: ChatAreaProps) {
  const chatRef = useRef<HTMLDivElement>(null);
  const [queries, setQueries] = useState<Record<number, Query[]>>({});
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState<Record<number, boolean>>({});
  const supabase = createClient();

  // load messages when component mounts or activeTab changes
  useEffect(() => {
    if (!activeTab) return;

    const loadMessages = async (tabId: number) => {
      // skip if we've already loaded messages for this tab
      if (queries[tabId] && queries[tabId].length > 0) return;

      setIsLoading((prev) => ({ ...prev, [tabId]: true }));

      const { data, error } = await supabase
        .from("queries")
        .select("*")
        .eq("tab_id", tabId)
        .order("timestamp", { ascending: true });

      if (error) {
        toast.error("An error occurred while fetching message history");
      } else {
        setQueries((prev) => ({
          ...prev,
          [tabId]: data as Query[],
        }));
      }

      setIsLoading((prev) => ({ ...prev, [tabId]: false }));
    };

    loadMessages(activeTab);
  }, [activeTab, supabase]);

  // scroll to bottom when messages change
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [queries, activeTab]);

  const handleSubmit = async (tab_id: number) => {
    if (input.trim() === "" || !activeTab) return;

    const { data, error } = await supabase
      .from("queries")
      .insert([
        {
          tab_id: tab_id,
          content: input,
          is_user: true,
        },
      ])
      .select();

    if (error || !data) {
      toast.error("An error occurred, please try again later");
      return;
    }

    const newQuery = data[0] as Query;

    setQueries((prev) => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] || []), newQuery],
    }));

    setInput("");
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
                queries[tab.id]?.map((message) => (
                  <div
                    key={message.id}
                    className={`max-w-3xl ${message.is_user ? "ml-auto" : "mr-auto"}`}
                  >
                    <div
                      className={`rounded-xl p-3 ${message.is_user ? "rounded-br-none bg-primary text-primary-foreground" : "rounded-bl-none bg-muted"}`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-4 text-center">
              {(!queries[tab.id] || queries[tab.id]?.length === 0) && (
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
                      handleSubmit(tab.id);
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
