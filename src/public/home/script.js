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
let currentFilter = 'all';


// Getting all user workouts
async function getUserWorkouts() {
    try {
        // Get token from localStorage
        const token = localStorage.getItem('accessToken');

        if (!token) {
            console.error('No access token found');
            return;
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
            return;
        }

        const workouts = await response.json();
        console.log(JSON.stringify(workouts));
        return JSON.stringify(workouts);

    } catch (error) {
        console.error('Error fetching workouts:', error);
    }
}


let workouts = JSON.parse(localStorage.getItem('workouts')) || [
    {
        id: 1,
        name: "Treino de Peito e Tríceps",
        type: "peito",
        duration: 60,
        date: getTodayDate(),
        status: "active",
        description: "Foco em desenvolvimento do peitoral",
        exercises: ["Supino Reto", "Supino Inclinado", "Crucifixo", "Tríceps Corda"]
    },
    {
        id: 2,
        name: "Treino de Costas e Bíceps",
        type: "costas",
        duration: 75,
        date: getTomorrowDate(),
        status: "active",
        description: "Desenvolvimento das costas e braços",
        exercises: ["Barra Fixa", "Remada Curvada", "Puxada Alta", "Rosca Direta"]
    },
    {
        id: 3,
        name: "Treino de Pernas Completo",
        type: "pernas",
        duration: 90,
        date: "2024-12-28",
        status: "inactive",
        description: "Treino intenso para desenvolvimento das pernas",
        exercises: ["Agachamento Livre", "Leg Press", "Cadeira Extensora", "Stiff"]
    },
    {
        id: 4,
        name: "Cardio Intervalado",
        type: "cardio",
        duration: 45,
        date: getNextWeekDate(),
        status: "active",
        description: "Treino de alta intensidade para queima de gordura",
        exercises: ["Corrida", "Bicicleta", "Pular Corda", "Burpee"]
    }
];

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Configurar data de hoje como padrão no modal
    document.getElementById('workout-date').value = getTodayDate();
    
    renderWorkouts();
    updateStats();
    setupFilters();
});

// Funções auxiliares para datas
function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

function getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
}

function getNextWeekDate() {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split('T')[0];
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

// Abrir modal para criar novo treino
newWorkoutBtn.addEventListener('click', openWorkoutModalCreate);
firstWorkoutBtn.addEventListener('click', openWorkoutModalCreate);

function openWorkoutModalCreate() {
    modalTitle.textContent = "Novo Treino";
    document.getElementById('workout-form').reset();
    document.getElementById('workout-id').value = '';
    document.getElementById('workout-date').value = getTodayDate();
    workoutModal.classList.add('active');
    document.getElementById('workout-name').focus();
}

// Abrir modal para editar treino
function openWorkoutModalEdit(workoutId) {
    const workout = workouts.find(w => w.id === workoutId);
    if (!workout) return;
    
    modalTitle.textContent = "Editar Treino";
    document.getElementById('workout-id').value = workout.id;
    document.getElementById('workout-name').value = workout.name;
    document.getElementById('workout-type').value = workout.type;
    document.getElementById('workout-duration').value = workout.duration;
    document.getElementById('workout-date').value = workout.date;
    document.getElementById('workout-status').value = workout.status;
    document.getElementById('workout-description').value = workout.description || '';
    document.getElementById('workout-exercises').value = workout.exercises.join(', ');
    
    workoutModal.classList.add('active');
    document.getElementById('workout-name').focus();
}

// Fechar modal
closeModalButtons.forEach(button => {
    button.addEventListener('click', closeWorkoutModal);
});

window.addEventListener('click', (e) => {
    if (e.target === workoutModal) {
        closeWorkoutModal();
    }
});

function closeWorkoutModal() {
    workoutModal.classList.remove('active');
}

// Configurar filtros
function setupFilters() {
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover classe active de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adicionar classe active ao botão clicado
            this.classList.add('active');
            
            // Atualizar filtro atual e renderizar treinos
            currentFilter = this.dataset.filter;
            renderWorkouts();
            updateStats();
        });
    });
}

