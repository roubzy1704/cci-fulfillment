// Callback.js
import React, { useEffect } from 'react';
import { useAuth } from './AuthContext';

const Callback = () => {
    const { login } = useAuth();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            login(token);
            window.location.href = '/';
        } else {
            window.location.href = '/auth-error';
        }
    }, [login]);

    return <div>Processing...</div>;
};

export default Callback;
