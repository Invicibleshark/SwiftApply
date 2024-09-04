import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Ensure jwt-decode is imported correctly
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('User is not logged in');
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken._id;

        const response = await fetch('http://localhost:8080/apply/companies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ userId }), 
        });

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.message || 'Network response was not ok');
        }

        const result = await response.json();
        setCompanies(result.companies || []);
      } catch (error) {
        toast.error('Error fetching companies: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const onDelete = async (companyName) => { 
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User is not logged in');
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken._id;

      const response = await fetch(`http://localhost:8080/apply/delete-company`, { 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ companyName, userId }), 
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to delete company');
      }

      setCompanies(companies.filter((company) => company.companyname !== companyName));
      toast.success('Company deleted successfully');
    } catch (error) {
      toast.error('Error deleting company: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto mt-4 p-4">
      <Link
        to="/home"
        className="text-gray-900 hover:text-gray-950 underline"
      >
        Back to Home
      </Link>

      <h2 className="text-2xl font-bold mb-6 text-gray-800">Applied Company Details</h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.length > 0 ? (
            companies.map((company) => (
              <div key={company._id} className="relative p-4 bg-white shadow-lg rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{company.companyname}</h3>
                <p className="text-gray-700">Status: <span className={`font-medium ${company.status === 'Success' ? 'text-green-600' : 'text-red-600'}`}>{company.status}</span></p>
                <button
                  onClick={() => onDelete(company.companyname)} 
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  aria-label="Delete"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No companies to display. You haven't applied to any companies yet.</p>
          )}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default CompanyList;
