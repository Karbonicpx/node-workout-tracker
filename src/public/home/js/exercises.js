export let exerciseCounter = 0;
export const exercisesContainer = document.getElementById('exercises-container');

export function addExerciseField() {
    exerciseCounter++;

    exercisesContainer.insertAdjacentHTML('beforeend', `
        <div class="exercise-item">
            <input class="exercise-name" required>
            <input type="number" class="exercise-sets" value="3">
            <input type="number" class="exercise-reps" value="10">
            <input type="number" class="exercise-weight" value="0">
            <button type="button" class="remove-exercise-btn">X</button>
        </div>
    `);
}

export function collectExercisesData() {
    return [...exercisesContainer.querySelectorAll('.exercise-item')]
        .map(item => ({
            name: item.querySelector('.exercise-name').value.trim(),
            sets: +item.querySelector('.exercise-sets').value,
            reps: +item.querySelector('.exercise-reps').value,
            weight: +item.querySelector('.exercise-weight').value
        }))
        .filter(e => e.name);
}

export function populateExercisesFields(exercises = []) {
    exercisesContainer.innerHTML = '';
    exerciseCounter = 0;
    exercises.forEach(addExerciseField);
}
