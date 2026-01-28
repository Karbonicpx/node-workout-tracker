import { token } from './auth.js';

const BASE_URL = 'http://localhost:3000';

async function request(url, options = {}) {
    const response = await fetch(BASE_URL + url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro na requisição');
    }

    return response.json();
}

export const api = {
    getUser: () => request('/users/me'),
    getWorkouts: () => request('/users/me/workouts'),
    createWorkout: (data) =>
        request('/users/me/workouts', { method: 'POST', body: JSON.stringify(data) }),
    updateWorkout: (id, data) =>
        request(`/users/me/workouts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteWorkout: (id) =>
        request(`/users/me/workouts/${id}`, { method: 'DELETE' })
};
