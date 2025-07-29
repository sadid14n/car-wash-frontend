import React from "react";

const EditUserModal = () => {
  const newUserData = {
    name: "",
    email: "",
    phone: "",
    address: "",
    vehicals: [
      {
        vehicle_type: "",
        vehicle_name: "",
        vehicle_number: "",
      },
    ],
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">

        {/* create a form */}
        <form onSubmit={} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="name">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newUserData.name}
                  onChange={handleNewUserInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newUserData.email}
                  onChange={handleNewUserInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={newUserData.password}
                  onChange={handleNewUserInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={registering}
                className={`py-2 px-4 rounded text-white font-medium bg-red-600
                 hover:bg-red-700"
              }`}
                onClick={() => setIsRegisterModalOpen(false)}
              >
                Close
              </button>
              <button
                type="submit"
                disabled={registering}
                className={`py-2 px-4 rounded text-white font-medium ${
                  registering
                    ? "bg-green-400"
                    : "bg-green-700 hover:bg-green-800 ml-4"
                }`}
              >
                {registering ? "Registering..." : "Register User"}
              </button>
            </div>
          </form>
      </div>
    </div>
  );
};

export default EditUserModal;
