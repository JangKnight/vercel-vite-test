import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "./Auth.tsx";

type ChatMessage = {
  id: string;
  sender: string;
  body: string;
  mine: boolean;
  sentAt: string | null;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const parseIncomingMessage = (
  rawMessage: string,
  currentSender: string,
): ChatMessage => {
  try {
    const parsed = JSON.parse(rawMessage);

    if (
      isRecord(parsed) &&
      typeof parsed.body === "string" &&
      typeof parsed.sender === "string"
    ) {
      return {
        id: `${parsed.sender}-${parsed.sentAt ?? Date.now()}-${rawMessage.length}`,
        sender: parsed.sender,
        body: parsed.body,
        mine: parsed.sender === currentSender,
        sentAt: typeof parsed.sentAt === "string" ? parsed.sentAt : null,
      };
    }
  } catch {
    // Ignore parse failures and fall back to plain text messages.
  }

  return {
    id: `${Date.now()}-${rawMessage.length}`,
    sender: "Unknown",
    body: rawMessage,
    mine: false,
    sentAt: null,
  };
};

const Chat = () => {
  const { room = "general" } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const senderName = user?.username ?? user?.name ?? "Guest";
  const wsBaseUrl =
    import.meta.env.VITE_WS_URL ||
    import.meta.env.VITE_URL.replace(/^http/, "ws");

  useEffect(() => {
    const ws = new WebSocket(`${wsBaseUrl}/ws/${room}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      setMessages((prev) => [
        ...prev,
        parseIncomingMessage(event.data, senderName),
      ]);
    };

    ws.onclose = () => {
      console.log("Disconnected from chat");
    };

    return () => {
      ws.close();
    };
  }, [room, senderName, wsBaseUrl]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          sender: senderName,
          body: input.trim(),
          sentAt: new Date().toISOString(),
        }),
      );
      setInput("");
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl mb-8 text-center">Chat: {room}</h2>
        <div className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isAuthenticated ? "bg-emerald-400" : "bg-slate-500"
              }`}
            />
            {isAuthenticated
              ? `Logged in as ${senderName}`
              : "Chatting as Guest"}
          </span>
        </div>
        {!isAuthenticated ? (
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <Link
              to="/demos/login"
              className="inline-flex rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Log in
            </Link>
          </div>
        ) : null}

        <div className="flex h-125 flex-col rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-2xl">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <p className="mt-8 text-center text-gray-400">
                No messages yet. Say something!
              </p>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-3xl px-4 py-3 shadow ${
                    message.mine
                      ? "rounded-br-md bg-cyan-500 text-slate-950"
                      : "rounded-bl-md bg-white text-slate-900"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between gap-4 text-xs uppercase tracking-[0.2em]">
                    <span
                      className={
                        message.mine ? "text-slate-900/70" : "text-slate-500"
                      }
                    >
                      {message.mine ? "You" : message.sender}
                    </span>
                    {message.sentAt ? (
                      <span
                        className={
                          message.mine ? "text-slate-900/70" : "text-slate-400"
                        }
                      >
                        {new Date(message.sentAt).toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    ) : null}
                  </div>
                  <p className="mb-0 whitespace-pre-wrap break-words">
                    {message.body}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2 border-t border-white/10 p-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 rounded-2xl border border-white/10 bg-slate-900 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <button
              onClick={sendMessage}
              className="rounded-2xl bg-cyan-500 px-6 py-2 font-semibold text-slate-950 transition-colors hover:bg-cyan-400"
            >
              Send
            </button>
          </div>
        </div>
        <div className="text-sm text-gray-500 mt-4 text-center">
          Note: Make your own chat room by adding chat room name to url
          (/chat/your-room-name)
        </div>
      </div>
    </section>
  );
};

export default Chat;
