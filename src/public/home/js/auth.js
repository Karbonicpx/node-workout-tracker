export const token = localStorage.getItem('accessToken');

export function checkAuth() {
    if (!token) {
        window.location.href = '../login/index.html';
        return false;
    }

    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
        const now = Math.floor(Date.now() / 1000);

        if (decoded.exp && decoded.exp < now) {
            logout();
            return false;
        }

        return true;
    } catch {
        logout();
        return false;
    }
}

export function getUsernameFromToken() {
    try {
        if (!token) return null;
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.username || payload.email?.split('@')[0] || 'Usuário';
    } catch {
        return null;
    }
}

export function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    window.location.href = '../login/index.html';
}
