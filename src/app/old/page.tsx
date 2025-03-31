"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ArrowUp, Home, MoreVertical, Plus, Search, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface DocumentTab {
  id: string;
  name: string;
  active?: boolean;
}

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
}

export default function ChatPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [documentTabs, setDocumentTabs] = useState<DocumentTab[]>([
    { id: "1", name: "Tab 1", active: true },
  ]);
  const [isSearching, setIsSearching] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Fetch document tabs on component mount
  useEffect(() => {
    fetchDocumentTabs();
  }, []);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchDocumentTabs = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/document-tabs");
      if (response.ok) {
        const data = await response.json();
        setDocumentTabs(data);
      } else {
        console.error("Failed to fetch document tabs");
      }
    } catch (error) {
      console.error("Error fetching document tabs:", error);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      await fetch(
        `http://localhost:3000/api/search?q=${encodeURIComponent(query)}`,
      );
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  const handleAddTab = async () => {
    try {
      await fetch("http://localhost:3000/api/document-tabs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: `Tab ${documentTabs.length + 1}` }),
      });

      fetchDocumentTabs();
    } catch (error) {
      console.error("Error adding tab:", error);
    }
  };

  const handleTabClick = (tabId: string) => {
    setDocumentTabs(
      documentTabs.map((tab) => ({
        ...tab,
        active: tab.id === tabId,
      })),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputValue }),
      });

      if (response.ok) {
        const data = await response.json();

        // Add AI response
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content:
            data.response || "I'm sorry, I couldn't process that request.",
          isUser: false,
        };

        setMessages((prev) => [...prev, aiMessage]);
      } else {
        // Add error message
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: "Sorry, there was an error processing your request.",
          isUser: false,
        };

        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);

      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, there was an error connecting to the server.",
        isUser: false,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar (Island)*/}
      <div className="fixed top-1/2 z-10 -translate-y-1/2 md:left-12">
        <div className="flex flex-col items-center gap-7 rounded-full border border-border bg-background px-5 py-7 shadow-md">
          <button
            onClick={() => setIsSearching(!isSearching)}
            className="rounded-full p-2.5 hover:bg-accent"
            aria-label="Search"
          >
            <Search className="h-6 w-6" />
          </button>

          <Link
            href="/dashboard"
            className="rounded-full p-2.5 hover:bg-accent"
            aria-label="Dashboard"
          >
            <Home className="h-6 w-6" />
          </Link>

          <Link
            href="/"
            className="rounded-full p-2.5 hover:bg-accent"
            aria-label="Landing Page"
          >
            <Image src="/favicon.ico" alt="File" width={24} height={24} />
          </Link>
        </div>
      </div>

      {/* Main content wrapper with adjusted margin */}
      <div className="ml-24 flex flex-1 md:ml-40">
        <div className="flex flex-1">
          {/* Document Tabs Sidebar */}
          <div className="mt-20 w-64 border-r-0">
            <div className="flex items-center justify-between p-4">
              <h2 className="font-instrument-sans font-medium">
                Document tabs
              </h2>
              <Button variant="ghost" size="icon" onClick={handleAddTab}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Shorter horizontal line */}
            <div className="mx-4 mb-10 mt-4 border-t border-border" />

            {/* Tab items with padding aligned to header */}
            <div className="mt-4 overflow-y-auto px-4">
              {documentTabs.map((tab) => (
                <div
                  key={tab.id}
                  className={`font-instrument-sans mb-1 flex cursor-pointer items-center justify-between rounded-2xl p-2 ${
                    tab.active ? "bg-black text-white" : "hover:bg-accent"
                  }`}
                  onClick={() => handleTabClick(tab.id)}
                >
                  <span className="pl-2">{tab.name}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Rename</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>

            {isSearching && (
              <div className="border-t border-border p-2">
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Chat Area - moved higher */}
          <div className="relative mt-10 flex-1">
            {/* Chat container with responsive spacing */}
            <div className="absolute inset-y-0 left-0 right-0 rounded-tl-3xl rounded-tr-3xl border-l border-r border-t border-border bg-background shadow-sm md:right-[8%]">
              {/* Chat Messages */}
              <div
                ref={chatContainerRef}
                className="h-[calc(100%-80px)] overflow-y-auto p-6"
                style={{ color: "#898989" }}
              >
                {messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center">
                    {/* Empty state - no longer needed here as we're moving it above the input */}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`max-w-3xl ${message.isUser ? "ml-auto" : "mr-auto"}`}
                      >
                        <div
                          className={`rounded-lg p-3 ${message.isUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {isLoading && (
                  <div className="mr-auto max-w-3xl">
                    <div className="rounded-lg bg-muted p-3">
                      <div className="flex space-x-2">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground delay-75"></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground delay-150"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input with example text positioned above */}
              <div className="absolute bottom-[10%] left-0 right-0">
                {/* Example text positioned above the input */}
                {messages.length === 0 && (
                  <div
                    className="mb-5 text-center"
                    style={{ color: "#898989" }}
                  >
                    e.g., generate a portfolio of agentic AI companies
                  </div>
                )}

                <div className="flex justify-center">
                  <form
                    onSubmit={handleSubmit}
                    className="relative w-[60%] max-w-xl rounded-lg"
                  >
                    <Input
                      placeholder="What are you looking for? Give us a brief description."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="font-instrument-sans rounded-full py-8 pr-10 text-black placeholder:text-center placeholder:text-base placeholder:text-[#898989]"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full"
                      disabled={!inputValue.trim() || isLoading}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>

            {/* User profile button */}
            <div className="absolute right-6 top-6 z-10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-full"
                  >
                    <User className="h-7 w-7" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
