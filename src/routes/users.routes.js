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

    // Corrigido: Gera ID único e cria workout com estrutura completa

    // If it is the first workout, set as 1, if not, set as the current length of workouts array + 1
    const workoutId = user.workouts.length > 0 
        ? Math.max(...user.workouts.map(w => w.id)) + 1 
        : 1;
    

    const newWorkout = {
        id: workoutId,
        title: req.body.title,
        type: req.body.type,
        duration: req.body.duration,
        date: req.body.date,
        status: req.body.status,  
        description: req.body.description || '',
        exercises: req.body.exercises || []  
    };

    user.workouts.push(newWorkout);
    res.status(201).json(newWorkout);  // Returns new workout
});

// Updating workout
router.put('/me/workouts/:workoutId', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const workoutId = parseInt(req.params.workoutId);
    const workoutIndex = user.workouts.findIndex(w => w.id === workoutId);

    if (workoutIndex === -1) {
        return res.status(404).json({ message: 'Workout not found' });
    }

    // Updating workout using workoutIndex to find it and setting his id to the existent id
    const updatedWorkout = {
        ...user.workouts[workoutIndex],  
        ...req.body,                      
        id: workoutId                     
    };

    user.workouts[workoutIndex] = updatedWorkout;
    res.json(updatedWorkout);  
});

// Delete workout
router.delete('/me/workouts/:workoutId', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const workoutId = parseInt(req.params.workoutId);
    const workoutIndex = user.workouts.findIndex(w => w.id === workoutId);

    if (workoutIndex === -1) {
        return res.status(404).json({ message: 'Workout not found' });
    }

    user.workouts.splice(workoutIndex, 1);
    res.json({ message: 'Workout deleted' });
});

// Adding exercises to the workout
router.post('/me/workouts/:workoutId/exercises', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const workoutId = parseInt(req.params.workoutId);
    const workout = user.workouts.find(w => w.id === workoutId);

    if (!workout) {
        return res.status(404).json({ message: 'Workout not found' });
    }

    // Generate Id for new exercise
    const exerciseId = workout.exercises.length > 0
        ? Math.max(...workout.exercises.map(e => e.id)) + 1
        : 1;

    const newExercise = {
        id: exerciseId,
        name: req.body.name,
        sets: req.body.sets,
        reps: req.body.reps,
        weight: req.body.weight
    };

    workout.exercises.push(newExercise);
    res.status(201).json(newExercise);
});

module.exports = router;