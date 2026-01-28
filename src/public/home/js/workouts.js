import { api } from './api.js';
import { formatDate, isFutureDate } from './utils.js';

export async function loadWorkouts(filter = 'all') {
    const workouts = await api.getWorkouts();

    let filtered = workouts;
    if (filter === 'active') filtered = workouts.filter(w => w.status === 'active');
    if (filter === 'inactive') filtered = workouts.filter(w => w.status === 'inactive');
    if (filter === 'upcoming') filtered = workouts.filter(w => isFutureDate(w.date));

    renderWorkouts(filtered);
    return workouts;
}

export function renderWorkouts(workouts) {
    const list = document.getElementById('workouts-list');
    const empty = document.getElementById('empty-state');

    if (!workouts.length) {
        list.innerHTML = '';
        empty.style.display = 'flex';
        return;
    }

    empty.style.display = 'none';

    list.innerHTML = workouts.map(w => `
        <div class="workout-card">
            <h3>${w.title}</h3>
            <span>${formatDate(w.date)}</span>
        </div>
    `).join('');
}
