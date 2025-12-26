// Login/Register page

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let userData;
            if (isRegister) {
                userData = await api.register(email);
            } else {
                userData = await api.login(email);
            }

            login(userData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        📝 Notes App
                    </h1>
                    <p className="text-gray-600">
                        Simple note-taking with sticky notes
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                        {isRegister ? 'Create Account' : 'Welcome Back'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                placeholder="you@example.com"
                                disabled={loading}
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Please wait...' : isRegister ? 'Sign Up' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => {
                                setIsRegister(!isRegister);
                                setError('');
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            {isRegister
                                ? 'Already have an account? Sign In'
                                : "Don't have an account? Sign Up"}
                        </button>
                    </div>
                </div>

                <p className="text-center text-gray-500 text-sm mt-6">
                    No passwords required • Email only authentication
                </p>
            </div>
        </div>
    );
}