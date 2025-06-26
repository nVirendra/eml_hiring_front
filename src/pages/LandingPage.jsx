import React,{useEffect} from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
   useEffect(() => {
    document.title = "Home | Emilo";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
        
        {/* Left Side */}
        <div className="text-gray-800 flex flex-col justify-center items-center p-10 md:p-12 bg-white text-center">
          <div className="flex flex-col gap-5 max-w-md">
            <img src="/emilof.jpg" alt="Emilo Logo" className="w-80 h-auto mx-auto" />
            <p className="text-sm tracking-widest font-medium text-blue-700 ">
              If it's there, it's here
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
              We're Launching Soon!
            </h1>
            <p className="text-md md:text-lg text-gray-600">
              Our new platform is on its way.  We're crafting an incredible platform, and we can't wait to reveal it.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-10 md:p-12 flex flex-col items-center justify-center bg-blue-500 text-white text-center">
  <h2 className="text-3xl md:text-4xl font-bold mb-4">We're Hiring</h2>

  <Link
    to="/hire/register"
    className="bg-white text-blue-700 px-10 py-3 text-lg font-semibold rounded-full shadow-md hover:scale-105 hover:bg-gray-100 transition-transform duration-300"
  >
    Apply Now
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
