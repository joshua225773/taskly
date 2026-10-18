import { useState } from 'react';

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) return setError('Title is required');
    setBusy(true);
    try {
      await onAdd({ title, description, dueDate: dueDate || undefined });
      setTitle('');
      setDescription('');
      setDueDate('');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="card form" onSubmit={submit}>
      <h2>Add a task</h2>
      {error && <p className="error" role="alert">{error}</p>}
      <label htmlFor="title">Title</label>
      <input id="title" value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} />
      <label htmlFor="desc">Description (optional)</label>
      <textarea id="desc" rows={2} value={description} maxLength={500} onChange={(e) => setDescription(e.target.value)} />
      <label htmlFor="due">Due date (optional)</label>
      <input id="due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <button className="btn" disabled={busy}>{busy ? 'Saving…' : 'Add task'}</button>
    </form>
  );
}
