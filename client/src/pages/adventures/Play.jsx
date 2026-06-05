import { Navigate, useParams } from "react-router-dom";
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from "react";

export default function Play() {
  const { id } = useParams();
  const { loading, token, user } = useAuth();
  const [messages, setMessages] = useState([{
    id: "",
    adventure_id: "",
    text: ""
  }])

  useEffect(() => {
    if (!user || !token) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/adventures/messages?adventure=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setMessages(data);
      } catch (err) {
        return <h1>An unexpected error has occured</h1>
      }
    };

    fetchMessages();
  }, [user, token]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <h1>Play {id}</h1>

      {messages.map(message => (
        <div key={message.id}>
          <h2>{message.text}</h2>
        </div>
      ))}
    </>
  );
}

const styles = {};
