import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard({ fitnessData, skincareData }) {
  const last7DaysCalories = fitnessData.meals
    .slice(-7)
    .reduce((acc, meal) => {
      const date = new Date(meal.date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + meal.calories;
      return acc;
    }, {});

  const caloriesChartData = {
    labels: Object.keys(last7DaysCalories),
    datasets: [
      {
        label: 'Daily Calories',
        data: Object.values(last7DaysCalories),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const routineCompliance = skincareData.routines
    .slice(-7)
    .reduce((acc, routine) => {
      const date = new Date(routine.date).toLocaleDateString();
      acc[date] = routine.completed ? 100 : 0;
      return acc;
    }, {});

  const skincareChartData = {
    labels: Object.keys(routineCompliance),
    datasets: [
      {
        label: 'Skincare Routine Compliance (%)',
        data: Object.values(routineCompliance),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="stats-container">
        <div className="stat-card">
          <h3>Today's Stats</h3>
          <p>Calories: {fitnessData.totalCalories} / {fitnessData.calorieGoal}</p>
          <p>Protein: {fitnessData.totalProtein}g / {fitnessData.proteinGoal}g</p>
        </div>
        
        <div className="stat-card">
          <h3>Skincare Routine</h3>
          <p>Products Used: {skincareData.products.length}</p>
          <p>Last Routine: {skincareData.lastRoutine ? new Date(skincareData.lastRoutine).toLocaleDateString() : 'No routine logged'}</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart">
          <h3>Calorie Intake - Last 7 Days</h3>
          <Line data={caloriesChartData} />
        </div>
        
        <div className="chart">
          <h3>Skincare Routine Compliance</h3>
          <Line data={skincareChartData} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
