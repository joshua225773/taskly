// 404 for unknown routes
function notFound(req, res) {
  res.status(404).json({ message: 'Route not found' });
}

// One central place for errors: consistent JSON, no internal details leaked
function errorHandler(err, req, res, next) {
  console.error(err);
  if (err.name === 'ValidationError') {
    const first = Object.values(err.errors)[0];
    return res.status(400).json({ message: first ? first.message : 'Invalid input' });
  }
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid id' });
  if (err.code === 11000) return res.status(409).json({ message: 'Email already registered' });
  res.status(500).json({ message: 'Something went wrong on the server' });
}

module.exports = { notFound, errorHandler };
