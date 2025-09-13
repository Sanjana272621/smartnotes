"use client";
import { useState } from "react";

function ChatInterface({ pdfId }: { pdfId: string }) {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;
    const newMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, newMsg]);

    const res = await fetch(`/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pdfId, question: input }),
    });
    const data = await res.json();

    setMessages((prev) => [...prev, { role: "assistant", text: data.answer }]);
    setInput("");
  };

  return (
    <div className="mt-4">
      <div className="border rounded p-2 h-64 overflow-y-auto">
        {messages.map((msg, i) => (
          <p key={i} className={msg.role === "user" ? "text-blue-600" : "text-green-600"}>
            <strong>{msg.role}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border rounded flex-1 p-2"
          placeholder="Ask a question..."
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 rounded">
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatInterface;