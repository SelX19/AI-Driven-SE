// Sticky note card component

import { useNavigate } from 'react-router-dom';

const NOTE_COLORS = [
    { bg: '#fef3c7', light: '#fefce8' }, // yellow
    { bg: '#fce7f3', light: '#fef1f7' }, // pink
    { bg: '#dbeafe', light: '#eff6ff' }, // blue
    { bg: '#d1fae5', light: '#ecfdf5' }, // green
    { bg: '#e9d5ff', light: '#f3e8ff' }, // purple
];

export default function NoteCard({ note }) {
    const navigate = useNavigate();

    // Deterministic color based on note ID
    const colorIndex = note.id.charCodeAt(0) % NOTE_COLORS.length;
    const colors = NOTE_COLORS[colorIndex];

    const truncateContent = (text, maxLength = 120) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div
            onClick={() => navigate(`/note/${note.id}`)}
            className="sticky-note cursor-pointer transform hover:scale-105 transition-transform duration-200 h-64 flex flex-col"
            style={{
                '--note-color': colors.bg,
                '--note-color-light': colors.light,
            }}
        >
            <div className="flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2">
                    {note.title}
                </h3>

                <p className="text-gray-700 text-sm flex-1 overflow-hidden">
                    {truncateContent(note.content)}
                </p>

                {note.tags && (
                    <div className="mt-4">
                        <div className="flex flex-wrap gap-2">
                            {note.tags.split(',').slice(0, 2).map((tag) => (
                                <span
                                    key={tag}
                                    className="bg-gray-800/10 px-2 py-1 rounded-full text-xs"
                                >
                                    {tag.trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-400/20">
                <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{formatDate(note.created_at)}</span>
                    {note.status === 'archived' && (
                        <span className="bg-gray-800/10 px-2 py-1 rounded-full text-xs">
                            Archived
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}