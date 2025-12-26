// Notes grid with tabs

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import NoteCard from '../components/NoteCard';

const TABS = [
    { id: 'all', label: 'All', status: null },
    { id: 'active', label: 'Active', status: 'active' },
    { id: 'archived', label: 'Archived', status: 'archived' },
];

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [newNoteContent, setNewNoteContent] = useState('');
    const [creating, setCreating] = useState(false);

    const currentTabStatus = TABS.find(tab => tab.id === activeTab)?.status;

    useEffect(() => {
        loadNotes();
    }, [activeTab]);

    const loadNotes = async () => {
        setLoading(true);
        try {
            const data = await api.getNotes(user.id, currentTabStatus);
            setNotes(data);
        } catch (error) {
            console.error('Failed to load notes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNote = async (e) => {
        e.preventDefault();
        if (!newNoteTitle.trim()) return;

        setCreating(true);
        try {
            await api.createNote(user.id, newNoteTitle, newNoteContent);
            setNewNoteTitle('');
            setNewNoteContent('');
            setShowCreateModal(false);
            loadNotes();
        } catch (error) {
            console.error('Failed to create note:', error);
            alert('Failed to create note');
        } finally {
            setCreating(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">📝 My Notes</h1>
                            <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8" aria-label="Tabs">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-gray-600">Loading notes...</p>
                    </div>
                ) : notes.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">
                            No notes yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {activeTab === 'archived'
                                ? "You haven't archived any notes yet."
                                : "Create your first note to get started!"}
                        </p>
                        {activeTab !== 'archived' && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
                            >
                                Create Note
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {notes.map((note) => (
                            <NoteCard key={note.id} note={note} />
                        ))}
                    </div>
                )}
            </main>

            {/* Floating Action Button */}
            {activeTab !== 'archived' && (
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center text-3xl"
                    aria-label="Create new note"
                >
                    +
                </button>
            )}

            {/* Create Note Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold text-gray-900">Create New Note</h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleCreateNote} className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                    Title
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    value={newNoteTitle}
                                    onChange={(e) => setNewNoteTitle(e.target.value)}
                                    required
                                    maxLength={255}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="Enter note title..."
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                                    Content
                                </label>
                                <textarea
                                    id="content"
                                    value={newNoteContent}
                                    onChange={(e) => setNewNoteContent(e.target.value)}
                                    rows={6}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                    placeholder="Enter note content..."
                                />
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating || !newNoteTitle.trim()}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition disabled:bg-blue-300 disabled:cursor-not-allowed"
                                >
                                    {creating ? 'Creating...' : 'Create Note'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}