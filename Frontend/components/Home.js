import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import Apply from './Apply';
import DeleteInternDetails from './Delete';
import Navbar from './Navbar';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [internEmail, setInternEmail] = useState('');
  const [internPassword, setInternPassword] = useState('');
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    const fetchedUsername = localStorage.getItem('loggedinuser');
    setUser(fetchedUsername || '');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedinuser');
    toast.success('User Logged Out'); 
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!internEmail || !internPassword || !coverLetter) {
      toast.error('Intern email, intern password, and cover letter are required'); // Show error toast
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ Internemail: internEmail, Internpassword: internPassword, coverletter: coverLetter }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Network response was not ok');
      }

      toast.success(result.message || 'Application submitted successfully'); // Show success toast
      setInternEmail('');
      setInternPassword('');
      setCoverLetter('');
    } catch (error) {
      toast.error('Error submitting application: ' + error.message); // Show error toast
    }
  };

  return (
    <>
      <ToastContainer/>
      <div className="min-h-screen bg-gray-100">
        <Navbar user={user} handleLogout={handleLogout} />

        <div className="max-w-md mx-auto mt-5 p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold mb-6">Internshala Application</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="internEmail" className="block text-sm font-medium text-gray-700">Intern Email</label>
              <input
                type="email"
                id="internEmail"
                value={internEmail}
                placeholder="Enter intern email"
                onChange={(e) => setInternEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-gray-500 focus:ring focus:ring-gray-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label htmlFor="internPassword" className="block text-sm font-medium text-gray-700">Intern Password</label>
              <input
                type="password"
                id="internPassword"
                value={internPassword}
                placeholder="Enter intern password"
                onChange={(e) => setInternPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-gray-500 focus:ring focus:ring-gray-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">Cover Letter</label>
              <textarea
                id="coverLetter"
                value={coverLetter}
                placeholder="Write your cover letter here"
                onChange={(e) => setCoverLetter(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-gray-500 focus:ring focus:ring-gray-200 focus:ring-opacity-50"
                rows={2}
                required
              />
            </div>
            <div className="flex space-x-4 justify-center">
              <button
                type="submit"
                className="bg-slate-900 hover:bg-gray-950 text-white text-sm font-medium py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-gray-600 transition duration-150 ease-in-out"
              >
                Save
              </button>
              <DeleteInternDetails
                setInternEmail={setInternEmail}
                setInternPassword={setInternPassword}
                setCoverLetter={setCoverLetter}
              />
            </div>
          </form>
          <div className="mt-4">
            <Apply setInternEmail={setInternEmail} setInternPassword={setInternPassword} setCoverLetter={setCoverLetter} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
