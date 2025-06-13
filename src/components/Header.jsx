
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="bg-indigo-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Hire Dashboard</h1>
        <nav className="space-x-4">
          <Link to="/" className="hover:underline text-sm">
            Home
          </Link>
          <Link to="/hire/dashboard" className="hover:underline text-sm">
            Dashboard
          </Link>
          <Link to="/hire/form-builder" className="hover:underline text-sm">
            Forms
          </Link>
          <button onClick={() => navigate('/logout')} className="hover:underline text-sm">
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
