// Elementos DOM
const newWorkoutBtn = document.getElementById('new-workout-btn');
const firstWorkoutBtn = document.getElementById('first-workout-btn');
const workoutModal = document.getElementById('workout-modal');
const modalTitle = document.getElementById('modal-title');
const closeModalButtons = document.querySelectorAll('.close-modal');
const workoutForm = document.getElementById('workout-form');
const workoutsList = document.getElementById('workouts-list');
const emptyState = document.getElementById('empty-state');
const totalWorkoutsEl = document.getElementById('total-workouts');
const activeWorkoutsEl = document.getElementById('active-workouts');
const upcomingWorkoutsEl = document.getElementById('upcoming-workouts');
const filterButtons = document.querySelectorAll('.filter-btn');
const addExerciseBtn = document.getElementById('add-exercise-btn');
const exercisesContainer = document.getElementById('exercises-container');
const userNameEl = document.getElementById('user-name');
const logoutBtn = document.getElementById('logout-btn');

let currentFilter = 'all';
let editingWorkoutId = null;
let exerciseCounter = 1;

// Get token from localStorage
const token = localStorage.getItem('accessToken');

// Function to deny not authenticated user entry
function checkAuth() {
    if (!token) {
        window.location.href = '../login/index.html';
        return false;
    }
    
    try {
        // Token req
        const payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
        
        // Verifying if the token expired
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedPayload.exp && decodedPayload.exp < currentTime) {
            // Token expired
            localStorage.removeItem('accessToken');
            localStorage.removeItem('username');
            window.location.href = '../login/index.html';
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Error checking auth:', error);
        // If error, remove invalid token
        localStorage.removeItem('accessToken');
        localStorage.removeItem('username');
        window.location.href = '../login/index.html';
        return false;
    }
}

// Function to extract username from token
function getUsernameFromToken() {
    try {
        if (!token) return null;
        
        // Decoding JWT
        const payload = token.split('.')[1];
        const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        const userData = JSON.parse(decodedPayload);
        
        return userData.username || userData.email?.split('@')[0] || 'Usuário';
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}

// Function to load user data
async function loadUserData() {
    try {
        if (!token) {
            console.error('No access token found');
            return;
        }

        const response = await fetch('http://localhost:3000/users/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error('Failed to load user data:', response.status);
            const username = getUsernameFromToken();
            if (username) {
                userNameEl.textContent = username;
            }
            return;
        }

        const userData = await response.json();
        
        // Show username
        if (userData.username) {
            userNameEl.textContent = userData.username;
            localStorage.setItem('username', userData.username);
        } else if (userData.email) {
            userNameEl.textContent = userData.email.split('@')[0];
            localStorage.setItem('username', userData.email.split('@')[0]);
        }
        
    } catch (error) {
        console.error('Error loading user data:', error);
        const savedUsername = localStorage.getItem('username');
        const tokenUsername = getUsernameFromToken();
        
        if (savedUsername) {
            userNameEl.textContent = savedUsername;
        } else if (tokenUsername) {
            userNameEl.textContent = tokenUsername;
        } else {
            userNameEl.textContent = 'Usuário';
        }
    }
}

// Function to user logout
function handleLogout() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('username');
        window.location.href = '../login/index.html';
    }
}

// Aux date functions
function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

function isFutureDate(dateString) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const workoutDate = new Date(dateString);
    return workoutDate > today;
}

// Loading page
document.addEventListener('DOMContentLoaded', function() {
    if (!checkAuth()) return;
    
    const dateInput = document.getElementById('workout-date');
    if (dateInput) {
        dateInput.value = getTodayDate();
    }
    
    loadUserData();
    loadWorkouts();
    
    newWorkoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openWorkoutModalCreate();
    });
    
    firstWorkoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openWorkoutModalCreate();
    });
    
    addExerciseBtn.addEventListener('click', addExerciseField);
    
    logoutBtn.addEventListener('click', handleLogout);
    
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            closeWorkoutModal();
        });
    });
    
    workoutModal.addEventListener('click', function(e) {
        if (e.target === workoutModal) {
            closeWorkoutModal();
        }
    });
    
    workoutForm.addEventListener('submit', handleFormSubmit);
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            loadWorkouts();
        });
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && workoutModal.classList.contains('active')) {
            closeWorkoutModal();
        }
    });
    
    exercisesContainer.addEventListener('click', function(e) {
        if (e.target.closest('.remove-exercise-btn')) {
            e.preventDefault();
            const exerciseItem = e.target.closest('.exercise-item');
            if (exerciseItem) {
                exerciseItem.remove();
                updateExerciseIndexes();
            }
        }
    });
});

