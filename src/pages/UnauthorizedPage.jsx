import React from "react";
import { Link, useLocation } from "react-router-dom";

const UnauthorizedPage = () => {
  const location = useLocation();
  const message =
    location.state?.message || "You don't have permission to access this page.";
  const isAdminError = location.state?.isAdminError || false;

  return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6 max-w-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800">
              Unauthorized Access
            </h3>
            <div className="mt-2 text-red-700">
              <p>{message}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <Link
          to="/"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
        >
          Go Home
        </Link>
        {isAdminError && (
          <Link
            to="/user/dashboard"
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition duration-200"
          >
            Go to User Dashboard
          </Link>
        )}
      </div>
    </div>
  );
};

export default UnauthorizedPage;
