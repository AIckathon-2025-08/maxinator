# Maxinator

Maxinator is a post-ironic “Two Truths and a Lie” party game. The host submits an avatar and three statements. Everyone else votes within 60 seconds. Then the host reveals the lie. Tumblr-era UI with a kitten collage background.

## Preview
![Screen 1](https://placekitten.com/800/360)
![Screen 2](https://placekitten.com/801/360)

## Available Commands

| Command | Description |
|---|---|
| `npm install` | Install project dependencies (root) |
| `npm run dev` | Start backend (5001) and frontend (3000) with live reload |
| `npm run backend` | Start backend only (nodemon on 5001) |
| `npm run frontend` | Start frontend only (CRA on 3000) |
| `npm run build` | Build the React app (production) |
| `npm start` | Serve the built frontend with the backend in production mode |
| `docker-compose up` | Run production container on `http://localhost:9000` |
| `docker-compose --profile dev up maxinator-dev` | Run development container with hot reload |

## Requirements
- Node.js 18+
- npm

## Local Development
```bash
npm install
npm run dev
Frontend: http://localhost:3000

Backend + WebSocket: http://localhost:5001

Project Structure
pgsql
Copy
Edit
backend/
  server.js
frontend/
  public/
  src/
    pages/
      AdminPage.js
      VotePage.js
      ResultsPage.js
    styles/
      theme.css
Dockerfile
docker-compose.yml
package.json
README.md
Deploying to Production (without Docker)
bash
Copy
Edit
npm run build
NODE_ENV=production npm start
Serves API + built frontend on port 5001.

Running with Docker
Production
bash
Copy
Edit
docker-compose up
Served at http://localhost:9000.

Development
bash
Copy
Edit
docker-compose --profile dev up maxinator-dev
Mounts local code

Runs npm run dev in the container

Ports: frontend 3000, backend 5001

Stop / Rebuild
bash
Copy
Edit
docker-compose down
docker-compose build
