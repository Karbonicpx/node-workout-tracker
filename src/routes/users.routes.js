
const express = require('express');
const authenticateToken = require('../middlewares/authenticateToken');
const users = require('../data/users');

const router = express.Router();

// Get authenticated user data

router.get('/me', authenticateToken, (req, res) => {

  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json(user.toJSON());
});

// Get all workouts of authenticated user
router.get('/me/workouts', authenticateToken, (req, res) => {

  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json(user.workouts);

});

// Add workout to authenticated user
router.post('/me/workouts', authenticateToken, (req, res) => {

  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.addWorkout(req.body);
  res.status(201).json({message: "Workout added succesfully! "});

});

// Updating workout
router.put('/me/workouts/:workoutId', authenticateToken, (req, res) => {

  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const workout = user.workouts.find(
    w => w.id === parseInt(req.params.workoutId)
  );

  if (!workout) {
    return res.status(404).json({ message: 'Workout not found' });
  }

  // Basically copies the values from the body to the workout, if they are correct
  Object.assign(workout, req.body);
  res.json({ message: 'Workout updated succesfully' });

});

// Delete workout
router.delete('/me/workouts/:workoutId', authenticateToken, (req, res) => {

  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const index = user.workouts.findIndex(
    w => w.id === parseInt(req.params.workoutId)
  );

  if (index <= -1) {
    return res.status(404).json({ message: 'Workout not found' });
  }

  user.workouts.splice(index, 1);
  res.json({ message: 'Workout deleted' });
});

// Adding exercises to the workout
router.post('/me/workouts/:workoutId/exercises', authenticateToken, (req, res) => {

  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const success = user.addExercise(
    parseInt(req.params.workoutId),
    req.body
  );

  if (!success) {
    return res.status(404).json({ message: 'Workout not found' });
  }

  res.status(201).json({ message: 'Exercise added succesfully' });
});

module.exports = router;
