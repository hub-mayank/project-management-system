# Project Management System

A full stack web app where an admin creates projects and assigns team members, and members log in to view and update the status of the projects assigned to them.

Team: **Merge Conflict** (Team 16)

## Features

- Register and login with JWT authentication
- Role based access control: Admin and User
- Admin can create, edit, delete and assign projects
- User can view only the projects assigned to them and update their status
- Each project has a name, description, status, deadline, priority and assigned members

## Tech stack

| Part | Tech |
|---|---|
| Frontend | React (Vite), React Router, plain CSS |
| Backend | Node.js, Express |
| Database | MongoDB Atlas with Mongoose |
| Auth | JWT, bcryptjs |
| Deployment | Vercel (frontend), Render (backend) |

## Team members

| Name | Roll No. | Role |
|---|---|---|
| Mayank | - | Team lead |
| Tejas | - | Member |
| Parth | - | Member |

## Folder structure

```
client/   React app (Vite)
server/   Express API
    routes/       auth, users, projects
    models/       User, Project
    middleware/   auth (authenticateUser, requireAdmin), error
```

## API endpoints

All error responses look like `{ "message": "..." }`. Protected routes need the header `Authorization: Bearer <token>`.

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | body `{ name, email, password }`, returns `{ token, user }`. The email set in `ADMIN_EMAIL` becomes admin, everyone else is a user |
| POST | `/api/auth/login` | Public | body `{ email, password }`, returns `{ token, user }` |

`user` is `{ _id, name, email, role }`, role is `admin` or `user`. The password is never returned.

### Users

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/users` | Admin | list of all users, used to pick assigned members |

### Projects

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/projects` | Admin / User | admin gets all projects, user gets only assigned ones |
| GET | `/api/projects/:id` | Admin / User | user gets 403 if not assigned |
| POST | `/api/projects` | Admin | create a project |
| PUT | `/api/projects/:id` | Admin / User | admin can change any field, user can change only `status` of an assigned project |
| DELETE | `/api/projects/:id` | Admin | delete a project |

Project fields:

| Field | Type | Notes |
|---|---|---|
| name | String | required |
| description | String | |
| status | String | `pending`, `in-progress` or `completed`, default `pending` |
| deadline | Date | |
| priority | String | `low`, `medium` or `high`, default `medium` |
| assignedMembers | [User id] | returned populated as `{ _id, name, email }` |

Status codes used: 400 bad input, 401 missing or invalid token, 403 not allowed for this role, 404 not found.

## Setup

Needs Node.js and a MongoDB Atlas connection string.

```bash
git clone https://github.com/hub-mayank/project-management-system.git
cd project-management-system
```

Backend:

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Frontend (in another terminal):

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

The API runs on `http://localhost:5000` and the app on `http://localhost:5173`.

## Environment variables

`server/.env`

| Variable | Description |
|---|---|
| PORT | port for the API, default 5000 |
| MONGO_URI | MongoDB Atlas connection string |
| JWT_SECRET | secret used to sign tokens |
| ADMIN_EMAIL | this email becomes admin when it registers |
| CLIENT_URL | frontend url allowed by CORS |

`client/.env`

| Variable | Description |
|---|---|
| VITE_API_URL | backend url ending with `/api` |

Never commit `.env`. Only `.env.example` is committed.

## Contributing

Nobody pushes to `main` directly. Every change comes through a pull request that the team lead reviews.

1. Fork the repo and clone your fork: `gh repo fork hub-mayank/project-management-system --clone`
2. Create a branch for your issue: `git checkout -b feature/auth-api`
3. Make your changes and commit with a clear message
4. Push the branch to your fork: `git push origin feature/auth-api`
5. Open a pull request to `main` of this repo and write `Closes #<issue number>` in the description
6. Fix the review comments by pushing more commits to the same branch

Before starting a new issue, update your fork from `main` so you do not work on old code.

## Screenshots

To be added after deployment.

## Deployment

| Service | Link |
|---|---|
| Frontend (Vercel) | to be added |
| Backend (Render) | to be added |
