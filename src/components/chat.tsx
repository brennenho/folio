"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpCircle } from "lucide-react";
import { useState } from "react";

interface ChatMessage {
  id: number;
  content: string;
  isUser: boolean;
}

export function ChatArea() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (input.trim() === "") return;
    const newMessage: ChatMessage = {
      id: messages.length + 1,
      content: input,
      isUser: true,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");
    // Simulate a response from the assistant
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: messages.length + 2,
        content: "This is a simulated response.",
        isUser: false,
      };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    }, 1000);
  };

  return (
    <div className="h-screen w-full py-4 pr-16">
      <div className="flex h-full w-full flex-col items-center justify-between rounded-2xl border-[0.5px] p-6">
        <div className="flex w-full flex-col gap-2 overflow-y-auto">
          {messages.map((message) => (
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
          {messages.length === 0 && (
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
    </div>
  );
}
