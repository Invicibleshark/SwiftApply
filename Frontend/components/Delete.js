import React from 'react';
import {jwtDecode} from 'jwt-decode'; // Correct import for jwt-decode
import { toast } from 'react-toastify';

const DeleteInternDetails = ({ setInternEmail, setInternPassword, setCoverLetter }) => {
  
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User is not logged in');
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken._id;

  
      const deleteResponse = await fetch(`http://localhost:8080/apply/delete-credentials`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (!deleteResponse.ok) {
        const errorMessage = await deleteResponse.text();
        throw new Error(`Failed to delete intern details: ${errorMessage}`);
      }

      const result = await deleteResponse.json();
      toast.success(result.message);

     
      setInternEmail('');
      setInternPassword('');
      setCoverLetter(''); 
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error: ' + error.message);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-gray-900 hover:bg-gray-950 text-white text-sm font-medium py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-gray-600 transition duration-150 ease-in-out"
    >
      Delete Details
    </button>
  );
};

export default DeleteInternDetails;
