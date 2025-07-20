import React, { useContext, useEffect, useState } from "react";
import AdminDashboardLayout from "./AdminDashboardLayout";
import { Command, Search } from "lucide-react";
import axios from "axios";
import { UserContext } from "../../App";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [userWashHistory, setUserWashHistory] = useState([]);

  const { userAuth } = useContext(UserContext);

  useEffect(() => {
    if (userAuth?.token) {
      fetchAdminData();
      fetchUsers();
    }
  }, [userAuth]);

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

  // user details shown
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

  return (
    <AdminDashboardLayout>
      {/* Search Bar */}
      <div className="flex justify-between items-center">
        <div className="flex relative items-center p-4 bg-white rounded-full w-[80%] h-12">
          <span className="absolute left-3  z-10">
            <Search className="w-5 h-5 " />
          </span>
          <input
            type="text"
            name=""
            className=" ml-8 py-2 placeholder:text-sm text-md absolute w-[85%] outline-none"
            placeholder="Search task"
          />
        </div>

        <p className="text-gray-400">Total User: 500</p>
      </div>

      {/* Table */}
      {/* {!isUserModalOpen && (
        <div className="overflow-x-auto pt-5">
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
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )} */}

      {/* User Details */}
      {/* {isUserModalOpen && selectedUser && (
        
      )} */}

      <div className="pt-4">
        <h2 className="text-2xl">User Details</h2>

        <div className="flex flex-wrap gap-20">
          {/* first card */}
          <div className="flex flex-col">
            <div className="flex justify-between">
              <div>
                <p>Name</p>
                <p>Sadid</p>
              </div>

              <button>Edit</button>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default UserManagement;
