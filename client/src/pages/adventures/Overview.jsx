import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Overview() {
  const navigate = useNavigate();
  const { loading, user, token } = useAuth();
  const [adventures, setAdventures] = useState([{
    id: "",
    title: "",
    description: ""
  }]);

  const getAventures = async () => {
    try {
      const response = await fetch("/api/adventures/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await response.json();
      setAdventures(data);
    } catch (err) {
      return <h1>An unexpected error has occured</h1>
    }
  }

  const deleteAdventure = async (e, id) => {
    e.stopPropagation();
    await fetch(`/api/adventures/${id}`, { headers: { Authorization: `Bearer ${token}` }, method: 'DELETE' });
    getAventures();
  };

  const editAdventure = async (e, id) => {
    e.stopPropagation();
    navigate(`/adventures/edit/${id}`);
  }

  useEffect(() => {
    if (!user || !token) return;

    getAventures();
  }, [user, token]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {adventures.length > 0 ? (
        <>
          <Link to="/adventures/create">Start new adventure!</Link>
          <h1>Adventures</h1>

          {adventures.map(adventure => (
            <div key={adventure.id} onClick={() => navigate(`/play/${adventure.id}`)}>
              <h2>{adventure.title}</h2>
              <p>{adventure.description}</p>
              <h1 onClick={(e) => editAdventure(e, adventure.id)}>Edit!</h1>
              <h1 onClick={(e) => deleteAdventure(e, adventure.id)}>Delete!</h1>
            </div>
          ))}
        </>
      ) : (
        <>
          <h1>No adventures</h1>
          <h2>Start an adventure!</h2>
          <Link to="/adventures/create">Start!</Link>
        </>
      )}
    </>
  );
}

const styles = {};
