import React from 'react';
import './Loader.css';

const Loader = ({ size = 'medium', inline = false }) => {
    if (inline) {
        return <div className="btn-spinner"></div>;
    }

    return (
        <div className="loader-container">
            <div className="spinner"></div>
        </div>
    );
};

export default Loader;
