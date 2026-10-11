# Project Management System

![License](https://img.shields.io/badge/license-MIT-blue)
![Stack](https://img.shields.io/badge/stack-MERN-green)
![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)

A full-stack web app where an admin creates projects and assigns team members, and members log in to view and update the status of the projects assigned to them.

Team: **Merge Conflict** (Team 16)

## Features

- Register and login with JWT authentication
- Role-based access control: Admin and User
- Admin can create, edit, delete and assign projects
- User can view only the projects assigned to them and update their status
- Each project has a name, description, status, deadline, priority and assigned members

Register with the email set in `ADMIN_EMAIL` to get the admin role. Every other account is a normal user.

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
| Mayank | 50 | Team lead |
| Tejas | 85 | Member |
| Parth | 57 | Member |

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

### Health

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/health` | Public | returns `{ "message": "server is running" }`, used by Render as the health check |

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

Needs Node.js 20.19 or newer and a MongoDB Atlas connection string. Fill in the values in `server/.env` before starting the backend (see the table below).

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
| CLIENT_URL | frontend URL allowed by CORS |

`client/.env`

| Variable | Description |
|---|---|
| VITE_API_URL | backend URL ending with `/api` |

Never commit `.env`. Only `.env.example` is committed.

## Contributing

Contributions are welcome. Pick an open [issue](https://github.com/hub-mayank/project-management-system/issues), fork the repo, work on a branch and open a pull request. Nobody pushes to `main` directly. Every change is reviewed by the maintainer.

Read the full [contributing guide](CONTRIBUTING.md) and the [code of conduct](CODE_OF_CONDUCT.md) before you start.

## Screenshots

To be added after deployment.

## Deployment

| Service | Link |
|---|---|
| Frontend (Vercel) | https://project-management-system-dusky-three.vercel.app |
| Backend (Render) | https://project-management-api-mtz6.onrender.com |

The backend runs on Render's free plan, which sleeps after a period of inactivity. The first request after that can take up to a minute.

### Deploy the backend on Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/hub-mayank/project-management-system)

The `render.yaml` in the root describes the service. Render asks for three values:

| Variable | Value |
|---|---|
| MONGO_URI | MongoDB Atlas connection string, with the database name before the `?` |
| ADMIN_EMAIL | the email that becomes admin when it registers |
| CLIENT_URL | the Vercel URL without a trailing slash |

`JWT_SECRET` is generated by Render. In MongoDB Atlas, allow network access from `0.0.0.0/0` so Render can connect. Check `https://<service>.onrender.com/api/health` after the deploy.

### Deploy the frontend on Vercel

1. Import the repo in Vercel and set the **Root Directory** to `client`
2. Add the environment variable `VITE_API_URL` with the Render URL followed by `/api`
3. Deploy, then put the Vercel URL in `CLIENT_URL` on Render so CORS allows it

## License

Released under the [MIT License](LICENSE).
