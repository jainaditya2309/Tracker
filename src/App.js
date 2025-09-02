import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import FitnessTracker from './components/FitnessTracker';
import Navbar from './components/Navbar';
import SkincareTracker from './components/SkincareTracker';

function App() {
  const [fitnessData, setFitnessData] = useState(() => {
    const saved = localStorage.getItem('fitnessData');
    return saved ? JSON.parse(saved) : {
      meals: [],
      totalCalories: 0,
      totalProtein: 0,
      calorieGoal: 2000,
      proteinGoal: 150
    };
  });

  const [skincareData, setSkincareData] = useState(() => {
    const saved = localStorage.getItem('skincareData');
    return saved ? JSON.parse(saved) : {
      routines: [],
      products: [],
      lastRoutine: null
    };
  });

  useEffect(() => {
    localStorage.setItem('fitnessData', JSON.stringify(fitnessData));
  }, [fitnessData]);

  useEffect(() => {
    localStorage.setItem('skincareData', JSON.stringify(skincareData));
  }, [skincareData]);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <Dashboard 
              fitnessData={fitnessData} 
              skincareData={skincareData} 
            />
          } />
          <Route path="/fitness" element={
            <FitnessTracker 
              fitnessData={fitnessData} 
              setFitnessData={setFitnessData} 
            />
          } />
          <Route path="/skincare" element={
            <SkincareTracker 
              skincareData={skincareData} 
              setSkincareData={setSkincareData} 
            />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
