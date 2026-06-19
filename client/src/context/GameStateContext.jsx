import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const GameStateContext = createContext(null);

export function GameStateProvider({ adventureId, children }) {
  const { loading, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [adventure, setAdventure] = useState();
  useEffect(() => {
    if (!token) return;
    fetchMessages();
    fetchAdventure();
  }, [adventureId, token]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/adventures/messages/${adventureId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setMessages(data);
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAdventure = async () => {
    try {
      const response = await fetch(`/api/adventures/${adventureId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      const data = await response.json();
      setAdventure(data)
    } catch (err) {
      console.error(err);
    }
  }

  const saveMessage = async (message, sender) => {
    console.log(`Saving ${sender} message: ${message}`);

    await fetch(`/api/adventures/messages/${adventureId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ text: message, sender: sender }),
    });

    return await fetchMessages();
  };

  const compileContext = (messages) => {
    const formattedMessages = [...messages]
      .map(m => ({ sender: m.sender, text: m.text }));

    const context = { context: adventure.context, messages: formattedMessages };
    console.log("Turn context:", context);
    return context
  }

  const sendTurn = async (message) => {
    let turnMessages = messages;
    if (message) {
      turnMessages = await saveMessage(message, "Player");
    }

    const response = await fetch('/api/gamestate/', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(compileContext(turnMessages)),
    });
    const data = await response.json();

    await saveMessage(data.reply, "Narrator");
  };

  const undoMessage = async () => {
    if (messages.length > 0) {
      const message_id = messages.at(-1).id;

      console.log(`Removing message with ID: ${message_id}`);

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
