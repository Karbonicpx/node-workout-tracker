import { checkAuth, logout } from './auth.js';
import { loadWorkouts } from './workouts.js';
import { updateStats } from './stats.js';
import { addExerciseField } from './exercises.js';
import { openCreateModal, closeModal } from './modal.js';

document.addEventListener('DOMContentLoaded', async () => {
    if (!checkAuth()) return;

    const workouts = await loadWorkouts();
    updateStats(workouts);

    document.getElementById('new-workout-btn').onclick = openCreateModal;
    document.getElementById('add-exercise-btn').onclick = addExerciseField;
    document.getElementById('logout-btn').onclick = logout;
});
