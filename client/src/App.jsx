import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import StoryFeed from './pages/StoryFeed';
import StoryPlayer from './pages/story/StoryPlayer';
import StoryCreatorMultiStep from './pages/story-creator/StoryCreatorMultiStep';
import MyStories from './pages/MyStories';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/feed" element={<StoryFeed />} />
            <Route path="/play/:id" element={<StoryPlayer />} />
            <Route 
              path="/create" 
              element={
                <ProtectedRoute>
                  <StoryCreatorMultiStep />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edit/:id" 
              element={
                <ProtectedRoute>
                  <StoryCreatorMultiStep />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-stories" 
              element={
                <ProtectedRoute>
                  <MyStories />
                </ProtectedRoute>
              } 
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
