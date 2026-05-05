# Story Creator - Choose Your Own Adventure Platform

A fullstack web application for creating and playing interactive choose-your-own-adventure stories.

## Live Demo

The frontend can be published as a static GitHub Pages site.

- Demo URL: [https://SidKundu27.github.io/story-creator/](https://SidKundu27.github.io/story-creator/)
- GitHub Actions workflow: `.github/workflows/deploy-pages.yml`


## Features

- **Story Creation**: Build branching narratives with multiple paths and endings
- **User Accounts**: Register, login, and manage your stories
- **Story Feed**: Browse and play community-created stories
- **Interactive Gameplay**: Make choices that determine the story outcome
- **Future**: Export stories as standalone apps or websites

## Tech Stack

- **Frontend**: React 18, Vite, React Router, Axios
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)

## Setup

1. Install dependencies:
   ```bash
   npm run install-all
   ```

2. Create a `.env` file in the root directory (copy from `.env.example`):
   ```
   MONGODB_URI=mongodb://localhost:27017/story-creator
   JWT_SECRET=your_secret_key
   PORT=5000
   ```

3. Make sure MongoDB is running locally or update the MONGODB_URI with your connection string

4. Start the development servers:
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on http://localhost:5000
   - Vite frontend on http://localhost:5173

   **Note**: If your database is empty, the server will automatically seed it with starter stories on first run.

## GitHub Pages Deployment

This repo includes a GitHub Pages workflow that builds the client from `client/` and publishes the static site automatically on pushes to `main`.

To enable it in GitHub:

1. Open the repository settings.
2. Go to `Pages`.
3. Set the source to `GitHub Actions`.
4. Push to `main` or run the workflow manually from the Actions tab.

The production build uses hash-based routing so Pages can serve the app without custom rewrite rules.

## Seeding the Database

To manually populate the database with example stories:

```bash
npm run seed
```

This will:
- Prompt you to keep or delete existing data
- Create a test user (Email: `test@gmail.com`, Password: `password123`)
- Import stories from `server/story-creator.stories.json`

The seed data is also automatically loaded when you start the server with an empty database.

## Project Structure

```
story-creator/
├── client/              # Vite + React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Context API
│   │   ├── services/    # API services (utils)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.mjs  # Vite configuration
│   └── package.json
├── server/              # Express backend
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   └── server.js
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Stories
- `GET /api/stories` - Get all stories (feed)
- `GET /api/stories/:id` - Get specific story
- `POST /api/stories` - Create new story (auth required)
- `PUT /api/stories/:id` - Update story (auth required)
- `DELETE /api/stories/:id` - Delete story (auth required)

### User
- `GET /api/users/profile` - Get user profile (auth required)
- `GET /api/users/stories` - Get user's stories (auth required)
