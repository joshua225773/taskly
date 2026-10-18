# Software Requirements Specification (SRS)
## Taskly – Task Tracker Web Application

**Course:** Full Stack Development (ICTAK) **Stack:** MERN (MongoDB, Express, React, Node.js)

## 1. Introduction
### 1.1 Purpose
This document describes the requirements of Taskly, a web application that lets people manage their personal tasks online.

### 1.2 Problem statement
People often track tasks on scattered notes and chats, so tasks get forgotten. Taskly gives each person one private place to record, update and complete their tasks from any device.

### 1.3 Scope
Taskly lets a registered user create and manage their own tasks. It does not include teams, shared lists, reminders or notifications (see Future Scope).

### 1.4 Definitions
- **MVP:** the smallest set of features that makes the product useful.
- **JWT:** JSON Web Token, used to keep a user logged in.
- **CRUD:** Create, Read, Update, Delete.

## 2. Overall Description
### 2.1 Target users
| Role | What they can do |
|---|---|
| Visitor | View login and register pages; register |
| Registered user | Log in; create, view, edit, complete and delete **their own** tasks |

### 2.2 Operating environment
Modern web browsers on desktop and mobile. Backend on Node.js; database on MongoDB Atlas; frontend and API hosted online.

### 2.3 Constraints and assumptions
- Built with the MERN stack using free hosting tiers.
- Users have an internet connection and a valid email address.

## 3. Functional Requirements (MVP)
| ID | Requirement | Priority |
|---|---|---|
| FR1 | A visitor can register with name, email and password | Must |
| FR2 | A registered user can log in and log out | Must |
| FR3 | A logged-in user can add a task with a title (required), description and due date (optional) | Must |
| FR4 | A user can view a paginated list of their own tasks | Must |
| FR5 | A user can edit a task's title | Must |
| FR6 | A user can mark a task complete or incomplete | Must |
| FR7 | A user can delete a task after confirming | Must |
| FR8 | A user cannot see or change another user's tasks | Must |
| FR9 | Search/filter tasks, categories, reminders | Later |

## 4. User Stories and Acceptance Criteria
**US1 – Register.** As a visitor, I want to create an account so that my tasks are saved privately.
- Name (min 2 chars), valid email and password (min 6 chars) are required; otherwise a clear message is shown and nothing is saved.
- An already-registered email shows "Email already registered".
- After success the user is logged in.

**US2 – Log in.** As a registered user, I want to log in so that I can reach my tasks.
- Correct email and password opens the task page.
- Wrong details show "Invalid email or password" (not which part was wrong).
- Task pages cannot be opened when logged out.

**US3 – Add a task.** As a user, I want to add a task so that I can track my work.
- An empty title shows a validation message and nothing is saved.
- After saving, the task appears in the list without a manual refresh.

**US4 – Manage tasks.** As a user, I want to edit, complete and delete tasks so that my list stays accurate.
- Completed tasks appear struck through.
- Deleting asks for confirmation.
- A user cannot read, edit or delete another user's task.

**US5 – Clear feedback.** As a user, I want to see loading, empty and error states so that I know what is happening.
- A loading message shows while data loads; a friendly message shows when there are no tasks; an error message with a Retry button shows on failure.

## 5. Data Model
**User:** name (String), email (String, unique), password (String, bcrypt hash), createdAt, updatedAt
**Task:** user (reference to User), title (String, required, max 120), description (String, max 500), dueDate (Date), completed (Boolean, default false), createdAt, updatedAt
Relationship: one User has many Tasks (Task references User).

## 6. API Contract
| Method & path | Purpose | Request | Success | Errors |
|---|---|---|---|---|
| POST /api/auth/register | Create account | name, email, password | 201 token + user | 400, 409 |
| POST /api/auth/login | Log in | email, password | 200 token + user | 401 |
| GET /api/auth/me | Current user | token | 200 user | 401 |
| GET /api/tasks | List own tasks | page, limit | 200 tasks + paging | 401 |
| POST /api/tasks | Create task | title, description, dueDate | 201 task | 400, 401 |
| PATCH /api/tasks/:id | Update task | title / completed / etc. | 200 task | 400, 401, 404 |
| DELETE /api/tasks/:id | Delete task | – | 200 message | 401, 404 |

## 7. Non-Functional Requirements
- **Security:** passwords hashed with bcrypt; JWT-protected routes; ownership checked on the server; input validated on frontend and backend; secrets kept in environment variables; login/register rate limited.
- **Usability:** responsive layout from small phones to desktops; labelled form fields and keyboard navigation.
- **Performance:** task list pages load within about 2 seconds on a normal connection; lists are paginated (max 50 per page).
- **Reliability:** errors return consistent JSON messages without exposing internal details.
- **Compatibility:** latest versions of Chrome, Edge, Firefox and Safari.
- **Privacy:** only name, email and tasks are stored; no real personal data is used in demos.

## 8. System Architecture
React app (browser) → HTTP/JSON → Express/Node API → Mongoose → MongoDB Atlas.
React never talks to the database directly.

## 9. Future Scope
Search and filters, task categories, reminders, password reset, shared lists.
