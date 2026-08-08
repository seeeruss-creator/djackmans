import { useState, useEffect, useCallback } from 'react';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import FormField, { inputClass } from '../../components/admin/FormField.jsx';
import { UserApi } from '../../api/UserApi.js';
import { getUser } from '../../utils/auth.js';

function UserForm({ user, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'clerk',
    status: user?.status || 'active',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.username.trim()) e.username = 'Username is required.';
    if (!form.email.trim()) e.email = 'Email is required.';
    if (!user && !form.password) e.password = 'Password is required.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    const data = { ...form };
    if (user && !data.password) delete data.password;
    try {
      if (user) await UserApi.update(user.id, data);
      else await UserApi.create(data);
      onSaved();
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Save failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">{user ? 'Edit User' : 'New User'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && <div className="text-red-600 text-sm bg-red-50 border border-red-200 px-4 py-3 rounded">{errors.general}</div>}
          <FormField label="Name" error={errors.name} required>
            <input className={inputClass(errors.name)} value={form.name} onChange={(e) => set('name', e.target.value)} />
          </FormField>
          <FormField label="Username" error={errors.username} required>
            <input className={inputClass(errors.username)} value={form.username} onChange={(e) => set('username', e.target.value)} />
          </FormField>
          <FormField label="Email" error={errors.email} required>
            <input type="email" className={inputClass(errors.email)} value={form.email} onChange={(e) => set('email', e.target.value)} />
          </FormField>
          <FormField label={user ? 'New Password (leave blank to keep)' : 'Password'} error={errors.password} required={!user}>
            <input type="password" className={inputClass(errors.password)} value={form.password} onChange={(e) => set('password', e.target.value)} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Role">
              <select className={inputClass()} value={form.role} onChange={(e) => set('role', e.target.value)}>
                <option value="clerk">Clerk</option>
                <option value="admin">Admin</option>
              </select>
            </FormField>
            <FormField label="Status">
              <select className={inputClass()} value={form.status} onChange={(e) => set('status', e.target.value)}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </FormField>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={submitting} className="flex-1 bg-blue-600 text-white text-sm py-2.5 rounded hover:bg-blue-700 disabled:opacity-50">
              {submitting ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={onClose} className="px-6 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const currentUser = getUser();

  const load = useCallback(() => {
    setLoading(true);
    UserApi.list().then((res) => setUsers(res.data.data)).catch(() => setError('Failed to load users.')).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await UserApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Cannot delete this user.');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded transition-colors">
          + New User
        </button>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded">{error}</div>}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              {['Name', 'Username', 'Email', 'Role', 'Status', 'Actions'].map((col) => (
                <th key={col} className={`text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 ${col === 'Actions' ? 'text-right' : ''}`}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center text-gray-400 py-12">Loading...</td></tr>
            ) : users.map((u) => (
              <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                <td className="px-4 py-3 text-gray-600 font-mono text-xs">{u.username}</td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'}`}>{u.role}</span></td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${u.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>{u.status}</span></td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => { setEditing(u); setShowForm(true); }} className="text-xs text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                    {u.id !== currentUser?.id && (
                      <button onClick={() => setDeleteTarget(u)} className="text-xs text-red-500 hover:text-red-700 font-medium">Delete</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && <UserForm user={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); load(); }} />}
      {deleteTarget && (
        <ConfirmDialog
          message={`Are you sure you want to delete user "${deleteTarget.name}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
