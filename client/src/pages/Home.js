import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <div className="container">
          <h1>Create Your Own Adventure</h1>
          <p className="hero-subtitle">
            Build interactive stories where every choice matters. 
            Share your creations with the world.
          </p>
          <div className="hero-actions">
            <Link to="/feed" className="btn btn-primary btn-large">
              Browse Stories
            </Link>
            <Link to="/create" className="btn btn-success btn-large">
              Start Creating
            </Link>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="features">
          <div className="feature">
            <div className="feature-icon">✍️</div>
            <h3>Create Stories</h3>
            <p>Build branching narratives with multiple paths and endings</p>
          </div>

          <div className="feature">
            <div className="feature-icon">🎮</div>
            <h3>Interactive Gameplay</h3>
            <p>Let players make choices that determine the outcome</p>
          </div>

          <div className="feature">
            <div className="feature-icon">🌐</div>
            <h3>Share & Play</h3>
            <p>Publish your stories and explore creations from the community</p>
          </div>

          <div className="feature">
            <div className="feature-icon">📱</div>
            <h3>Export (Coming Soon)</h3>
            <p>Turn your stories into standalone apps or websites</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
