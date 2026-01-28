import { isFutureDate } from './utils.js';

export function updateStats(workouts) {
    document.getElementById('total-workouts').textContent = workouts.length;
    document.getElementById('active-workouts').textContent =
        workouts.filter(w => w.status === 'active').length;
    document.getElementById('upcoming-workouts').textContent =
        workouts.filter(w => isFutureDate(w.date)).length;
}
