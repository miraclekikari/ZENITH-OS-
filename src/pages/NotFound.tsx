import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-4xl font-bold">404 - Not Found</h1>
      <p className="mt-4">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-8 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
