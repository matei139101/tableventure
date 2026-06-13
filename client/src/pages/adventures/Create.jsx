import { Navigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from "react-router-dom";

export default function Create() {
  const { loading, user, token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: ""
  });

  if (loading) {
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

    const res = await fetch("http://localhost:8080/api/adventures/", {
      method: "POST",
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
      navigate("/adventures/")
    }
  };

  return (
    <div>
      <h2>Start an adventure</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          onChange={handleChange}
        />

        <input
          name="description"
          placeholder="Description"
          onChange={handleChange}
        />

        <button type="submit">Create!</button>
      </form>
    </div>
  );
}
