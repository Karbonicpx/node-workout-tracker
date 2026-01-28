export function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

export function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

export function isFutureDate(dateString) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dateString) > today;
}
