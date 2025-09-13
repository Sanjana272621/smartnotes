"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ChatPage() {
  const { slug } = useParams(); // pdfId
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { role: "user", text: input }]);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pdfId: slug, question: input }),
    });
    const data = await res.json();

    setMessages((m) => [...m, { role: "assistant", text: data.answer || "No answer" }]);
    setInput("");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Chat about PDF: {slug}</h1>
      <div className="border rounded p-3 h-80 overflow-y-auto space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={msg.role === "user" ? "text-blue-700" : "text-green-700"}
          >
            <b>{msg.role}:</b> {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}
