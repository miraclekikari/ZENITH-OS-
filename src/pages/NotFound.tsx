import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-white">
      <h1 className="text-9xl font-bold">404</h1>
      <p className="text-2xl mt-4">Page Not Found</p>
      <p className="mt-2">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-8 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
