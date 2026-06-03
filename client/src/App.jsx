import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/layout/Navbar';
import ServerStatusInitializer from './components/ServerStatusInitializer';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import StoryFeed from './pages/StoryFeed';
import BrowseV2 from './pages/BrowseV2';
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
          <ServerStatusInitializer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Archived Browse Route */}
            <Route path="/browse-v1-archived" element={<StoryFeed />} />
            <Route path="/feed" element={<BrowseV2 />} />
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
