import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const GameStateContext = createContext(null);

export function GameStateProvider({ adventureId, children }) {
  const { loading, token, user } = useAuth();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!token) return;
    fetchMessages();
  }, [adventureId, token]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/adventures/messages/${adventureId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async (message, sender) => {
    await fetch(`/api/adventures/messages/${adventureId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ text: message, sender: sender }),
    });

    await fetchMessages();
  };

  const sendTurn = async (message) => {
    await sendMessage(message, "Player");

    const formattedMessages = [...messages, { sender: "Player", text: message }]
      .map(m => ({ sender: m.sender, text: m.text }));

    const response = await fetch('/api/gamestate/', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ messages: formattedMessages }),
    });
    const data = await response.json();

    await sendMessage(data.reply, "Narrator");
  };

  const undoMessage = async () => {
    if (messages.length > 0) {
      const message_id = messages.at(-1).id;
      await fetch(`/api/adventures/messages/${message_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      });
      await fetchMessages();
    }
  };

  return (
    <GameStateContext.Provider value={{ messages, loading, sendTurn, undoMessage, fetchMessages }}>
      {children}
    </GameStateContext.Provider>
  );
}

export const useGameState = () => useContext(GameStateContext);
