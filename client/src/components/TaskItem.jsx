import { useState } from 'react';

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  const save = async () => {
    if (!title.trim()) return;
    await onEdit(task._id, { title });
    setEditing(false);
  };

  return (
    <li className={`task ${task.completed ? 'done' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task)}
        aria-label={`Mark "${task.title}" as ${task.completed ? 'not done' : 'done'}`}
      />
      <div className="task-body">
        {editing ? (
          <input value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} aria-label="Edit title" />
        ) : (
          <strong>{task.title}</strong>
        )}
        {task.description && !editing && <p className="muted">{task.description}</p>}
        {task.dueDate && <small className="muted">Due {new Date(task.dueDate).toLocaleDateString()}</small>}
      </div>
      <div className="task-actions">
        {editing ? (
          <>
            <button className="btn btn-small" onClick={save}>Save</button>
            <button className="btn btn-small btn-ghost" onClick={() => { setEditing(false); setTitle(task.title); }}>Cancel</button>
          </>
        ) : (
          <>
            <button className="btn btn-small btn-ghost" onClick={() => setEditing(true)}>Edit</button>
            <button className="btn btn-small btn-danger" onClick={() => onDelete(task._id)}>Delete</button>
          </>
        )}
      </div>
    </li>
  );
}
