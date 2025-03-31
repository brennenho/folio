"use client";

import { ChatArea } from "@/components/chat-area";
import { TabBar } from "@/components/tab-bar";
import { Tabs } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface DocumentTab {
  id: number;
  name: string;
}

export function Chat() {
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [tabs, setTabs] = useState<DocumentTab[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchTabs = async () => {
      const user = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("tabs")
        .select("*")
        .eq("user_id", user.data.user?.id);
      if (error) {
        toast.error("An error occurred fetching chat history");
      } else {
        if (!data || data.length === 0) {
          const { data: newTab, error: tabError } = await supabase
            .from("tabs")
            .insert([
              {
                name: `Tab 1`,
                user_id: user.data.user?.id,
              },
            ])
            .select();

          if (tabError || !newTab || newTab.length === 0) {
            toast.error("Error creating initial tab");
            return;
          }

          setTabs(newTab as DocumentTab[]);
          setActiveTab(newTab[0].id);
        } else {
          setTabs(data as DocumentTab[]);
          setActiveTab(data[data.length - 1].id);
        }
      }
    };

    fetchTabs();
  }, [supabase]);

  if (!activeTab) {
    return <div>Loading...</div>;
  }

  return (
    <Tabs
      orientation="vertical"
      className="flex w-full"
      value={activeTab.toString()}
    >
      <TabBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={tabs}
        setTabs={setTabs}
      />
      <ChatArea tabs={tabs} activeTab={activeTab} />
    </Tabs>
  );
}
