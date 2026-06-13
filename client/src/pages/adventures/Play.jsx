import { Navigate, useParams } from "react-router-dom";
import { useAuth } from '@/context/AuthContext';
import { GameStateProvider, useGameState } from "../../context/GameStateContext";

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

  return (
    <>
      <h1>Play</h1>
      {messages.map(message => (
        <div key={message.id}>
          <h2>{message.text}</h2>
        </div>
      ))}
      <div>
        <h1>Send a message...</h1>
        <input id="message-input" />
        <button onClick={() => sendTurn(document.getElementById('message-input').value)}>Send</button>
        <button onClick={undoMessage}>Undo</button>
      </div>
    </>
  );
}
