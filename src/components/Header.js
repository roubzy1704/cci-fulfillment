// Header.js
import React from 'react';
import '../css/Header.css';

const Header = ({ isLoggedIn }) => {
    return (
        <header>
            <h1>CCI Fulfillment</h1>
            <nav>
                { isLoggedIn ? <a href="/logout">Logout</a> : null }
            </nav>
        </header>
    );
};

export default Header;
