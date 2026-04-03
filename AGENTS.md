# AGENTS.md

## Project goal
Rebuild the Professional Engineers Association Jabalpur website using the existing Hostinger-exported frontend as the UI base, while adding a Node.js + Express + EJS + MongoDB Atlas backend.

## High-level rules
- Preserve the current frontend look and layout as much as possible.
- Do not do a full redesign unless explicitly asked.
- Reuse exported HTML/CSS/JS/assets wherever possible.
- Convert static HTML pages into EJS views gradually.
- Keep changes modular and production-oriented.
- Do not hardcode secrets.
- Use environment variables for MongoDB URI, session secret, and admin credentials.
- Do not break asset paths.
- Prefer small safe edits over sweeping rewrites.

## Architecture
- Express server
- EJS templating
- Static assets in /public
- Views in /src/views
- Routes in /src/routes
- Controllers in /src/controllers
- Models in /src/models
- MongoDB Atlas with Mongoose
- Admin authentication using bcrypt + express-session

## Core features
- Public pages: home, about, contact, leadership, member directory, member registration
- Member registration stored as pending
- Admin login and dashboard
- Approve/reject member flow
- Member ID generated only on approval
- Leadership page driven from DB
- Member directory driven from DB
- Visibility toggles for public fields
- Member photo upload
- CSV bulk import

## Safety rules
- Never expose private member fields publicly.
- Never generate member_id at registration time.
- Never commit .env.
- Keep code readable and split by responsibility.
- After each task, explain what changed and what still needs manual review.

## Working style
- Make one focused change at a time.
- Prefer minimal diffs.
- Preserve working code.
- If cleanup is needed, do cleanup first, then feature work.