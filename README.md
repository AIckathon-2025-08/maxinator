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
Production (without Docker)
bash
Copy
Edit
npm run build
NODE_ENV=production npm start
Docker
Production
bash
Copy
Edit
docker-compose up
→ http://localhost:9000

Development
bash
Copy
Edit
docker-compose --profile dev up maxinator-dev
→ frontend 3000, backend 5001

Stop / Rebuild
bash
Copy
Edit
docker-compose down
docker-compose build
pgsql
Copy
Edit

```dockerfile
# Dockerfile
FROM node:20-alpine AS build-frontend
WORKDIR /app
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci
COPY frontend ./frontend
RUN cd frontend && npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY backend ./backend
COPY --from=build-frontend /app/frontend/build ./frontend/build
ENV NODE_ENV=production
EXPOSE 5001
CMD ["node", "backend/server.js"]
yaml
Copy
Edit
# docker-compose.yml
version: "3.9"
services:
  maxinator:
    build: .
    ports:
      - "9000:5001"
    environment:
      - NODE_ENV=production

  maxinator-dev:
    profiles: ["dev"]
    image: node:20
    working_dir: /app
    volumes:
      - .:/app
    command: sh -c "npm install && npm run dev"
    ports:
      - "3000:3000"
      - "5001:5001"
gitignore
Copy
Edit
# .gitignore
node_modules/
frontend/node_modules/
npm-debug.log*
yarn-error.log*
pnpm-debug.log*
frontend/build/
coverage/
dist/
.env
.env.*
.DS_Store
*.local
logs/
*.log
json
Copy
Edit
// package.json  (root)
{
  "name": "maxinator",
  "version": "1.0.0",
  "private": true,
  "type": "commonjs",
  "scripts": {
    "dev": "concurrently \"nodemon backend/server.js\" \"npm start --prefix frontend\"",
    "backend": "nodemon backend/server.js",
    "frontend": "npm start --prefix frontend",
    "build": "npm run build --prefix frontend",
    "start": "NODE_ENV=production node backend/server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.19.2",
    "path": "^0.12.7",
    "socket.io": "^4.7.5"
  },
  "devDependencies": {
    "concurrently": "^8.2.2",
    "nodemon": "^3.1.10"
  }
}
