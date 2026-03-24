import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const Chat = () => {
  const { room = "general" } = useParams();
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/ws/${room}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    ws.onclose = () => {
      console.log("Disconnected from chat");
    };

    return () => {
      ws.close();
    };
  }, [room]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(input);
      setInput("");
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl mb-8 text-center">Chat: {room}</h2>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.length === 0 && (
              <p className="text-gray-400 text-center mt-8">
                No messages yet. Say something!
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className="bg-blue-50 rounded-lg px-4 py-2 text-gray-800"
              >
                {msg}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 p-4 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 text-gray-800 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
