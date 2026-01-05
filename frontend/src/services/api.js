// Centralized API calls

const API_BASE_URL = 'http://localhost:8000';

class ApiService {
    // Auth endpoints
    async login(email) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Login failed');
        }

        return response.json();
    }

    async register(email) {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Registration failed');
        }

        return response.json();
    }

    // Notes endpoints
    async getNotes(userId, status = null) {
        const params = new URLSearchParams({ user_id: userId });
        if (status) {
            params.append('status', status);
        }

        const response = await fetch(`${API_BASE_URL}/notes/?${params}`);

        if (!response.ok) {
            throw new Error('Failed to fetch notes');
        }

        return response.json();
    }

    async getNote(noteId, userId) {
        const params = new URLSearchParams({ user_id: userId });
        const response = await fetch(`${API_BASE_URL}/notes/${noteId}?${params}`);

        if (!response.ok) {
            throw new Error('Failed to fetch note');
        }

        return response.json();
    }

    async createNote(userId, note) {
        const params = new URLSearchParams({ user_id: userId });
        const response = await fetch(`${API_BASE_URL}/notes/?${params}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(note)
        });

        if (!response.ok) {
            throw new Error('Failed to create note');
        }

        return response.json();
    }

    async updateNote(noteId, userId, updates) {
        const params = new URLSearchParams({ user_id: userId });
        const response = await fetch(`${API_BASE_URL}/notes/${noteId}?${params}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });

        if (!response.ok) {
            throw new Error('Failed to update note');
        }

        return response.json();
    }

    async updateNoteStatus(noteId, userId, status) {
        const params = new URLSearchParams({ user_id: userId });
        const response = await fetch(`${API_BASE_URL}/notes/${noteId}/status?${params}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });

        if (!response.ok) {
            throw new Error('Failed to update note status');
        }

        return response.json();
    }

    async toggleFavoriteStatus(noteId, userId, isFavorite) {
        const params = new URLSearchParams({ user_id: userId });
        const response = await fetch(`${API_BASE_URL}/notes/${noteId}/favorite?${params}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_favorite: isFavorite })
        });

        if (!response.ok) {
            throw new Error('Failed to update favorite status');
        }

        return response.json();
    }

    async getFavoriteNotes(userId) {
        const params = new URLSearchParams({ user_id: userId });
        const response = await fetch(`${API_BASE_URL}/notes/favorites/?${params}`);

        if (!response.ok) {
            throw new Error('Failed to fetch favorite notes');
        }

        return response.json();
    }
}

export default new ApiService();