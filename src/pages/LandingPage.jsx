import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
        
        {/* Left Side */}
        <div className="text-gray-800 flex flex-col justify-center items-center p-10 md:p-12 bg-white text-center">
          <div className="flex flex-col gap-5 max-w-md">
            <img src="/emilof.jpg" alt="Emilo Logo" className="w-80 h-auto mx-auto" />
            <p className="text-sm tracking-widest font-medium text-blue-700 uppercase">
              If it's there, it's here
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
              We're Launching Soon!
            </h1>
            <p className="text-md md:text-lg text-gray-600">
              Our new platform is on its way. We're building something great and can't wait to show you.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-10 md:p-12 flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 to-purple-700 text-white text-center">
          <Link to="/hire/register" className="bg-white text-blue-700 px-10 py-3 text-lg font-semibold rounded-full shadow-md hover:scale-105 hover:bg-gray-100 transition-transform duration-300">
            We're Hiring
          </Link>
          <p className="mt-4 max-w-xs">
            We're looking for passionate developers to join our team. Complete the application form to get started.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
