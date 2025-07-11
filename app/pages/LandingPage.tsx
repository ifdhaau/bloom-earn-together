import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './landing.css';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate('/dashboard');
    }, 6000); // Redirects to dashboard after 6 seconds
  }, [navigate]);

  return (
    <div className="landing-container">
      <div className="logo-glow">🌱 Bloom Together</div>
      <h1 className="tagline">Grow wealth as a community. Reinvest. Earn. Repeat.</h1>
      <button onClick={() => navigate('/signup')} className="start-button">🚀 Get Started</button>
    </div>
  );
};

export default LandingPage;
