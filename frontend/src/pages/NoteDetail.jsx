import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';

export default function NoteDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showError, showSuccess, showConfirmation } = useNotification();

    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState('');
    const [editedTags, setEditedTags] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadNote();
    }, [id]);

    const loadNote = async () => {
        setLoading(true);
        try {
            const data = await api.getNote(id, user.id);
            setNote(data);
            setEditedTitle(data.title);
            setEditedContent(data.content);
            setEditedTags(data.tags || '');
        } catch (error) {
            console.error('Failed to load note:', error);
            showError('Failed to load note');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!editedTitle.trim()) {
            showError('Note title cannot be empty.');
            return;
        }

        setSaving(true);
        try {
            const updated = await api.updateNote(id, user.id, {
                title: editedTitle,
                content: editedContent,
                tags: editedTags,
            });
            setNote(updated);
            setEditing(false);
            showSuccess('Changes saved successfully!');
        } catch (error) {
            console.error('Failed to save note:', error);
            showError('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    const handleArchive = async () => {
        const newStatus = note.status === 'active' ? 'archived' : 'active';
        const action = newStatus === 'archived' ? 'archive' : 'unarchive';

        showConfirmation(
            `Are you sure you want to ${action} this note?`,
            async () => {
                try {
                    await api.updateNoteStatus(id, user.id, newStatus);
                    showSuccess(`Note ${action}d successfully!`);
                    navigate('/dashboard');
                } catch (error) {
                    console.error(`Failed to ${action} note:`, error);
                    showError(`Failed to ${action} note`);
                }
            },
            () => {
                // User cancelled, do nothing
            }
        );
    };

    const handleDelete = async () => {
        showConfirmation(
            'Are you sure you want to permanently delete this note?',
            async () => {
                try {
                    await api.deleteNote(id, user.id);
                    showSuccess('Note permanently deleted!');
                    navigate('/dashboard');
                } catch (error) {
                    console.error('Failed to delete note:', error);
                    showError('Failed to delete note');
                }
            },
            () => {
                // User cancelled, do nothing
            }
        );
    };

    const handleCancel = () => {
        setEditedTitle(note.title);
        setEditedContent(note.content);
        setEditedTags(note.tags || '');
        setEditing(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading note...</p>
                </div>
            </div>
        );
    }

    if (!note) {
        return null;
    }

    return (
        <div className="min-h-screen pb-12">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center text-gray-600 hover:text-gray-900 font-medium transition"
                        >
                            <span className="mr-2">←</span>
                            Back to Dashboard
                        </button>
                        <div className="flex space-x-2">
                            {!editing ? (
                                <>
                                    <button
                                        onClick={() => setEditing(true)}
                                        className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" />
                                        </svg>
                                        Edit
                                    </button>
                                    <button
                                        onClick={handleArchive}
                                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
                                    >
                                        {note.status === 'active' ? '🗄️ Archive' : '📤 Unarchive'}
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleCancel}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving || !editedTitle.trim()}
                                        className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:bg-blue-300 disabled:cursor-not-allowed"
                                    >
                                        {saving ? 'Saving...' : 'Save'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    {/* Status Badge */}
                    {note.status === 'archived' && (
                        <div className="mb-6">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                🗄️ Archived
                            </span>
                        </div>
                    )}

                    {/* Title */}
                    {editing ? (
                        <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            maxLength={255}
                            className="w-full text-3xl font-bold text-gray-900 border-2 border-blue-300 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:border-blue-500"
                            placeholder="Note title..."
                        />
                    ) : (
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">
                            {note.title}
                        </h1>
                    )}

                    {/* Content */}
                    {editing ? (
                        <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            rows={16}
                            className="w-full text-gray-700 border-2 border-blue-300 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:border-blue-500 resize-none"
                            placeholder="Note content..."
                        />
                    ) : (
                        <div className="text-gray-700 whitespace-pre-wrap mb-8 min-h-[200px]">
                            {note.content || <span className="text-gray-400 italic">No content</span>}
                        </div>
                    )}

                    {/* Tags */}
                    {editing ? (
                        <div className="mb-6">
                            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                                Tags (comma-separated)
                            </label>
                            <input
                                id="tags"
                                type="text"
                                value={editedTags}
                                onChange={(e) => setEditedTags(e.target.value)}
                                className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="e.g., work, personal, important"
                            />
                        </div>
                    ) : (
                        note.tags && (
                            <div className="mb-8">
                                <div className="flex flex-wrap gap-2">
                                    {note.tags.split(',').map((tag) => (
                                        <span
                                            key={tag}
                                            className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
                                        >
                                            {tag.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )
                    )}

                    {/* Metadata */}
                    <div className="pt-6 border-t border-gray-200 text-sm text-gray-600 space-y-2">
                        <div className="flex justify-between">
                            <span>Created:</span>
                            <span className="font-medium">{formatDate(note.created_at)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Last updated:</span>
                            <span className="font-medium">{formatDate(note.updated_at)}</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}