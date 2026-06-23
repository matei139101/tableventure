import { Navigate, useParams } from "react-router-dom";
import { useAuth } from '@/context/AuthContext';
import { GameStateProvider, useGameState } from "../../context/GameStateContext";
import { colors } from "@/Theme";
import { useEffect, useRef } from "react";

export default function Play() {
  const { id } = useParams();
  const { loading, user } = useAuth();
  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/" replace />;
  return (
    <GameStateProvider adventureId={id}>
      <PlayContent />
    </GameStateProvider>
  );
}

function PlayContent() {
  const { messages, sendTurn, undoMessage } = useGameState();
  const feedEndRef = useRef(null);

  const handleSend = () => {
    const input = document.getElementById('message-input');
    const message = input.value;
    sendTurn(message);
    input.value = "";
  };

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>The Path Ahead</h1>
      </header>
      <div style={styles.feed}>
        {messages.map(message => {
          const isPlayer = message.sender === "Player";
          return (
            <div
              key={message.id}
              style={{
                ...styles.message,
                ...(isPlayer ? styles.messagePlayer : styles.messageNarrator),
              }}
            >
              <span style={isPlayer ? styles.senderPlayer : styles.senderNarrator}>
                {message.sender}
              </span>
              <p style={isPlayer ? styles.text : styles.textNarrator}>
                {message.text}
              </p>
            </div>
          );
        })}
        <div ref={feedEndRef} />
      </div>
      <div style={styles.controls}>
        <input
          id="message-input"
          placeholder="What do you do?"
          style={styles.input}
          onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
        />
        <button style={styles.sendButton} onClick={handleSend}>Send</button>
        <button style={styles.button} onClick={undoMessage}>Undo</button>
      </div>
    </div>
  );
}
const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    height: "95vh",
    background: colors.background,
    backgroundImage: `radial-gradient(ellipse at top, rgba(156, 59, 46, 0.08), transparent 60%)`,
    color: colors.text,
    fontFamily: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    overflow: "hidden",
  },
  header: {
    flexShrink: 0,
    padding: "1.1rem 1.5rem 0.9rem",
    borderBottom: `1px solid ${colors.rule}`,
    background: "linear-gradient(to bottom, rgba(0,0,0,0.25), transparent)",
  },
  headerTitle: {
    margin: 0,
    fontSize: "0.78rem",
    fontWeight: 600,
    letterSpacing: "0.28em",
    textTransform: "uppercase",
    color: colors.special,
  },
  feed: {
    flex: 1,
    overflowY: "auto",
    padding: "1.75rem 1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.4rem",
  },
  message: { maxWidth: "60%", display: "flex", flexDirection: "column" },
  messagePlayer: { alignSelf: "flex-end", textAlign: "right" },
  messageNarrator: { alignSelf: "flex-start", textAlign: "left" },
  senderPlayer: {
    display: "block", fontSize: "0.68rem", letterSpacing: "0.22em",
    textTransform: "uppercase", marginBottom: "0.35rem", color: colors.accent,
  },
  senderNarrator: {
    display: "block", fontSize: "0.68rem", letterSpacing: "0.22em",
    textTransform: "uppercase", marginBottom: "0.35rem", color: colors.special,
  },
  text: { margin: 0, fontSize: "1.05rem", lineHeight: 1.6, color: colors.text },
  textNarrator: {
    margin: 0, fontSize: "1.05rem", lineHeight: 1.6,
    fontStyle: "italic", color: "#d8cdb9",
  },
  controls: {
    flexShrink: 0, display: "flex", gap: "0.6rem",
    padding: "1rem 1.5rem 1.4rem", background: colors.primary,
    borderTop: `1px solid ${colors.rule}`,
  },
  input: {
    flex: 1, background: colors.background, border: `1px solid ${colors.rule}`,
    borderRadius: "3px", padding: "0.75rem 0.9rem", color: colors.text,
    fontFamily: "inherit", fontSize: "1rem",
  },
  button: {
    border: `1px solid ${colors.rule}`, borderRadius: "3px", background: "transparent",
    color: colors.text, fontFamily: "inherit", fontSize: "0.78rem",
    letterSpacing: "0.12em", textTransform: "uppercase", padding: "0 1.1rem", cursor: "pointer",
  },
  sendButton: {
    border: `1px solid ${colors.special}`, borderRadius: "3px", background: "transparent",
    color: colors.special, fontFamily: "inherit", fontSize: "0.78rem",
    letterSpacing: "0.12em", textTransform: "uppercase", padding: "0 1.1rem", cursor: "pointer",
  },
};
