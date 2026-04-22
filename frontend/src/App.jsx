import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <div className="logo">
            <span className="logo-icon">📈</span>
            <h1>PriceTracker Pro</h1>
          </div>
          <nav>
            <a href="/" className="nav-link active">Dashboard</a>
            <a href="#" className="nav-link">Settings</a>
          </nav>
        </header>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
