# Taskly – Task Tracker (MERN Stack)

Taskly is a simple web app where people sign up, log in and manage their own to-do tasks.
It solves the problem of scattered to-dos by giving each user a private, searchable-by-page task list they can reach from any device.

**Live app:** _add your Vercel link here_
**API:** _add your Render link here_

## Features
- Register and log in (passwords hashed with bcrypt, JWT login token)
- Add, edit, complete and delete tasks (title, description, due date)
- Each user sees only their own tasks (ownership checked on the server)
- Pagination, loading / empty / error states, mobile-friendly layout
- Input validation on both frontend and backend; rate limiting on login/register

## Tech stack
MongoDB (Atlas) · Express · React (Vite) · Node.js · Mongoose · JWT · bcryptjs

## Project structure
```
client/   React app (pages, components, services/api.js, context)
server/   Express API (routes, controllers, models, middleware, config)
```

## Run locally
Requires Node.js 18+ and a MongoDB connection string (free MongoDB Atlas cluster).

**1. API**
```bash
cd server
npm install
cp .env.example .env     # then edit .env with your real values
npm run dev              # http://localhost:5000
```
**2. Client** (new terminal)
```bash
cd client
npm install
cp .env.example .env
npm run dev              # http://localhost:5173
```

## Environment variables
| File | Name | Meaning |
|---|---|---|
| server/.env | PORT | API port (default 5000) |
| server/.env | MONGODB_URI | MongoDB Atlas connection string |
| server/.env | JWT_SECRET | Long random string used to sign login tokens |
| server/.env | CLIENT_ORIGIN | Allowed frontend URL(s) for CORS |
| client/.env | VITE_API_URL | API base URL, e.g. http://localhost:5000/api |

## API endpoints
| Method & path | Purpose | Auth |
|---|---|---|
| POST /api/auth/register | Create account | No |
| POST /api/auth/login | Log in, returns token | No |
| GET /api/auth/me | Current user | Yes |
| GET /api/tasks?page&limit | List own tasks | Yes |
| POST /api/tasks | Create task | Yes |
| PATCH /api/tasks/:id | Update task | Yes |
| DELETE /api/tasks/:id | Delete task | Yes |

## Screenshots
_Add screenshots of Login, Register, Tasks (desktop and mobile) here._

## Known limitations / future work
- No password reset or email verification
- No task search, categories or reminders
- Token stored in localStorage (simple, but less safe than httpOnly cookies)
- Free hosting may sleep, so the first request can be slow