// Salvar/Criar treino
workoutForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const workoutId = document.getElementById('workout-id').value;
    const workoutData = {
        id: workoutId ? parseInt(workoutId) : Date.now(),
        name: document.getElementById('workout-name').value,
        type: document.getElementById('workout-type').value,
        duration: parseInt(document.getElementById('workout-duration').value),
        date: document.getElementById('workout-date').value,
        status: document.getElementById('workout-status').value,
        description: document.getElementById('workout-description').value,
        exercises: document.getElementById('workout-exercises').value
            .split(',')
            .map(ex => ex.trim())
            .filter(ex => ex.length > 0)
    };
    
    if (workoutId) {
        // Editar treino existente
        const index = workouts.findIndex(w => w.id === parseInt(workoutId));
        if (index !== -1) {
            workouts[index] = workoutData;
        }
    } else {
        // Criar novo treino
        workouts.push(workoutData);
    }
    
    saveWorkouts();
    renderWorkouts();
    updateStats();
    closeWorkoutModal();
    
    // Esconder estado vazio se houver treinos
    if (workouts.length > 0) {
        emptyState.style.display = 'none';
        workoutsList.style.display = 'grid';
    }
});

// Renderizar lista de treinos com filtro
function renderWorkouts() {
    workoutsList.innerHTML = '';
    
    // Filtrar treinos baseado no filtro atual
    let filteredWorkouts = workouts;
    
    if (currentFilter === 'active') {
        filteredWorkouts = workouts.filter(w => w.status === 'active');
    } else if (currentFilter === 'inactive') {
        filteredWorkouts = workouts.filter(w => w.status === 'inactive');
    } else if (currentFilter === 'upcoming') {
        filteredWorkouts = workouts.filter(w => isFutureDate(w.date));
    }
    
    // Ordenar por data (mais recentes primeiro)
    filteredWorkouts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (filteredWorkouts.length === 0) {
        emptyState.style.display = 'block';
        workoutsList.style.display = 'none';
        return;
    }
    
    emptyState.style.display = 'none';
    workoutsList.style.display = 'grid';
    
    filteredWorkouts.forEach(workout => {
        const workoutCard = document.createElement('div');
        workoutCard.className = `workout-card ${workout.status} ${isFutureDate(workout.date) ? 'upcoming' : ''}`;
        
        // Formatar tipo para exibição
        const typeDisplay = {
            'peito': 'Peito',
            'costas': 'Costas',
            'pernas': 'Pernas',
            'ombros': 'Ombros',
            'braços': 'Braços',
            'fullbody': 'Full Body',
            'cardio': 'Cardio'
        };
        
        // Determinar classe do status
        const statusClass = workout.status === 'active' ? 'status-active' : 'status-inactive';
        const statusText = workout.status === 'active' ? 'Ativo' : 'Inativo';
        
        workoutCard.innerHTML = `
            <div class="workout-header">
                <div>
                    <div class="workout-title">${workout.name}</div>
                    <div class="workout-date">${formatDate(workout.date)}</div>
                </div>
                <div class="workout-type">${typeDisplay[workout.type]}</div>
            </div>
            
            ${workout.description ? `
                <div class="workout-description">
                    ${workout.description}
                </div>
            ` : ''}
            
            ${workout.exercises.length > 0 ? `
                <div class="workout-exercises">
                    <h4>Exercícios:</h4>
                    <ul>
                        ${workout.exercises.map(ex => `
                            <li><i class="fas fa-dumbbell"></i> ${ex}</li>
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
        `;
        
        workoutsList.appendChild(workoutCard);
    });
}

// Excluir treino
function deleteWorkout(id) {
    if (confirm('Tem certeza que deseja excluir este treino?')) {
        workouts = workouts.filter(workout => workout.id !== id);
        saveWorkouts();
        renderWorkouts();
        updateStats();
    }
}

// Atualizar estatísticas
function updateStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    totalWorkoutsEl.textContent = workouts.length;
    
    // Calcular treinos ativos
    const activeCount = workouts.filter(w => w.status === 'active').length;
    activeWorkoutsEl.textContent = activeCount;
    
    // Calcular treinos futuros
    const upcomingCount = workouts.filter(w => {
        const workoutDate = new Date(w.date);
        return workoutDate > today;
    }).length;
    
    upcomingWorkoutsEl.textContent = upcomingCount;
}

// Salvar no localStorage
function saveWorkouts() {
    localStorage.setItem('workouts', JSON.stringify(workouts));
}