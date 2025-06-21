import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { UserContext } from "../App";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminData, setAdminData] = useState(null);

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
      console.log(response);
      setUsers(response.data.users);
      setLoading(false);
    } catch (err) {
      setError(err.response.data.message);
      setLoading(false);
      console.error(err);
    }
  };

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
    } catch (err) {
      setError("Failed to update user");
      console.error(err);
    }
  };

  if (loading) return <div className="text-center p-5">Loading...</div>;
  if (error) return <div className="text-center p-5 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="opacity-80">
            Welcome, {adminData?.name} | Managing {users.length} users
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                User Management
              </h2>
              <div className="text-sm text-gray-500">
                Total Users: <span className="font-bold">{users.length}</span>
              </div>
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
                  {users &&
                    users.map((user) => (
                      <tr key={user._id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4 border">{user.name}</td>
                        <td className="py-2 px-4 border">{user.email}</td>
                        <td className="py-2 px-4 border">
                          {user.account_info?.total_wash || 0}
                        </td>
                        <td className="py-2 px-4 border">
                          {user.account_info?.perks || 0}
                        </td>
                        <td className="py-2 px-4 border">
                          <button
                            onClick={() => updateUserInfo(user._id, "wash")}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded mr-2 cursor-pointer"
                          >
                            Update Wash
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
