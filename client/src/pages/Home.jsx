import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">
          <img src="/image.png" alt="Logo" className="title-logo" />
          business.io
        </h1>
        <p className="home-subtitle">Play Free Online with Friends</p>
        
        <div className="home-features">
          <div className="feature">
            <span className="feature-icon">🗺️</span>
            <h3>Multiple Maps</h3>
            <p>8 unique themed boards to explore</p>
          </div>
          <div className="feature">
            <span className="feature-icon">👥</span>
            <h3>Multiplayer</h3>
            <p>Play with up to 8 friends online</p>
          </div>
          <div className="feature">
            <span className="feature-icon">⚙️</span>
            <h3>Custom Rules</h3>
            <p>Customize gameplay your way</p>
          </div>
          <div className="feature">
            <span className="feature-icon">💰</span>
            <h3>Earn & Unlock</h3>
            <p>Win games to unlock premium maps</p>
          </div>
        </div>

        <div className="home-actions">
          {user ? (
            <Link to="/lobby" className="btn-large btn-play">
              Play Now →
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-large btn-play">
                Sign In to Play
              </Link>
              <Link to="/register" className="btn-large btn-secondary">
                Create Account
              </Link>
            </>
          )}
        </div>

        <div className="home-info">
          <p>✨ Free forever • No downloads • Play anywhere</p>
          <p>Made with ❤️ by UltraBot05</p>
        </div>
      </div>
    </div>
  );
}
