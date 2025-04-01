"use client";

import type { DocumentTab } from "@/components/chat/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import { MoreVertical, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface TabBarProps {
  activeTab: number;
  setActiveTab: (id: number) => void;
  tabs: DocumentTab[];
  setTabs: (tabs: DocumentTab[]) => void;
}

export function TabBar({
  activeTab,
  setActiveTab,
  tabs,
  setTabs,
}: TabBarProps) {
  const [editingTabId, setEditingTabId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const addTab = async () => {
    const user = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("tabs")
      .insert([
        {
          name: `Tab ${tabs.length + 1}`,
          user_id: user.data.user?.id,
        },
      ])
      .select();

    if (error || !data) {
      toast.error("An error occurred creating a new tab");
      return;
    }
    const newTab = data[0] as DocumentTab;
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
  };

  const deleteTab = async (id: number) => {
    const { error } = await supabase.from("tabs").delete().eq("id", id);
    if (error) {
      toast.error("An error occurred deleting the tab");
      return;
    }
    setTabs(tabs.filter((tab: DocumentTab) => tab.id !== id));
  };

  const startRenaming = (id: number, currentName: string) => {
    setEditingTabId(id);
    setEditingName(currentName);
    // Focus the input after it's rendered
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const saveRename = async () => {
    if (editingTabId) {
      const newName = editingName.trim() || `Tab ${tabs.length + 1}`;

      const { error } = await supabase
        .from("tabs")
        .update({ name: newName })
        .eq("id", editingTabId);

      if (error) {
        toast.error("Failed to update tab name");
        return;
      }

      // update local state
      const updatedTabs = tabs.map((tab: DocumentTab) =>
        tab.id === editingTabId ? { ...tab, name: newName } : tab,
      );
      setTabs(updatedTabs);

      setEditingTabId(null);
    }
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      void saveRename();
    } else if (e.key === "Escape") {
      setEditingTabId(null);
    }
  };

  useEffect(() => {
    if (tabs.length > 0 && !tabs.find((tab) => tab.id === activeTab)) {
      setActiveTab(tabs[tabs.length - 1]?.id ?? tabs[0]?.id ?? 0);
    }
  }, [tabs, activeTab, setActiveTab]);

  return (
    <div className="mx-4 flex h-screen w-64 flex-col pt-20">
      <div className="mb-6 flex items-center justify-between border-b pb-6">
        <h2 className="font-instrument-sans font-medium">Document tabs</h2>
        <Button variant="ghost" size="icon" onClick={addTab}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="mb-4 flex-1">
        <TabsList className="flex flex-col gap-2 overflow-y-auto">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center justify-between rounded-2xl ${tab.id == activeTab ? "bg-foreground text-background" : "hover:bg-accent"}`}
              onClick={() => editingTabId !== tab.id && setActiveTab(tab.id)}
            >
              <TabsTrigger
                value={tab.id.toString()}
                className="w-full px-4 py-2"
              >
                {editingTabId === tab.id ? (
                  <Input
                    ref={inputRef}
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={saveRename}
                    onKeyDown={handleRenameKeyDown}
                    className="border-0 bg-foreground p-0 text-background"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="flex h-9 items-center text-left text-base md:text-sm">
                    {tab.name}
                  </span>
                )}
              </TabsTrigger>
              {editingTabId !== tab.id && (
                <div
                  className="flex items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="link"
                        size="icon"
                        className={`${tab.id == activeTab ? "text-background" : "text-foreground"}`}
                      >
                        <MoreVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => startRenaming(tab.id, tab.name)}
                      >
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        disabled={tabs.length === 1}
                        onClick={() => deleteTab(tab.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          ))}
        </TabsList>
      </ScrollArea>
    </div>
  );
}
