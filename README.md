# Real-Time Chat Assessment

Full-stack chat system built with React Native, Node.js, Express, PostgreSQL, and Socket.io.

## Folder Structure

- `backend`: JWT auth APIs, Socket.io server, PostgreSQL persistence
- `frontend`: React Native app with auth flow, chat UI, and live socket updates

## Backend Setup

1. Go to backend:
   - `cd backend`
2. Install dependencies:
   - `npm install`
3. Create env file:
   - copy `.env.example` to `.env`
4. Update `.env` with your PostgreSQL credentials.
5. Initialize database schema:
   - `npm run db:init`
6. Run server:
   - `npm run dev`

Server runs at `http://localhost:5000`.

## Frontend Setup

1. Go to frontend:
   - `cd frontend`
2. Install dependencies:
   - `npm install`
3. Update API host in `src/config.js`:
   - Android emulator: `10.0.2.2`
   - iOS simulator: `localhost`
   - Physical device: your machine LAN IP
4. Run app:
   - `npm run start`

## API Endpoints

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/chat/users` (protected)
- `GET /api/chat/messages/:userId` (protected)

## Socket Events

- Client emits: `sendMessage`
- Server emits: `receiveMessage`

Socket authentication uses JWT via `handshake.auth.token`.

. Add account of two user and start real time conversation by running project oon two emulator then check real time chat between two users.
