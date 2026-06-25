"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";

type ChatRole = "user" | "assistant";

type ChatLine = {
  role: ChatRole;
  content: string;
  pending?: boolean;
};

async function fetchChatResponse(payload: {
  message: string;
  history: Array<{ role: ChatRole; content: string }>;
  previous_interaction_id: string | null;
  temperature: number;
}) {
  const response = await fetch(`/api/v1/chat`, {
    method: "POST",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Chat request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<{
    answer: string;
    interaction_id?: string | null;
  }>;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatLine[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [previousInteractionId, setPreviousInteractionId] = useState<string | null>(null);
  const listEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text || isSending) return;

    const userMessage: ChatLine = { role: "user", content: text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    const payload = {
      message: text,
      history: nextMessages.map((message) => ({ role: message.role, content: message.content })),
      previous_interaction_id: previousInteractionId,
      temperature: 0.2,
    };

    try {
      const data = await fetchChatResponse(payload);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.answer,
          pending: false,
        },
      ]);
      setPreviousInteractionId(data.interaction_id ?? null);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "I couldn’t load the reply right now. Try again in a moment.",
          pending: false,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();
    if (!isSending) {
      void handleSubmit({ preventDefault: () => undefined } as FormEvent<HTMLFormElement>);
    }
  }

  return (
    <div className="min-h-screen px-4 pb-6 pt-24 text-zinc-900 sm:px-6 sm:pt-28 lg:px-8 lg:pt-32 dark:text-white">
      <main className="mx-auto flex h-[calc(100vh-7rem)] max-w-5xl flex-col overflow-hidden rounded-[2.25rem] border border-zinc-900/10 bg-white/80 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:h-[calc(100vh-8rem)]">
        <div className="flex items-center gap-4 border-b border-zinc-900/10 px-5 py-4 dark:border-white/10 sm:px-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-900/10 bg-zinc-900 text-sm font-semibold text-white dark:border-white/10 dark:bg-white dark:text-black">
            AK
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">Abdullah Khan</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Direct chat with my avatar</p>
          </div>
          <div className="ml-auto text-xs uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400">
            Ask anything
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-zinc-900/10 bg-zinc-900/5 p-6 text-sm text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-400">
                Start with a question about projects, skills, or experience.
              </div>
            ) : null}

            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[min(42rem,90%)] rounded-[1.5rem] px-4 py-3 text-sm leading-relaxed shadow-lg ${
                    message.role === "user"
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                      : "border border-zinc-900/10 bg-white text-zinc-900 dark:border-white/10 dark:bg-zinc-950/70 dark:text-zinc-100"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={listEndRef} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="border-t border-zinc-900/10 p-4 dark:border-white/10 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleComposerKeyDown}
              rows={3}
              placeholder="Ask me anything about the portfolio..."
              className="min-h-24 flex-1 rounded-[1.25rem] border border-zinc-900/10 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-zinc-900/30 dark:border-white/10 dark:bg-black/30 dark:focus:border-white/30"
            />
            <button
              type="submit"
              disabled={isSending}
              className="rounded-[1.25rem] bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black"
            >
              {isSending ? "..." : "Send"}
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between gap-2 text-xs uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400">
            <Link href="/" className="transition hover:text-zinc-900 dark:hover:text-white">
              Back home
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
