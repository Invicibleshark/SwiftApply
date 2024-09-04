import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ user, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm flex items-center justify-between p-4">
      <div className="text-xl font-semibold text-gray-800">
        Swift Apply
      </div>
      <div className="flex items-center space-x-4">
        <Link
          to="/internships"
          className="text-gray-800 text-sm font-medium hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 transition duration-150 ease-in-out"
        >
          Applied Companies
        </Link>
        <h1 className="text-gray-700 text-sm">
        <FontAwesomeIcon icon={faUser} className="text-gray-500 mr-2" />{user}</h1>
        <button
          onClick={() => {
            handleLogout();
            navigate('/login');
          }}
          className="bg-gray-900 text-white text-sm font-medium py-2 px-4 rounded-md shadow-md hover:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-gray-600 transition duration-150 ease-in-out"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
