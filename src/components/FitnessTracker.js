import { faEdit, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { useState } from 'react';
import './FitnessTracker.css';

function FitnessTracker({ fitnessData, setFitnessData }) {
  const [newMeal, setNewMeal] = useState({ name: '', calories: '', protein: '' });
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId !== null) {
      // Edit existing meal
      const updatedMeals = fitnessData.meals.map(meal =>
        meal.id === editingId
          ? { ...meal, ...newMeal, date: new Date().toISOString() }
          : meal
      );
      setFitnessData({
        ...fitnessData,
        meals: updatedMeals,
        totalCalories: updatedMeals.reduce((sum, meal) => sum + Number(meal.calories), 0),
        totalProtein: updatedMeals.reduce((sum, meal) => sum + Number(meal.protein), 0)
      });
      setEditingId(null);
    } else {
      // Add new meal
      const meal = {
        id: Date.now(),
        ...newMeal,
        calories: Number(newMeal.calories),
        protein: Number(newMeal.protein),
        date: new Date().toISOString()
      };
      const updatedMeals = [...fitnessData.meals, meal];
      setFitnessData({
        ...fitnessData,
        meals: updatedMeals,
        totalCalories: fitnessData.totalCalories + meal.calories,
        totalProtein: fitnessData.totalProtein + meal.protein
      });
    }
    setNewMeal({ name: '', calories: '', protein: '' });
  };

  const handleDelete = (id) => {
    const mealToDelete = fitnessData.meals.find(meal => meal.id === id);
    const updatedMeals = fitnessData.meals.filter(meal => meal.id !== id);
    setFitnessData({
      ...fitnessData,
      meals: updatedMeals,
      totalCalories: fitnessData.totalCalories - mealToDelete.calories,
      totalProtein: fitnessData.totalProtein - mealToDelete.protein
    });
  };

  const handleEdit = (meal) => {
    setNewMeal({
      name: meal.name,
      calories: meal.calories.toString(),
      protein: meal.protein.toString()
    });
    setEditingId(meal.id);
  };

  return (
    <div className="fitness-tracker">
      <h1>Fitness Tracker</h1>
      
      <div className="goals-section">
        <h2>Daily Goals</h2>
        <p>Calories: {fitnessData.totalCalories} / {fitnessData.calorieGoal}</p>
        <p>Protein: {fitnessData.totalProtein}g / {fitnessData.proteinGoal}g</p>
        <div className="progress-bars">
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{width: `${Math.min((fitnessData.totalCalories / fitnessData.calorieGoal) * 100, 100)}%`}}
            ></div>
          </div>
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{width: `${Math.min((fitnessData.totalProtein / fitnessData.proteinGoal) * 100, 100)}%`}}
            ></div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="meal-form">
        <input
          type="text"
          placeholder="Meal name"
          value={newMeal.name}
          onChange={(e) => setNewMeal({...newMeal, name: e.target.value})}
          required
        />
        <input
          type="number"
          placeholder="Calories"
          value={newMeal.calories}
          onChange={(e) => setNewMeal({...newMeal, calories: e.target.value})}
          required
        />
        <input
          type="number"
          placeholder="Protein (g)"
          value={newMeal.protein}
          onChange={(e) => setNewMeal({...newMeal, protein: e.target.value})}
          required
        />
        <button type="submit">
          <FontAwesomeIcon icon={editingId ? faEdit : faPlus} />
          {editingId ? ' Update Meal' : ' Add Meal'}
        </button>
      </form>

      <div className="meals-list">
        <h2>Today's Meals</h2>
        {fitnessData.meals
          .filter(meal => new Date(meal.date).toDateString() === new Date().toDateString())
          .map(meal => (
            <motion.div
              key={meal.id}
              className="meal-item"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="meal-info">
                <h3>{meal.name}</h3>
                <p>Calories: {meal.calories} | Protein: {meal.protein}g</p>
              </div>
              <div className="meal-actions">
                <button onClick={() => handleEdit(meal)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button onClick={() => handleDelete(meal.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
}

export default FitnessTracker;
