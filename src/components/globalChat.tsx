import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useAppSelector } from "../hooks/reduxHooks";

interface ChatMessage {
  sender: string;
  text: string;
}

function GlobalChat() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const newSocket = io("http://localhost:8000");

    newSocket.on("connect", () => {
      setConnected(true);
    });

    newSocket.on("disconnect", () => {
      setConnected(false);
    });

    newSocket.on("chatHistory", (history: ChatMessage[]) => {
      setMessages(history);
    });

    newSocket.on("receiveMessage", (newMessage: ChatMessage) => {
      setMessages((previousMessages) => [...previousMessages, newMessage]);
    });

    newSocket.on("messageError", (errorMessage: string) => {
      setError(errorMessage);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user?.name || !message.trim() || !socket) {
      return;
    }

    setError("");

    socket.emit("sendMessage", {
      sender: user.name,
      text: message.trim(),
    });

    setMessage("");
  };

  return (
    <div className="global-chat">
      <div className="chat-header">
        <div>
          <h2>Global Workspace Chat</h2>
          <p>Chat with everyone in your workspace.</p>
        </div>

        <span
          className={`chat-connection ${
            connected ? "chat-connected" : "chat-disconnected"
          }`}
        >
          <span className="chat-status-dot" />
          {connected ? "Connected" : "Disconnected"}
        </span>
      </div>

      <div className="chat-user-info">
        <div className="chat-avatar">
          {(user?.name || "U").charAt(0).toUpperCase()}
        </div>

        <div>
          <span className="chat-user-label">Chatting as</span>
          <strong>{user?.name || "User"}</strong>
        </div>
      </div>

      <div className="chat-messages" aria-live="polite">
        {messages.length === 0 ? (
          <div className="chat-empty">
            <h3>No messages yet</h3>
            <p>Start the conversation with your team!</p>
          </div>
        ) : (
          messages.map((item, index) => (
            <div className="chat-message" key={`${index}-${item.sender}`}>
              <div className="chat-message-avatar">
                {item.sender.charAt(0).toUpperCase()}
              </div>

              <div className="chat-message-content">
                <strong>{item.sender}</strong>
                <p>{item.text}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {error && (
        <p className="chat-error" role="alert">
          {error}
        </p>
      )}

      <form className="chat-form" onSubmit={handleSendMessage}>
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Write a message..."
          aria-label="Write a chat message"
          required
        />

        <button type="submit" disabled={!connected || !message.trim()}>
          Send
        </button>
      </form>

      {!connected && (
        <p className="chat-connection-hint">Connecting to chat server...</p>
      )}
    </div>
  );
}

export default GlobalChat;
