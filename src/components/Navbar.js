import { faChartLine, faDumbbell, faSparkles } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-brand">Health Tracker</div>
      <div className="nav-links">
        <Link to="/" className="nav-link">
          <FontAwesomeIcon icon={faChartLine} /> Dashboard
        </Link>
        <Link to="/fitness" className="nav-link">
          <FontAwesomeIcon icon={faDumbbell} /> Fitness
        </Link>
        <Link to="/skincare" className="nav-link">
          <FontAwesomeIcon icon={faSparkles} /> Skincare
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
