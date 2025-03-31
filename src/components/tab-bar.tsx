"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { MoreVertical, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface DocumentTab {
  id: number;
  name: string;
}

export function TabBar() {
  const [tabs, setTabs] = useState<DocumentTab[]>([]);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [editingTabId, setEditingTabId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
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

          console.log("newTab", newTab);

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
    setTabs((prevTabs) => [...prevTabs, newTab]);
    setActiveTab(newTab.id);
  };

  const deleteTab = async (id: number) => {
    const { data, error } = await supabase.from("tabs").delete().eq("id", id);
    if (error) {
      toast.error("An error occurred deleting the tab");
      return;
    }
    setTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== id));
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
      setTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.id === editingTabId ? { ...tab, name: newName } : tab,
        ),
      );

      setEditingTabId(null);
    }
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveRename();
    } else if (e.key === "Escape") {
      setEditingTabId(null);
    }
  };

  useEffect(() => {
    if (tabs.length > 0 && !tabs.find((tab) => tab.id === activeTab)) {
      setActiveTab(tabs[tabs.length - 1]?.id ?? tabs[0]?.id ?? 0);
    }
  }, [tabs, activeTab]);

  return (
    <div className="mx-4 w-64 pt-20">
      <div className="mb-6 flex items-center justify-between border-b pb-6">
        <h2 className="font-instrument-sans font-medium">Document tabs</h2>
        <Button variant="ghost" size="icon" onClick={addTab}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex cursor-pointer items-center justify-between rounded-2xl px-4 py-2 ${tab.id == activeTab ? "bg-foreground text-background" : "hover:bg-accent"}`}
            onClick={() => editingTabId !== tab.id && setActiveTab(tab.id)}
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
              <span className="flex h-9 items-center text-base md:text-sm">
                {tab.name}
              </span>
            )}
            {editingTabId !== tab.id && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="link"
                    size="icon"
                    className={`${tab.id == activeTab ? "text-background" : "text-foreground"}`}
                    onClick={(e) => e.stopPropagation()}
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
