import { getTodayDate } from './utils.js';

const modal = document.getElementById('workout-modal');

export function openCreateModal() {
    modal.classList.add('active');
    document.getElementById('workout-date').value = getTodayDate();
}

export function closeModal() {
    modal.classList.remove('active');
}
