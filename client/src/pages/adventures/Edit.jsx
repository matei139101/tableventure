import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from '@/context/AuthContext';

export default function Edit() {
  const { loading, user, token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    title: "",
    description: ""
  });
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchAdventure = async () => {
      const res = await fetch(`http://localhost:8080/api/adventures/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      if (res.ok) {
        const data = await res.json();
        setForm({
          title: data.title,
          description: data.description
        });
      }
      setFetching(false);
    };

    fetchAdventure();
  }, [user, id, token]);

  if (loading || fetching) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:8080/api/adventures/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title: form.title,
        description: form.description
      }),
    });
    if (res.ok) {
      navigate("/adventures/");
    }
  };

  return (
    <div>
      <h2>Edit your adventure</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        />
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
