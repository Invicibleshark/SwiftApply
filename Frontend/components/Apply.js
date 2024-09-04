import React from 'react';
import {jwtDecode} from 'jwt-decode';
import { toast } from 'react-toastify';

const Apply = ({ setInternEmail, setInternPassword ,setCoverLetter }) => {
  const handleApply = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User is not logged in');
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken._id;

      const credentialsResponse = await fetch(`http://localhost:8080/apply/fetch-credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (!credentialsResponse.ok) {
        const errorMessage = await credentialsResponse.text();
        throw new Error(`Failed to fetch credentials: ${errorMessage}`);
      }

      const { Internemail, Internpassword ,coverletter } = await credentialsResponse.json();
      // setInternEmail(Internemail);
      // setInternPassword(Internpassword);
      // setCoverLetter(coverletter);
      const puppeteerResponse = await fetch(`http://localhost:8080/apply/run-puppeteer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email: Internemail, password: Internpassword , coverletter:coverletter, userId: userId }),
      });

      if (!puppeteerResponse.ok) {
        const result = await puppeteerResponse.json();
        const errorMessage = result.message || 'An error occurred';
        const companyName = result.company || 'unknown company';
        throw new Error(`Failed to apply for ${companyName}: ${errorMessage}`);
      }

      const result = await puppeteerResponse.json();
      toast.success(`Successfully applied to ${result.company}!`);
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Failed to apply: ${error.message}`);
    }
  };

  return (
    <button
  onClick={handleApply}
  className="w-full bg-gray-900 hover:bg-gray-950 text-white text-sm font-medium py-2 px-4 rounded-md shadow-md  focus:outline-none focus:ring-2 transition duration-150 ease-in-out"
>
  Apply
</button>

  );
};

export default Apply;
