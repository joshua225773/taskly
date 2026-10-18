const Task = require('../models/Task');

const MAX_LIMIT = 50;

function parseDue(v) {
  if (v === undefined || v === null || v === '') return undefined;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d; // null = invalid
}

// GET /api/tasks?page=1&limit=10
exports.list = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), MAX_LIMIT);
    const filter = { user: req.userId };
    const [tasks, total] = await Promise.all([
      Task.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Task.countDocuments(filter),
    ]);
    res.json({ tasks, page, limit, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// POST /api/tasks
exports.create = async (req, res, next) => {
  try {
    const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const dueDate = parseDue(req.body.dueDate);
    if (dueDate === null) return res.status(400).json({ message: 'Invalid due date' });
    const description = typeof req.body.description === 'string' ? req.body.description : '';
    const task = await Task.create({ user: req.userId, title, description, dueDate });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/tasks/:id  (ownership enforced by { _id, user } filter)
exports.update = async (req, res, next) => {
  try {
    const updates = {};
    if (req.body.title !== undefined) {
      const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
      if (!title) return res.status(400).json({ message: 'Title is required' });
      updates.title = title;
    }
    if (typeof req.body.description === 'string') updates.description = req.body.description;
    if (typeof req.body.completed === 'boolean') updates.completed = req.body.completed;
    if (req.body.dueDate !== undefined) {
      const d = parseDue(req.body.dueDate);
      if (d === null) return res.status(400).json({ message: 'Invalid due date' });
      updates.dueDate = d || null;
    }
    const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.userId }, updates, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/tasks/:id
exports.remove = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};
