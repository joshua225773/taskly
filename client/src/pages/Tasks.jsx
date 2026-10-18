import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import TaskForm from '../components/TaskForm.jsx';
import TaskItem from '../components/TaskItem.jsx';

export default function Tasks() {
  const { logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const d = await api.listTasks(page);
      setTasks(d.tasks);
      setPages(d.pages || 1);
      // If the last task on a page was deleted, step back a page
      if (d.tasks.length === 0 && page > 1) setPage(page - 1);
    } catch (err) {
      if (err.status === 401) logout();
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, logout]);

  useEffect(() => { load(); }, [load]);

  const add = async (data) => {
    await api.createTask(data);
    if (page !== 1) setPage(1);
    else await load();
  };
  const toggle = async (t) => {
    try { await api.updateTask(t._id, { completed: !t.completed }); await load(); }
    catch (err) { setError(err.message); }
  };
  const edit = async (id, data) => {
    try { await api.updateTask(id, data); await load(); }
    catch (err) { setError(err.message); }
  };
  const remove = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try { await api.deleteTask(id); await load(); }
    catch (err) { setError(err.message); }
  };

  return (
    <>
      <TaskForm onAdd={add} />
      <section className="card">
        <h2>Your tasks</h2>
        {error && (
          <p className="error" role="alert">
            {error} <button className="btn btn-small" onClick={load}>Retry</button>
          </p>
        )}
        {loading && <p className="muted">Loading tasks…</p>}
        {!loading && !error && tasks.length === 0 && (
          <p className="muted">No tasks yet. Add your first one above 👆</p>
        )}
        <ul className="tasks">
          {tasks.map((t) => (
            <TaskItem key={t._id} task={t} onToggle={toggle} onDelete={remove} onEdit={edit} />
          ))}
        </ul>
        {pages > 1 && (
          <div className="pager">
            <button className="btn btn-small btn-ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
            <span className="muted">Page {page} of {pages}</span>
            <button className="btn btn-small btn-ghost" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        )}
      </section>
    </>
  );
}
