import { Navigate } from "react-router-dom";
import { useAuth } from '@/context/AuthContext';

export default function Dashboard() {
  const { loading, user } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <h1>{user.id}</h1>
      <h2>{user.username}</h2>
      <h2>{user.email}</h2>
    </>
  );
}

const styles = {};