// Function to add a new exercise field
function addExerciseField() {
    exerciseCounter++;
    
    const exerciseHTML = `
        <div class="exercise-item" data-exercise-index="${exerciseCounter}">
            <div class="form-row">
                <div class="form-group" style="flex: 2;">
                    <label>Nome do Exercício</label>
                    <input type="text" class="exercise-name" placeholder="Ex: Supino Reto" required>
                </div>
                <div class="form-group">
                    <label>Sets</label>
                    <input type="number" class="exercise-sets" min="1" max="10" value="3" required>
                </div>
                <div class="form-group">
                    <label>Reps</label>
                    <input type="number" class="exercise-reps" min="1" max="50" value="10" required>
                </div>
                <div class="form-group">
                    <label>Peso (kg)</label>
                    <input type="number" class="exercise-weight" min="0" step="0.5" value="0">
                </div>
                <div class="form-group" style="width: 40px;">
                    <label>&nbsp;</label>
                    <button type="button" class="remove-exercise-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    exercisesContainer.insertAdjacentHTML('beforeend', exerciseHTML);
    
    // Show remove button if there is more than one
    if (exerciseCounter > 1) {
        const firstRemoveBtn = exercisesContainer.querySelector('.exercise-item:first-child .remove-exercise-btn');
        if (firstRemoveBtn) {
            firstRemoveBtn.style.display = 'block';
        }
    }
}

// Function to update exercise indexes after removal
function updateExerciseIndexes() {
    const exerciseItems = exercisesContainer.querySelectorAll('.exercise-item');
    exerciseItems.forEach((item, index) => {
        item.setAttribute('data-exercise-index', index);
        const removeBtn = item.querySelector('.remove-exercise-btn');
        if (removeBtn) {
            // Show remove button if there is more than 1 exercise
            removeBtn.style.display = exerciseItems.length > 1 ? 'block' : 'none';
        }
    });
    exerciseCounter = exerciseItems.length;
}

// Function to collect exercise data from form
function collectExercisesData() {
    const exerciseItems = exercisesContainer.querySelectorAll('.exercise-item');
    const exercises = [];
    
    exerciseItems.forEach((item, index) => {
        const name = item.querySelector('.exercise-name').value.trim();
        const sets = parseInt(item.querySelector('.exercise-sets').value) || 0;
        const reps = parseInt(item.querySelector('.exercise-reps').value) || 0;
        const weight = parseFloat(item.querySelector('.exercise-weight').value) || 0;
        
        if (name) {
            exercises.push({
                id: index + 1, // Add new index for each exercise
                name: name,
                sets: sets,
                reps: reps,
                weight: weight
            });
        }
    });
    
    return exercises;
}

// Function to populate exercise fields from workout data
function populateExercisesFields(exercises) {
    // Limpa todos os campos de exercício
    exercisesContainer.innerHTML = '';
    exerciseCounter = 0;
    
    if (exercises && exercises.length > 0) {
        exercises.forEach((exercise, index) => {
            exerciseCounter++;
            const exerciseHTML = `
                <div class="exercise-item" data-exercise-index="${index}">
                    <div class="form-row">
                        <div class="form-group" style="flex: 2;">
                            <label>Nome do Exercício</label>
                            <input type="text" class="exercise-name" placeholder="Ex: Supino Reto" 
                                   value="${exercise.name || ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Sets</label>
                            <input type="number" class="exercise-sets" min="1" max="10" 
                                   value="${exercise.sets || 3}" required>
                        </div>
                        <div class="form-group">
                            <label>Reps</label>
                            <input type="number" class="exercise-reps" min="1" max="50" 
                                   value="${exercise.reps || 10}" required>
                        </div>
                        <div class="form-group">
                            <label>Peso (kg)</label>
                            <input type="number" class="exercise-weight" min="0" step="0.5" 
                                   value="${exercise.weight || 0}">
                        </div>
                        <div class="form-group" style="width: 40px;">
                            <label>&nbsp;</label>
                            <button type="button" class="remove-exercise-btn" 
                                    ${exercises.length === 1 ? 'style="display: none;"' : ''}>
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            exercisesContainer.insertAdjacentHTML('beforeend', exerciseHTML);
        });
    } else {
        // Adiciona um campo de exercício vazio
        addExerciseField();
    }
}

// Getting all user workouts from backend
async function getUserWorkouts() {
    try {
        if (!token) {
            console.error('No access token found');
            return [];
        }

        const response = await fetch('http://localhost:3000/users/me/workouts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error('Request failed:', response.status);
            return [];
        }

        const workouts = await response.json();
        return workouts;

    } catch (error) {
        console.error('Error fetching workouts:', error);
        return [];
    }
}

