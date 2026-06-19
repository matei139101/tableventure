import { Link } from "react-router-dom";
import { useAuth } from '@/context/AuthContext';
import { colors } from "@/Theme";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <Link to="/" style={styles.brandLink}>Tableventure</Link>
        <Link to="/adventures/" style={styles.link}>Adventures</Link>
      </div>
      <div style={styles.right}>
        {user ? (
          <>
            <Link to="/user/dashboard" style={styles.link}>{user.username}</Link>
            <button style={styles.button} onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/user/login" style={styles.link}>Login</Link>
            <Link to="/user/register" style={styles.link}>Register</Link>
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
    alignItems: "center",
    height: "5vh",
    maxHeight: "5vh",
    padding: "0 20px",
    background: colors.background,
    borderBottom: `1px solid ${colors.secondary}`,
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  brandLink: {
    textDecoration: "none",
    color: colors.special,
    fontWeight: "bold",
    fontSize: "0.95rem",
    letterSpacing: "0.04em",
  },
  link: {
    textDecoration: "none",
    color: colors.rule,
    fontSize: "0.9rem",
  },
  button: {
    background: "transparent",
    border: `1px solid ${colors.accent}`,
    color: colors.accent,
    borderRadius: "3px",
    padding: "4px 10px",
    fontSize: "0.85rem",
    cursor: "pointer",
  },
};
