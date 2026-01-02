import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from '../../src/pages/Dashboard';
import { AuthProvider } from '../../src/context/AuthContext';
import { MemoryRouter } from 'react-router-dom';
import api from '../../src/services/api';

vi.mock('../../src/services/api');

const mockUser = { id: '1', email: 'user@example.com' };

// Mock AuthContext directly for this test
vi.mock('../../src/context/AuthContext', async () => {
    const actual = await vi.importActual('../../src/context/AuthContext');
    return {
        ...actual,
        useAuth: () => ({
            user: mockUser,
            logout: vi.fn(),
            loading: false, // Assume not loading for most tests
        }),
    };
});

const mockNotes = [
    { id: '1', title: 'Active Note 1', content: 'Content 1', created_at: '2023-01-01T10:00:00.000Z', status: 'active' },
    { id: '2', title: 'Archived Note 1', content: 'Content 2', created_at: '2023-01-02T10:00:00.000Z', status: 'archived' },
    { id: '3', title: 'Active Note 2', content: 'Content 3', created_at: '2023-01-03T10:00:00.000Z', status: 'active' },
];

const renderDashboard = () => {
    return render(
        <AuthProvider>
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        </AuthProvider>
    );
};

describe('Dashboard Page', () => {
    beforeEach(() => {
        // Reset mocks before each test
        vi.clearAllMocks();
        // Default mock for getNotes
        api.getNotes.mockImplementation(async (userId, status) => {
            if (!status) return mockNotes;
            return mockNotes.filter(note => note.status === status);
        });
    });

    it('renders the header with user email and notes', async () => {
        renderDashboard();

        expect(screen.getByText(/My Notes/)).toBeInTheDocument();
        expect(screen.getByText('user@example.com')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Active Note 1')).toBeInTheDocument();
            expect(screen.getByText('Archived Note 1')).toBeInTheDocument();
            expect(screen.getByText('Active Note 2')).toBeInTheDocument();
        });
    });

    it('shows a message when there are no notes', async () => {
        api.getNotes.mockResolvedValue([]);
        renderDashboard();

        await waitFor(() => {
            expect(screen.getByText('No notes yet')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Create Note' })).toBeInTheDocument();
        });
    });

    it('filters notes when switching tabs', async () => {
        renderDashboard();

        // Initially shows all notes
        await waitFor(() => {
            expect(screen.getByText('Active Note 1')).toBeInTheDocument();
            expect(screen.getByText('Archived Note 1')).toBeInTheDocument();
        });

        // Click 'Active' tab
        const activeTab = screen.getByRole('button', { name: 'Active' });
        fireEvent.click(activeTab);

        await waitFor(() => {
            expect(api.getNotes).toHaveBeenCalledWith(mockUser.id, 'active');
            expect(screen.getByText('Active Note 1')).toBeInTheDocument();
            expect(screen.queryByText('Archived Note 1')).not.toBeInTheDocument();
        });

        // Click 'Archived' tab
        const archivedTab = screen.getByRole('button', { name: 'Archived' });
        fireEvent.click(archivedTab);

        await waitFor(() => {
            expect(api.getNotes).toHaveBeenCalledWith(mockUser.id, 'archived');
            expect(screen.queryByText('Active Note 1')).not.toBeInTheDocument();
            expect(screen.getByText('Archived Note 1')).toBeInTheDocument();
        });
    });

    it('opens and closes the create note modal', async () => {
        renderDashboard();

        // Modal should not be visible initially
        expect(screen.queryByRole('heading', { name: 'Create New Note' })).not.toBeInTheDocument();

        // Open modal with FAB
        const createButton = screen.getByLabelText('Create new note');
        fireEvent.click(createButton);

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: 'Create New Note' })).toBeInTheDocument();
        });

        // Close modal
        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        fireEvent.click(cancelButton);

        await waitFor(() => {
            expect(screen.queryByRole('heading', { name: 'Create New Note' })).not.toBeInTheDocument();
        });
    });

    it('allows creating a new note through the modal', async () => {
        const newNote = { id: '4', title: 'New Test Note', content: 'A new note', created_at: '2023-01-04T10:00:00.000Z', status: 'active' };

        api.createNote.mockResolvedValue(newNote);

        // A bit of a trick to simulate the refetch
        let getNotesCallCount = 0;
        api.getNotes.mockImplementation(async () => {
            getNotesCallCount++;
            if (getNotesCallCount === 1) {
                return [...mockNotes]; // Initial fetch
            }
            return [...mockNotes, newNote]; // Fetch after creation
        });

        renderDashboard();

        // Wait for initial notes to render
        await screen.findByText('Active Note 1');

        // Open and fill the modal
        fireEvent.click(screen.getByLabelText('Create new note'));
        await screen.findByRole('heading', { name: 'Create New Note' });
        fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New Test Note' } });
        fireEvent.change(screen.getByLabelText('Content'), { target: { value: 'A new note' } });
        
        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: 'Create Note' }));

        // The new note should appear
        await waitFor(() => {
            expect(screen.getByText('New Test Note')).toBeInTheDocument();
        });

        expect(api.createNote).toHaveBeenCalledWith(mockUser.id, 'New Test Note', 'A new note');
    });
});