// Creating user workout and pushing to the backend
async function createUserWorkout(workoutData) {
    try {
        if (!token) {
            console.error('No access token found');
            return null;
        }

        console.log('Enviando dados para criação:', workoutData);

        const response = await fetch('http://localhost:3000/users/me/workouts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(workoutData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Request failed:', response.status, errorData);
            throw new Error(errorData.message || 'Erro ao criar treino');
        }

        const workout = await response.json();
        console.log('Treino criado com sucesso:', workout);
        return workout;

    } catch (error) {
        console.error('Error creating workout:', error);
        throw error;
    }
}

// Updating workout in backend
async function updateUserWorkout(workoutId, workoutData) {
    try {
        if (!token) {
            console.error('No access token found');
            return null;
        }

        console.log('Enviando dados para atualização:', workoutData);

        const response = await fetch(`http://localhost:3000/users/me/workouts/${workoutId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(workoutData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Request failed:', response.status, errorData);
            throw new Error(errorData.message || 'Erro ao atualizar treino');
        }

        const workout = await response.json();
        console.log('Treino atualizado com sucesso:', workout);
        return workout;

    } catch (error) {
        console.error('Error updating workout:', error);
        throw error;
    }
}

// Deleting workout from backend
async function deleteUserWorkout(workoutId) {
    try {
        if (!token) {
            console.error('No access token found');
            return false;
        }

        const response = await fetch(`http://localhost:3000/users/me/workouts/${workoutId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error('Request failed:', response.status);
            throw new Error('Erro ao excluir treino');
        }

        return true;

    } catch (error) {
        console.error('Error deleting workout:', error);
        throw error;
    }
}

// Open modal for creating a new workout
function openWorkoutModalCreate() {
    modalTitle.textContent = "Novo Treino";
    workoutForm.reset();
    document.getElementById('workout-id').value = '';
    document.getElementById('workout-date').value = getTodayDate();
    document.getElementById('workout-status').value = 'active'; // FORÇA ativo como padrão
    
    // Reset exercise fields
    exercisesContainer.innerHTML = '';
    exerciseCounter = 0;
    addExerciseField();
    
    workoutModal.classList.add('active');
    document.getElementById('workout-name').focus();
    editingWorkoutId = null;
}

// Open modal to edit the workout (same modal as the create one)
async function openWorkoutModalEdit(workoutId) {
    try {
        const workouts = await getUserWorkouts();
        const workout = workouts.find(w => w.id === workoutId);
        
        if (!workout) {
            alert('Treino não encontrado');
            return;
        }
        
        console.log('Carregando treino para edição:', workout);
        
        modalTitle.textContent = "Editar Treino";
        document.getElementById('workout-id').value = workout.id;
        document.getElementById('workout-name').value = workout.title;
        document.getElementById('workout-type').value = workout.type;
        document.getElementById('workout-duration').value = workout.duration;
        document.getElementById('workout-date').value = workout.date;
        document.getElementById('workout-status').value = workout.status;
        document.getElementById('workout-description').value = workout.description || '';
        
        // Populate exercises fields
        populateExercisesFields(workout.exercises);
        
        workoutModal.classList.add('active');
        document.getElementById('workout-name').focus();
        editingWorkoutId = workoutId;
        
    } catch (error) {
        console.error('Error loading workout for edit:', error);
        alert('Erro ao carregar treino para edição');
    }
}

// Closing modal
function closeWorkoutModal() {
    workoutModal.classList.remove('active');
    editingWorkoutId = null;
}

// Load and render workouts in the front-end
async function loadWorkouts() {
    try {
        const workouts = await getUserWorkouts();
        console.log('Treinos carregados:', workouts);
        
        let filteredWorkouts = workouts;
        const today = new Date().toISOString().split('T')[0];
        
        if (currentFilter === 'active') {
            filteredWorkouts = workouts.filter(w => w.status === 'active');
        } else if (currentFilter === 'inactive') {
            filteredWorkouts = workouts.filter(w => w.status === 'inactive');
        } else if (currentFilter === 'upcoming') {
            filteredWorkouts = workouts.filter(w => isFutureDate(w.date));
        }
        
        renderWorkouts(filteredWorkouts);
        updateStats(workouts);
        
    } catch (error) {
        console.error('Error loading workouts:', error);
        workoutsList.innerHTML = '';
        emptyState.style.display = 'flex';
    }
}

