


// Elementos DOM
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showLoginLink = document.getElementById('show-login');
const formTitle = document.getElementById('form-title');
const formSubtitle = document.getElementById('form-subtitle');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notification-text');

// Alternar entre login e registro
loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.classList.add('active-form');
    registerForm.classList.remove('active-form');
    formTitle.textContent = 'Login';
    formSubtitle.textContent = 'Entre na sua conta para acompanhar seus exercícios';
});

registerTab.addEventListener('click', () => {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerForm.classList.add('active-form');
    loginForm.classList.remove('active-form');
    formTitle.textContent = 'Registro';
    formSubtitle.textContent = 'Crie uma conta para começar a acompanhar seus exercícios';
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginTab.click();
});

// Alternar visibilidade da senha
function setupPasswordToggle(passwordId, toggleId) {
    const passwordInput = document.getElementById(passwordId);
    const toggleButton = document.getElementById(toggleId);
    
    toggleButton.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Alternar ícone
        const icon = toggleButton.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });
}

// Configurar toggles para senhas
setupPasswordToggle('login-password', 'toggle-login-password');
setupPasswordToggle('register-password', 'toggle-register-password');
setupPasswordToggle('confirm-password', 'toggle-confirm-password');

// Mostrar notificação
function showNotification(message, isSuccess = true) {
    notificationText.textContent = message;
    
    if (isSuccess) {
        notification.style.backgroundColor = '#2ecc71';
        notification.querySelector('i').className = 'fas fa-check-circle';
    } else {
        notification.style.backgroundColor = '#e74c3c';
        notification.querySelector('i').className = 'fas fa-exclamation-circle';
    }
    
    notification.classList.add('show');
    
    // Ocultar notificação após 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Validar força da senha
function checkPasswordStrength(password) {
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
    const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
    
    if (strongRegex.test(password)) {
        return 'forte';
    } else if (mediumRegex.test(password)) {
        return 'média';
    } else {
        return 'fraca';
    }
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Getting email and password values
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // If it is nod valid, show notification
    if (!email || !password) {
        showNotification('Preencha todos os campos', false);
        return;
    }

    try {
        // Getting response from the backend to find the user data and validate it
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        if (!response.ok) {
            showNotification('Email ou senha inválidos', false);
            return;
        }

        const data = await response.json();

        // Storing tokens in local storage
        localStorage.setItem('accessToken', data.accessToken);

        showNotification('Login realizado com sucesso!');
        loginForm.reset();

        // Exemplo de redirecionamento
        // window.location.href = '/dashboard.html';

    } catch (error) {
        console.error(error);
        showNotification('Erro ao conectar com o servidor', false);
    }
});


// Manipular envio do formulário de registro
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const terms = document.getElementById('terms').checked;
    
    // Validação
    if (!username || !email || !password || !confirmPassword) {
        showNotification('Por favor, preencha todos os campos', false);
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('As senhas não coincidem', false);
        return;
    }
    
    if (!terms) {
        showNotification('Você precisa aceitar os termos de serviço', false);
        return;
    }
    
    // Verificar força da senha
    const passwordStrength = checkPasswordStrength(password);
    if (passwordStrength === 'fraca') {
        showNotification('A senha é muito fraca. Use pelo menos 6 caracteres com letras e números', false);
        return;
    }
    
    // BACKEND REGISTER
    try {
        // Adding new user to backend
        const response = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        });

        if (!response.ok) {
            showNotification('Email ou senha inválidos', false);
            return;
        }

        const data = await response.json();
        
        console.log("Users: " + data);

        showNotification('Registrado com sucesso!');
        registerForm.reset();
    }

    catch (error) {
        console.error(error);
        showNotification('Erro ao conectar com o servidor', false);
    }
    

    // BACKEND REGISTER

    // Simulação de registro bem-sucedido
    showNotification(`Conta criada com sucesso! Sua senha é ${passwordStrength}.`);
    
    // Limpar formulário
    registerForm.reset();
    
    // Alternar para a aba de login após 2 segundos
    setTimeout(() => {
        loginTab.click();
    }, 2000);
});
