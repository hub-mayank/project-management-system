# Contributing

Thanks for wanting to help with the Project Management System. This page explains how a change goes from an idea to `main`.

## Find something to work on

1. Open the [issues](https://github.com/hub-mayank/project-management-system/issues) tab.
2. Pick an issue labelled `good first issue` or `help wanted`, or open a new one if you found a bug or have an idea.
3. Comment on the issue that you want to work on it and wait until the maintainer assigns it to you. This avoids two people doing the same work.

Read the API contract in the [README](README.md#api-endpoints) before you start, the frontend and backend both follow it.

## Set up locally

Follow the [setup steps](README.md#setup) in the README. You need Node.js and your own MongoDB Atlas connection string for the backend.

## Workflow

Nobody pushes to `main` directly, everything goes through a pull request.

1. Fork the repo and clone your fork
   ```bash
   gh repo fork hub-mayank/project-management-system --clone
   cd project-management-system
   ```
2. Create a branch from an up to date `main`, named after the issue
   ```bash
   git checkout -b feature/auth-api
   ```
   Use `feature/<name>` for new work and `fix/<name>` for bug fixes.
3. Make your change and commit it with a short, clear message
   ```bash
   git commit -m "add register and login routes"
   ```
4. Push the branch to your fork
   ```bash
   git push origin feature/auth-api
   ```
5. Open a pull request to `main` of this repo. Fill the template and write `Closes #<issue number>` in the description.
6. The maintainer reviews it. If changes are requested, push more commits to the same branch and the pull request updates itself.
7. Once approved, the maintainer merges it.

### Keep your fork up to date

```bash
git remote add upstream https://github.com/hub-mayank/project-management-system.git
git fetch upstream
git checkout main
git merge upstream/main
```

Do this before starting every new issue, and merge `main` into your branch if the pull request shows conflicts.

## Code style

Keep new code consistent with the code around it.

Backend (`server/`)
- 4 spaces, double quotes, semicolons
- arrow functions, route handlers in `routes/`, models in `models/`, middleware in its own file under `middleware/`
- send errors with `next(err)` or `err.status` so the shared error handler formats them

Frontend (`client/`)
- 2 spaces, single quotes in imports, no semicolons
- one component per file, pages in `src/pages`, reusable parts in `src/components`
- plain CSS, `fetch` for API calls and the base URL from `import.meta.env.VITE_API_URL`

## Pull request checklist

- [ ] The change does what the issue asks and nothing unrelated
- [ ] The app runs and the feature works locally
- [ ] No `.env` file, `node_modules` or build output is committed
- [ ] The README is updated if an endpoint or setup step changed

## Code of conduct

Everyone taking part is expected to follow the [code of conduct](CODE_OF_CONDUCT.md).
