import { useState, useEffect, useRef } from 'react';
import { CustomerApi } from '../../api/CustomerApi.js';
import { inputClass } from './FormField.jsx';

export default function CustomerSelect({ value, onChange, error }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '', address: '', notes: '' });
  const [addError, setAddError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef(null);

  // Load selected customer label when value is set (e.g. edit mode)
  useEffect(() => {
    if (!value) {
      setSelected(null);
      return;
    }
    if (selected?.id === Number(value) || selected?.id === value) return;
    CustomerApi.get(value)
      .then((res) => {
        const c = res.data.data;
        setSelected(c);
        setQuery('');
      })
      .catch(() => {});
  }, [value]);

  // Search only when typing (no full customer list dropdown)
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const t = setTimeout(() => {
      setLoading(true);
      CustomerApi.list(query.trim())
        .then((res) => setResults(res.data.data || []))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const pick = (c) => {
    setSelected(c);
    onChange(c.id);
    setQuery('');
    setResults([]);
    setOpen(false);
  };

  const clear = () => {
    setSelected(null);
    onChange('');
    setQuery('');
    setResults([]);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setAddError('');
    if (!newCustomer.name.trim() || !newCustomer.phone.trim()) {
      setAddError('Name and phone are required.');
      return;
    }
    setSaving(true);
    try {
      const res = await CustomerApi.create(newCustomer);
      const c = res.data.data;
      pick(c);
      setShowAdd(false);
      setNewCustomer({ name: '', phone: '', email: '', address: '', notes: '' });
    } catch (err) {
      setAddError(err.response?.data?.message || 'Failed to add customer.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div ref={wrapRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">Customer *</label>

      {selected ? (
        <div className="flex items-center gap-2">
          <div className={`flex-1 ${inputClass(error)} flex items-center justify-between gap-2 !py-2`}>
            <div className="min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">{selected.name}</div>
              <div className="text-xs text-admin-muted truncate">{selected.phone}</div>
            </div>
            <button
              type="button"
              onClick={clear}
              className="text-xs text-gray-500 hover:text-red-600 shrink-0"
            >
              Change
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowAdd(!showAdd)}
            className="text-xs bg-admin-soft border border-admin-primary/20 text-admin-primary px-3 py-2 rounded-lg hover:bg-admin-primary hover:text-white transition-colors whitespace-nowrap font-medium"
          >
            + New
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              placeholder="Search existing customer by name or phone..."
              className={inputClass(error)}
              autoComplete="off"
            />
            {open && query.trim() && (
              <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-admin-border rounded-lg shadow-admin max-h-48 overflow-y-auto">
                {loading && (
                  <div className="px-3 py-2 text-xs text-admin-muted">Searching...</div>
                )}
                {!loading && results.length === 0 && (
                  <div className="px-3 py-2 text-xs text-admin-muted">
                    No match. Use + New to add this customer.
                  </div>
                )}
                {!loading &&
                  results.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => pick(c)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-admin-soft transition-colors"
                    >
                      <span className="font-medium text-gray-900">{c.name}</span>
                      <span className="text-admin-muted text-xs ml-2">{c.phone}</span>
                    </button>
                  ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowAdd(!showAdd)}
            className="text-xs bg-admin-soft border border-admin-primary/20 text-admin-primary px-3 py-2 rounded-lg hover:bg-admin-primary hover:text-white transition-colors whitespace-nowrap font-medium"
          >
            + New
          </button>
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      {showAdd && (
        <div className="mt-3 border border-admin-soft bg-admin-soft/50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Add New Customer</h4>
          <p className="text-xs text-admin-muted mb-3">
            Saves to Customers in the system, then attaches to this order.
          </p>
          {addError && <p className="text-red-500 text-xs mb-2">{addError}</p>}
          <form onSubmit={handleAdd} className="space-y-2">
            <input type="text" placeholder="Name *" value={newCustomer.name} onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })} className={inputClass()} required />
            <input type="text" placeholder="Phone *" value={newCustomer.phone} onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })} className={inputClass()} required />
            <input type="email" placeholder="Email" value={newCustomer.email} onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })} className={inputClass()} />
            <input type="text" placeholder="Address" value={newCustomer.address} onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })} className={inputClass()} />
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="flex-1 bg-admin-primary text-white text-xs py-2 rounded-lg hover:bg-admin-primary-dark disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Customer'}
              </button>
              <button type="button" onClick={() => setShowAdd(false)} className="text-xs text-gray-500 px-3">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
