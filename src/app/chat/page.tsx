"use client";

import { useState, useEffect } from "react";
import { Search, Home, Upload, Send, Plus } from "lucide-react";
import { Folio } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Tab {
  id: string;
  name: string;
}

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatPage() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Fetch user's tabs on component mount
  useEffect(() => {
    async function fetchTabs() {
      try {
        const response = await fetch("http://localhost:3000/api/tabs");
        if (!response.ok) throw new Error("Failed to fetch tabs");

        const data = await response.json();
        setTabs(data);

        // Set the first tab as active if there are tabs
        if (data.length > 0) {
          setActiveTab(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching tabs:", error);
        toast.error("Failed to load your documents");
      }
    }

    fetchTabs();
  }, []);

  // Handle search functionality
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/search?q=${encodeURIComponent(searchQuery)}`,
      );
      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();

      // Add the search result as a bot message
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        content: data.result || "No results found for your query.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages([...messages, newMessage]);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputMessage, tabId: activeTab }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();

      // Add bot response to chat
      const botMessage: ChatMessage = {
        id: Date.now().toString() + "-response",
        content: data.response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to get a response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new tab
  const handleCreateTab = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/tabs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: `Tab ${tabs.length + 1}` }),
      });

      if (!response.ok) throw new Error("Failed to create tab");

      const newTab = await response.json();
      setTabs([...tabs, newTab]);
      setActiveTab(newTab.id);
      setMessages([]);
    } catch (error) {
      console.error("Error creating tab:", error);
      toast.error("Failed to create a new tab");
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left Sidebar */}
      <div className="flex w-[300px] flex-col border-r">
        <div className="flex h-16 items-center justify-between border-b px-4">
          <h2 className="text-lg font-medium">Document tabs</h2>
          <Button variant="ghost" size="icon" onClick={handleCreateTab}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Tabs List */}
        <div className="flex-1 overflow-auto p-2">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`mb-2 flex cursor-pointer items-center justify-between rounded-md p-2 ${
                activeTab === tab.id ? "bg-secondary" : "hover:bg-secondary/50"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="truncate">{tab.name}</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="sr-only">Menu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </Button>
            </div>
          ))}
        </div>

        {/* Navigation Icons */}
        <div className="flex flex-col items-center space-y-4 border-t p-4">
          <div className="rounded-full border p-2">
            <Search
              className="h-6 w-6 cursor-pointer"
              onClick={() => {
                setSearchQuery("");
                document.getElementById("search-input")?.focus();
              }}
            />
          </div>
          <Link href="/dashboard" className="rounded-full border p-2">
            <Home className="h-6 w-6" />
          </Link>
          <Link href="/" className="rounded-full border p-2">
            <Folio className="h-6 w-6" />
          </Link>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Top Search Bar */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search-input"
              className="w-full pl-10"
              placeholder="e.g., generate a portfolio of agentic AI companies"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          </div>
          <div className="ml-4 flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Upload className="h-4 w-4" />
              <span className="sr-only">Upload</span>
            </Button>
            <div className="h-8 w-8 rounded-full bg-primary"></div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-auto p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex ${
                message.isUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <p>{message.content}</p>
                <div className="mt-1 text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg bg-secondary p-3 text-secondary-foreground">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-current"></div>
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-current"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-current"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex items-center gap-2">
            <Input
              className="flex-1"
              placeholder="What are you looking for? Give us a brief description."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
