"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface DocumentTab {
  id: number;
  name: string;
}

export function TabBar() {
  const [tabs, setTabs] = useState<DocumentTab[]>([{ id: 1, name: "Tab 1" }]);
  const [activeTab, setActiveTab] = useState<number>(1);

  const addTab = () => {
    // TODO: implement db call
    const newId = (tabs[tabs.length - 1]?.id ?? 0) + 1;
    const newTab: DocumentTab = {
      id: newId,
      name: `Tab ${newId}`,
    };
    setTabs((prevTabs) => [...prevTabs, newTab]);
    setActiveTab(newTab.id);
  };

  const deleteTab = (id: number) => {
    setTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== id));
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
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.id}</span>
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
                <DropdownMenuItem>Rename</DropdownMenuItem>
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
        ))}
      </div>
    </div>
  );
}
