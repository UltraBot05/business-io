import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import Lobby from './pages/Lobby';
import GameRoom from './pages/GameRoom';
import TestLobby from './pages/TestLobby';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import './App.css';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<TestLobby />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/lobby" 
            element={
              <PrivateRoute>
                <Lobby />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <div>Profile Page - Coming Soon</div>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/room/:roomCode" 
            element={<GameRoom />} 
          />
          <Route 
            path="/game/:roomCode" 
            element={<GameRoom />} 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
