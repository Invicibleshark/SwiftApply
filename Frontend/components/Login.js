import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../src/utils';

const Login = () => {
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) {
            return handleError('Email and password are required');
        }
        try {
            const url = 'http://localhost:8080/auth/login';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });
            const result = await response.json();
            const { success, message, jwtToken, name, error } = result;
            if (success) {
                handleSuccess(message || 'Login Successful');
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedinuser', name);
                navigate('/home'); 
            } else {
                const details = error?.details[0]?.message || 'An error occurred';
                handleError(details);
            }
        } catch (err) {
            handleError(err.message || 'Network error');
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="text-xl font-semibold text-gray-800">
                        Swift Apply
                    </div>
                    <div>
                        <Link to="/signup" className="text-gray-900 hover:text-gray-950 font-medium text-sm">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </nav>
            <div className="flex-grow flex items-center justify-center">
                <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
                    <h1 className="text-2xl font-semibold text-center text-gray-950 mb-6">Login</h1>
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">Email</label>
                            <input
                                onChange={handleChange}
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={loginInfo.email}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-950"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">Password</label>
                            <input
                                onChange={handleChange}
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={loginInfo.password}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-950"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-gray-900 text-white font-semibold rounded-md shadow-md hover:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-gray-900 transition duration-150 ease-in-out"
                        >
                            Login
                        </button>
                        <div className="mt-4 text-center">
                            <span className="text-gray-600">Don't have an account? </span>
                            <Link to="/signup" className="text-gray-900 hover:text-gray-950 font-medium">Sign Up</Link>
                        </div>
                    </form>
                    <ToastContainer />
                </div>
            </div>
        </div>
    );
};

export default Login;
