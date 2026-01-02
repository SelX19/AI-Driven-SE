import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NoteCard from '../../src/components/NoteCard';
import { MemoryRouter } from 'react-router-dom';

// Mock the useNavigate hook
const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe('NoteCard', () => {
  const note = {
    id: '1',
    title: 'Test Note Title',
    content: 'This is a very long note content that is definitely going to be longer than the one hundred and twenty characters limit that is set in the NoteCard component.',
    created_at: '2023-01-01T12:00:00.000Z',
    status: 'active',
  };

  it('renders the note title and truncated content', () => {
    render(
      <MemoryRouter>
        <NoteCard note={note} />
      </MemoryRouter>
    );

    expect(screen.getByText('Test Note Title')).toBeInTheDocument();
    expect(screen.getByText(/^This is a very long note content.*...$/)).toBeInTheDocument();
  });

  it('renders the formatted date', () => {
    render(
      <MemoryRouter>
        <NoteCard note={note} />
      </MemoryRouter>
    );
    expect(screen.getByText('Jan 1, 2023')).toBeInTheDocument();
  });

  it('does not show "Archived" badge for active notes', () => {
    render(
      <MemoryRouter>
        <NoteCard note={note} />
      </MemoryRouter>
    );
    expect(screen.queryByText('Archived')).not.toBeInTheDocument();
  });

  it('shows "Archived" badge for archived notes', () => {
    const archivedNote = { ...note, status: 'archived' };
    render(
      <MemoryRouter>
        <NoteCard note={archivedNote} />
      </MemoryRouter>
    );
    expect(screen.getByText('Archived')).toBeInTheDocument();
  });

  it('navigates to the note detail page on click', () => {
    render(
      <MemoryRouter>
        <NoteCard note={note} />
      </MemoryRouter>
    );
    const card = screen.getByText('Test Note Title').closest('div.sticky-note');
    card.click();
    expect(mockedNavigate).toHaveBeenCalledWith('/note/1');
  });
});
