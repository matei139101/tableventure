import { useEffect, useState } from 'react';

const API = '/api/users';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [editing, setEditing] = useState(null); // holds user being edited
  const [error, setError] = useState('');

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    const res = await fetch(API);
    const data = await res.json();
    if (Array.isArray(data)) {
      setUsers(data);
    } else {
      setError('Failed to load users: ' + (data.error || 'Unknown error'));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (editing) {
        await fetch(`${API}/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        setEditing(null);
      } else {
        await fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      setForm({ name: '', email: '' });
      fetchUsers();
    } catch (err) {
      setError('Something went wrong.');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this user?')) return;
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    fetchUsers();
  }

  function handleEdit(user) {
    setEditing(user);
    setForm({ name: user.name, email: user.email });
  }

  function handleCancel() {
    setEditing(null);
    setForm({ name: '', email: '' });
    setError('');
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Users</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
        <h2>{editing ? 'Edit User' : 'Add User'}</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div style={{ marginBottom: 8 }}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
            style={{ marginRight: 8, padding: 8 }}
          />
          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
            style={{ marginRight: 8, padding: 8 }}
          />
          <button type="submit" style={{ padding: '8px 16px' }}>
            {editing ? 'Update' : 'Add'}
          </button>
          {editing && (
            <button type="button" onClick={handleCancel} style={{ padding: '8px 16px', marginLeft: 8 }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ccc', textAlign: 'left' }}>
            <th style={{ padding: 8 }}>Name</th>
            <th style={{ padding: 8 }}>Email</th>
            <th style={{ padding: 8 }}>Created</th>
            <th style={{ padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr><td colSpan={4} style={{ padding: 8, color: '#999' }}>No users yet.</td></tr>
          )}
          {users.map(user => (
            <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: 8 }}>{user.name}</td>
              <td style={{ padding: 8 }}>{user.email}</td>
              <td style={{ padding: 8 }}>{new Date(user.created_at).toLocaleDateString()}</td>
              <td style={{ padding: 8 }}>
                <button onClick={() => handleEdit(user)} style={{ marginRight: 8 }}>Edit</button>
                <button onClick={() => handleDelete(user.id)} style={{ color: 'red' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
