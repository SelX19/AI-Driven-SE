import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Login from '../../src/pages/Login';
import { AuthProvider } from '../../src/context/AuthContext';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import api from '../../src/services/api';

// Mock the api service
vi.mock('../../src/services/api');

const DashboardMock = () => <div>Dashboard Page</div>;

const renderLogin = () => {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<DashboardMock />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
};

describe('Login Page', () => {
  it('renders the login form by default', () => {
    renderLogin();
    expect(screen.getByRole('heading', { name: 'Welcome Back' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('switches to the registration form', () => {
    renderLogin();
    const switchButton = screen.getByRole('button', { name: "Don't have an account? Sign Up" });
    fireEvent.click(switchButton);
    expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
  });

  it('allows user to input email', () => {
    renderLogin();
    const emailInput = screen.getByLabelText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  it('handles successful login', async () => {
    const user = { id: '1', email: 'test@example.com' };
    api.login.mockResolvedValue(user);

    renderLogin();
    
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    });
  });

  it('shows an error message on failed login', async () => {
    api.login.mockRejectedValue(new Error('Invalid credentials'));

    renderLogin();

    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'wrong@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('handles successful registration', async () => {
    const user = { id: '2', email: 'new@example.com' };
    api.register.mockResolvedValue(user);

    renderLogin();

    // Switch to register form
    fireEvent.click(screen.getByRole('button', { name: "Don't have an account? Sign Up" }));
    
    // Fill and submit
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'new@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => {
      expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    });
  });

    it('shows an error message on failed registration', async () => {
    api.register.mockRejectedValue(new Error('Email already exists'));

    renderLogin();
    
    fireEvent.click(screen.getByRole('button', { name: "Don't have an account? Sign Up" }));
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'existing@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });
  });
});
