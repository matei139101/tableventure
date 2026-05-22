import { Link } from "react-router-dom";
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <Link to="/" style={styles.link}>Tableventure</Link>
      </div>

      <div style={styles.right}>
        {user ? (
          <>
            <Link to="/user/dashboard">{user.username}</Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/user/login">Login</Link>
            <Link to="/user/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px",
    borderBottom: "1px solid #ddd",
    alignItems: "center"
  },
  left: {
    fontWeight: "bold"
  },
  right: {
    display: "flex",
    gap: "10px"
  },
  link: {
    textDecoration: "none",
    color: "black"
  }
};