// Rendering workouts by creating new DOM elements
function renderWorkouts(workouts) {
    if (!workouts || workouts.length === 0) {
        workoutsList.innerHTML = '';
        emptyState.style.display = 'flex';
        return;
    }
    
    emptyState.style.display = 'none';
    
    workoutsList.innerHTML = workouts.map(workout => {
        const typeDisplay = {
            'peito': 'Peito',
            'costas': 'Costas',
            'pernas': 'Pernas',
            'ombros': 'Ombros',
            'braços': 'Braços',
            'fullbody': 'Full Body',
            'cardio': 'Cardio'
        };
        
        let cardClasses = 'workout-card';
        if (workout.status === 'active') cardClasses += ' active';
        if (workout.status === 'inactive') cardClasses += ' inactive';
        if (isFutureDate(workout.date)) cardClasses += ' upcoming';
        
        const statusClass = workout.status === 'active' ? 'status-active' : 'status-inactive';
        const statusText = workout.status === 'active' ? 'Ativo' : 'Inativo';
        
        return `
            <div class="${cardClasses}">
                <div class="workout-header">
                    <div>
                        <div class="workout-title">${workout.title}</div>
                        <div class="workout-date">${formatDate(workout.date)}</div>
                    </div>
                    <div class="workout-type">${typeDisplay[workout.type] || workout.type}</div>
                </div>
                
                ${workout.description ? `
                    <div class="workout-description">
                        ${workout.description}
                    </div>
                ` : ''}
                
                ${workout.exercises && workout.exercises.length > 0 ? `
                    <div class="workout-exercises">
                        <h4>Exercícios:</h4>
                        <ul>
                            ${workout.exercises.map(exercise => `
                                <li>
                                    <i class="fas fa-dumbbell"></i> 
                                    <div class="exercise-details">
                                        <span class="exercise-name">${exercise.name}</span>
                                        <span class="exercise-specs">
                                            ${exercise.sets || 0}x${exercise.reps || 0}
                                            ${exercise.weight && exercise.weight > 0 ? `@ ${exercise.weight}kg` : ''}
                                        </span>
                                    </div>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <div class="workout-footer">
                    <div class="workout-info">
                        <div class="workout-duration">
                            <i class="fas fa-clock"></i>
                            <span>${workout.duration} min</span>
                        </div>
                        <div class="workout-status">
                            <div class="status-badge ${statusClass}">${statusText}</div>
                        </div>
                    </div>
                    <div class="workout-actions">
                        <button class="action-btn edit-btn" onclick="openWorkoutModalEdit(${workout.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteWorkout(${workout.id})" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Handling submit of the form in the modal
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const workoutName = document.getElementById('workout-name').value;
    const workoutDate = document.getElementById('workout-date').value;
    const workoutDuration = document.getElementById('workout-duration').value;
    const workoutStatus = document.getElementById('workout-status').value;
    
    if (!workoutName.trim()) {
        alert('Por favor, insira um nome para o treino');
        return;
    }
    
    const exercises = collectExercisesData();
    if (exercises.length === 0) {
        alert('Por favor, adicione pelo menos um exercício');
        return;
    }
    
    // CORRIGIDO: Estrutura correta dos dados
    const workoutData = {
        title: workoutName,
        type: document.getElementById('workout-type').value,
        duration: parseInt(workoutDuration),
        date: workoutDate,
        status: workoutStatus, // Usa o valor do select
        description: document.getElementById('workout-description').value,
        exercises: exercises
    };
    
    console.log('Dados preparados para envio:', workoutData);
    
    try {
        const submitBtn = document.getElementById('submit-workout-btn');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
        
        let result;
        if (editingWorkoutId) {
            result = await updateUserWorkout(editingWorkoutId, workoutData);
        } else {
            result = await createUserWorkout(workoutData);
        }
    
        await loadWorkouts();
        closeWorkoutModal();
        
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
    } catch (error) {
        console.error('Error saving workout:', error);
        alert('Erro ao salvar treino: ' + error.message);
        
        const submitBtn = document.getElementById('submit-workout-btn');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Salvar Treino';
    }
}

// Delete workout
async function deleteWorkout(workoutId) {
    if (!confirm('Tem certeza que deseja excluir este treino?')) return;
    
    try {
        await deleteUserWorkout(workoutId);
        await loadWorkouts();
    } catch (error) {
        console.error('Error deleting workout:', error);
        alert('Erro ao excluir treino: ' + error.message);
    }
}

// Updating stats
function updateStats(workouts) {
    if (!workouts) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    totalWorkoutsEl.textContent = workouts.length;
    
    const activeCount = workouts.filter(w => w.status === 'active').length;
    activeWorkoutsEl.textContent = activeCount;
    
    const upcomingCount = workouts.filter(w => isFutureDate(w.date)).length;
    upcomingWorkoutsEl.textContent = upcomingCount;
}

// Global functions for onclick buttons
window.openWorkoutModalEdit = openWorkoutModalEdit;
window.deleteWorkout = deleteWorkout;