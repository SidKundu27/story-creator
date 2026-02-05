# Story Creator - Choose Your Own Adventure Platform

A fullstack web application for creating and playing interactive choose-your-own-adventure stories.

## Features

- **Story Creation**: Build branching narratives with multiple paths and endings
- **User Accounts**: Register, login, and manage your stories
- **Story Feed**: Browse and play community-created stories
- **Interactive Gameplay**: Make choices that determine the story outcome
- **Future**: Export stories as standalone apps or websites

## Tech Stack

- **Frontend**: React, React Router, Axios
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
   - React frontend on http://localhost:3000

## Project Structure

```
story-creator/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Context API
│   │   ├── services/    # API services
│   │   └── App.js
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
