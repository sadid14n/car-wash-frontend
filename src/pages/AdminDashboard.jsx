import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { UserContext } from "../App";
import UserDetailsModal from "../components/UserDetailsModal";
import CreateWashModal from "../components/CreateWashModal";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isCreateWashModalOpen, setIsCreateWashModalOpen] = useState(false);
  const [userWashHistory, setUserWashHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  // Add search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  // New state for user registration form
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [registering, setRegistering] = useState(false);

  const { userAuth } = useContext(UserContext);

  useEffect(() => {
    if (userAuth?.token) {
      fetchAdminData();
      fetchUsers();
    }
  }, [userAuth]);

  // Add effect for filtering users based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(lowercaseSearch) ||
          user.email.toLowerCase().includes(lowercaseSearch)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const fetchAdminData = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_SERVER_DOMAIN + "/api/v1/user/profile",
        {
          headers: {
            Authorization: `Bearer ${userAuth?.token}`,
          },
        }
      );
      setAdminData(response.data.user);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        import.meta.env.VITE_SERVER_DOMAIN + "/api/v1/user/get-all-user-data",
        {
          headers: {
            Authorization: `Bearer ${userAuth?.token}`,
          },
        }
      );
      setUsers(response.data.users);
      setFilteredUsers(response.data.users); // Initialize filtered users with all users
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
      setLoading(false);
      console.error(err);
    }
  };

  // Update wash -> no longer needed
  const updateUserInfo = async (userId, field) => {
    try {
      const user = users.find((u) => u._id === userId);
      let updatedPerks = user.account_info.perks;
      let updatedWash = user.account_info.total_wash;
      if (field === "wash") {
        updatedWash += 1;
        updatedPerks += 1;
        // Reset perks when it reaches 7
        if (updatedPerks > 7) {
          updatedPerks = 1;
        }
      }
      const response = await axios.put(
        import.meta.env.VITE_SERVER_DOMAIN +
          `/api/v1/user/update-user/${userId}`,
        {
          account_info: {
            total_wash: updatedWash,
            perks: updatedPerks,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${userAuth?.token}`,
          },
        }
      );
      // Update local state
      setUsers(
        users.map((user) =>
          user._id === userId
            ? {
                ...user,
                account_info: {
                  total_wash: updatedWash,
                  perks: updatedPerks,
                },
              }
            : user
        )
      );
      toast.success("User updated successfully");
    } catch (err) {
      toast.error("Failed to update user");
      console.error(err);
    }
  };

  const viewUserDetails = async (user) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);

    try {
      setLoadingHistory(true);
      const response = await axios.get(
        import.meta.env.VITE_SERVER_DOMAIN +
          `/api/v1/wash-history/user/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${userAuth?.token}`,
          },
        }
      );
      setUserWashHistory(response.data.washHistory);
      setLoadingHistory(false);
    } catch (err) {
      console.error("Failed to fetch wash history:", err);
      setLoadingHistory(false);
    }
  };

  const openCreateWashModal = (user) => {
    setSelectedUser(user);
    setIsCreateWashModalOpen(true);
  };

  const createWash = async (washData) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + "/api/v1/wash-history/create",
        {
          userId: selectedUser._id,
          ...washData,
          // Explicitly include isFreeWash from the form data
          isFreeWash: washData.isFreeWash,
        },
        {
          headers: {
            Authorization: `Bearer ${userAuth?.token}`,
          },
        }
      );

      // Update the user's perks and total wash count in the local state
      const updatedUsers = users.map((user) => {
        if (user._id === selectedUser._id) {
          let updatedPerks = user.account_info.perks + 1;
          if (updatedPerks > 7) {
            updatedPerks = 1;
          }
          return {
            ...user,
            account_info: {
              ...user.account_info,
              total_wash: (user.account_info.total_wash || 0) + 1,
              perks: updatedPerks,
            },
          };
        }
        return user;
      });

      setUsers(updatedUsers);
      setIsCreateWashModalOpen(false);
      toast.success("Wash record created successfully");

      // If the user details modal is open, refresh the wash history
      if (isUserModalOpen) {
        const historyResponse = await axios.get(
          import.meta.env.VITE_SERVER_DOMAIN +
            `/api/v1/wash-history/user/${selectedUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${userAuth?.token}`,
            },
          }
        );
        setUserWashHistory(historyResponse.data.washHistory);
      }
    } catch (err) {
      toast.error("Failed to create wash record");
      console.error(err);
    }
  };

  // Handle input change for new user form
  const handleNewUserInputChange = (e) => {
    setNewUserData({
      ...newUserData,
      [e.target.name]: e.target.value,
    });
  };

  // Register new user
  const registerNewUser = async (e) => {
    e.preventDefault();

    // Validate form
    if (!newUserData.name || !newUserData.email || !newUserData.password) {
      toast.error("All fields are required");
      return;
    }

    if (newUserData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setRegistering(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + "/api/v1/user/register",
        newUserData,
        {
          headers: {
            Authorization: `Bearer ${userAuth?.token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("User registered successfully");
        // Reset form
        setNewUserData({
          name: "",
          email: "",
          password: "",
        });
        // Refresh user list
        fetchUsers();
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to register user");
      console.error(err);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <div className="text-center p-5">Loading...</div>;
  if (error) return <div className="text-center p-5 text-red-500">{error}</div>;

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster position="top-right" />

      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="opacity-80">
            Welcome, {adminData?.name} | Managing {users.length} users
          </p>
        </div>

        <div className="p-6">
          {/* New User Registration Section */}
          <div className="mb-8 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Register New User
            </h2>
            <form onSubmit={registerNewUser} className="space-y-4">
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
                  <label
                    className="block text-gray-700 mb-2"
                    htmlFor="password"
                  >
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
                  className={`py-2 px-4 rounded text-white font-medium ${
                    registering
                      ? "bg-blue-400"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {registering ? "Registering..." : "Register User"}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                User Management
              </h2>
              <div className="text-sm text-gray-500">
                Total Users: <span className="font-bold">{users.length}</span>
              </div>
            </div>

            {/* Add search field */}
            <div className="relative">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <div className="pl-3 pr-2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="py-2 px-2 w-full focus:outline-none"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="px-3 text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
              {searchTerm && (
                <div className="mt-2 text-sm text-gray-500">
                  Found {filteredUsers.length}{" "}
                  {filteredUsers.length === 1 ? "user" : "users"} matching "
                  {searchTerm}"
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">Name</th>
                    <th className="py-2 px-4 border">Email</th>
                    <th className="py-2 px-4 border">Total Wash</th>
                    <th className="py-2 px-4 border">Perks</th>
                    <th className="py-2 px-4 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4 border">{user.name}</td>
                        <td className="py-2 px-4 border">{user.email}</td>
                        <td className="py-2 px-4 border">
                          {user.account_info?.total_wash || 0}
                        </td>
                        <td className="py-2 px-4 border">
                          {user.account_info?.perks || 0}
                        </td>
                        <td className="py-2 px-4 border flex space-x-2">
                          <button
                            onClick={() => viewUserDetails(user)}
                            className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded cursor-pointer"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => openCreateWashModal(user)}
                            className="bg-purple-500 hover:bg-purple-600 text-white py-1 px-3 rounded cursor-pointer"
                          >
                            Create Wash
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-4 text-center text-gray-500"
                      >
                        No users found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {isUserModalOpen && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          washHistory={userWashHistory}
          loading={loadingHistory}
          onClose={() => setIsUserModalOpen(false)}
          onCreateWash={() => {
            setIsUserModalOpen(false);
            setIsCreateWashModalOpen(true);
          }}
        />
      )}

      {/* Create Wash Modal */}
      {isCreateWashModalOpen && selectedUser && (
        <CreateWashModal
          user={selectedUser}
          onClose={() => setIsCreateWashModalOpen(false)}
          onSubmit={createWash}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
