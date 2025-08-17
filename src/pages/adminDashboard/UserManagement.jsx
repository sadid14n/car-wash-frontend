import React, { useContext, useEffect, useState } from "react";
import AdminDashboardLayout from "./AdminDashboardLayout";
import {
  ChevronLeft,
  Command,
  PencilLine,
  Plus,
  Search,
  X,
} from "lucide-react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { UserContext } from "../../App";
import CreateWashModal from "../../components/CreateWashModal";
import AddVehiclePopUp from "../../components/AddVehiclePopUp";
import EditUserPopup from "../../components/EditUserPopup";
import DeleteUserModalConfirm from "../../components/DeleteUserModalConfirm";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isCreateWashModalOpen, setIsCreateWashModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [userWashHistory, setUserWashHistory] = useState([]);

  const [isEditUserOpen, setIsEditUserOpen] = useState(false);

  const [isAddVehiclePopupOpen, setIsAddVehiclePopupOpen] = useState(false);
  const [isEditVehiclePopupOpen, setIsEditVehiclePopupOpen] = useState(false);

  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);

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

  // fetch

  // Add effect for filtering users based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(lowercaseSearch)
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

  // Handle search input change
  const handleSearchChange = (e) => {
    setIsUserModalOpen(false);
    setSearchTerm(e.target.value);
  };

  // Create Wash
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

  // Open Create Wash Model
  const openCreateWashModal = (user) => {
    setSelectedUser(user);
    setIsCreateWashModalOpen(true);
  };

  // Add vehical logics
  const openAddVehiclePopup = () => {
    setIsAddVehiclePopupOpen(true);
  };

  // edit vehicle popup
  const openEditVehiclePopup = () => {
    setIsEditVehiclePopupOpen(true);
  };

  const refetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_SERVER_DOMAIN
        }/api/v1/user/get-single-user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${userAuth?.token}`,
          },
        }
      );

      if (response.data?.user) {
        // Update users list
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u._id === userId ? response.data.user : u))
        );

        // Update selected user if same one
        if (selectedUser?._id === userId) {
          setSelectedUser(response.data.user);
        }
      }
    } catch (err) {
      console.error("Failed to refetch user details:", err);
    }
  };

  const handleVehicleSubmit = (action, userId, ...args) => {
    if (action === "add") {
      const newVehicle = args[0];
      submitVehicleToServer("add", userId, newVehicle);
    } else if (action === "edit") {
      const index = args[0];
      const updatedVehicle = args[1];
      submitVehicleToServer("edit", userId, index, updatedVehicle);
    } else if (action === "delete") {
      const index = args[0];
      submitVehicleToServer("delete", userId, index);
    }
  };

  const submitVehicleToServer = async (action, userId, ...args) => {
    try {
      if (action === "add") {
        const newVehicle = args[0];

        const { data } = await axios.post(
          `${import.meta.env.VITE_SERVER_DOMAIN}/api/v1/user/add-vehicle`,
          {
            id: userId,
            vehicle: newVehicle,
          },
          {
            headers: {
              Authorization: `Bearer ${userAuth?.token}`,
            },
          }
        );

        if (data.success) {
          toast.success("Vehicle added successfully");
          await refetchUserDetails(userId);
        } else {
          toast.error(data.message || "Failed to add vehicle");
        }
      }

      if (action === "edit") {
        const index = args[0];
        const updatedVehicle = args[1];

        const { data } = await axios.put(
          `${import.meta.env.VITE_SERVER_DOMAIN}/api/v1/user/edit-vehicle`,
          {
            userId,
            index,
            updatedVehicle,
          },
          {
            headers: {
              Authorization: `Bearer ${userAuth?.token}`,
            },
          }
        );

        if (data.success) {
          toast.success("Vehicle updated successfully");
          await refetchUserDetails(userId);
        } else {
          toast.error(data.message || "Failed to update vehicle");
        }
      }

      if (action === "delete") {
        const vehicleId = args[0];

        const { data } = await axios.delete(
          `${
            import.meta.env.VITE_SERVER_DOMAIN
          }/api/v1/user/users/${userId}/vehicles/${vehicleId}`,
          {
            headers: { Authorization: `Bearer ${userAuth?.token}` },
          }
        );

        if (data.success) {
          toast.success("Vehicle deleted successfully");
          await refetchUserDetails(userId);
        } else {
          toast.error(data.message || "Failed to delete vehicle");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while submitting vehicle info");
    }
  };

  // const editVehicle = async (action, userId, ...args) => {
  //   try {
  //     if (action === "add") {
  //       const newVehicle = args[0];

  //       // API call to add vehicle
  //       const { data } = await axios.put(`${import.meta.env.VITE_SERVER_DOMAIN}/api/v1/user/add-vehicle`, {
  //         id: userId,
  //         vehicle: newVehicle,
  //       });

  //       if (data.success) {
  //         toast.success("Vehicle added successfully");
  //         // Optionally update local state or refetch user
  //       }

  //     } else if (action === "edit") {
  //       const index = args[0];
  //       const updatedVehicle = args[1];

  //       // API call to edit vehicle
  //       const { data } = await axios.put(`${import.meta.env.VITE_SERVER_DOMAIN}/api/v1/user/edit-vehicle`, {
  //         userId,
  //         index,
  //         updatedVehicle,
  //       });

  //       if (data.success) {
  //         toast.success("Vehicle updated successfully");
  //         // Optionally update local state or refetch user
  //       }
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Something went wrong while submitting vehicle info");
  //   }
  // };

  // Add vehical
  // const addVehicle = async (id, newVehicle) => {
  //   try {
  //     const { data } = await axios.post(
  //       import.meta.env.VITE_SERVER_DOMAIN + "/api/v1/user/add-vehicle",
  //       {
  //         id,
  //         vehicle: newVehicle,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${userAuth?.token}`,
  //         },
  //       }
  //     );
  //     if (data.success) {
  //       console.log("Vehical added");
  //     } else {
  //       console.log("Failed ", data.message);
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  // Edit User Info

  const handleOpenEditUser = (user) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  const handleUpdateUser = async (userId, updatedData) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_SERVER_DOMAIN}/api/v1/user/update-profile`,
        {
          userId,
          ...updatedData,
        },
        {
          headers: {
            Authorization: `Bearer ${userAuth?.token}`,
          },
        }
      );

      if (data.success) {
        toast.success("User updated successfully");
        await refetchUserDetails(userId);
        // Refetch user list if needed
      } else {
        toast.error(data.message || "Failed to update user");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating user");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const res = await axios.delete(
        `${
          import.meta.env.VITE_SERVER_DOMAIN
        }/api/v1/user/delete-user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${userAuth?.token}`,
          },
        }
      );
      toast.success(res?.data?.message || "User deleted successfully");
      fetchUsers();
      setIsUserModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.log(error);
      const backendMessage =
        error.response?.data?.message || "Failed to delete user";

      toast.error(backendMessage);
    }
  };
  return (
    <AdminDashboardLayout>
      <Toaster />
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
            placeholder="Search users"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <span className="absolute right-3 cursor-pointer">
              <X className="w-5 h-5" onClick={() => setSearchTerm("")} />
            </span>
          )}
        </div>

        <p className="text-gray-400">Total User: </p>
      </div>
      {searchTerm && (
        <div className="mt-2 text-sm text-gray-500">
          Found {filteredUsers.length}{" "}
          {filteredUsers.length === 1 ? "user" : "users"} matching "{searchTerm}
          "
        </div>
      )}

      {/* Table */}
      {!isUserModalOpen && (
        <div className="overflow-x-auto pt-5">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Phone</th>
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
                    <td className="py-2 px-4 border">{user.phone}</td>
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
                      {/* <button
                        onClick={() => openCreateWashModal(user)}
                        className="bg-purple-500 hover:bg-purple-600 text-white py-1 px-3 rounded cursor-pointer"
                      >
                        Create Wash
                      </button> */}
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
      )}

      {/* User Details */}
      {isUserModalOpen && selectedUser && (
        <div className="pt-4">
          <div className="flex justify-between">
            <h1 className="text-2xl">User Details</h1>
            <button
              className="flex p-1 bg-green-500 rounded-md text-white text-[12px] items-center cursor-pointer"
              onClick={() => setIsUserModalOpen(false)}
            >
              <ChevronLeft className="w-5 h-5" /> Go Back
            </button>
          </div>

          {/* Card */}
          <div className="flex flex-col gap-10 mt-6">
            <div className="flex gap-10">
              {/* first card */}
              <div className="flex flex-col bg-white rounded-md w-1/2 p-4 pt-2 shadow-gray-800 shadow-2xl">
                <div className="flex gap-10">
                  <div className="flex flex-col">
                    {/* name and button */}
                    <div className="text-sm">
                      <p className="">Name</p>
                      <p className="font-semibold">{selectedUser.name}</p>
                    </div>
                    {/* Phone number */}
                    <div className="text-sm mt-4">
                      <p>Phone Number</p>
                      <p className="font-semibold">{selectedUser.phone}</p>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    {/* Member since */}
                    <div className="text-sm">
                      <p>Member Since</p>
                      <p className="font-semibold">
                        {new Date(selectedUser.joinedAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Address */}
                    <div className="text-sm mt-4">
                      <p>Address</p>
                      <p className="font-semibold">{selectedUser.address}</p>
                    </div>
                  </div>
                </div>

                <div className="flex mt-10">
                  {/* edit button */}
                  <div className="flex items-center text-white font-normal text-[11px]">
                      <button
                        className="bg-orange-400 text-sm border-2 px-3 py-1 rounded-lg"
                        onClick={() => handleOpenEditUser(selectedUser)}
                      >
                        Edit
                      </button>
                    </div>
                  <button
                    className="text-sm border-2 px-3 py-1 rounded-lg bg-red-500 text-white cursor-pointer"
                    onClick={() => {
                      setIsDeleteUserModalOpen(true);
                    }}
                  >
                    Delete User
                  </button>
                </div>
              </div>

              {/* second card */}
              <div className="flex flex-col bg-white rounded-md w-1/2 p-4 pl-6 pt-2  shadow-gray-800 shadow-2xl">
                <div className="text-sm font-semibold">
                  <p>Wash Statistics</p>
                </div>
                {/* Total Wash */}
                <div className="text-sm mt-4">
                  <p>Total Wash</p>
                  <p className="font-bold">
                    {selectedUser.account_info.total_wash}
                  </p>
                </div>

                {/* Current Perks */}
                <div className="text-sm mt-4">
                  <p>Current Perks</p>
                  <p>
                    <span className="font-bold">
                      {selectedUser.account_info.perks}
                    </span>
                    /7
                  </p>
                </div>

                {/* Wash Progress */}
                <div className="text-sm mt-4">
                  <p>Wash progress</p>
                </div>
              </div>
            </div>

            {/* third card */}
            <div className="bg-gray-300 rounded-md w-full shadow-gray-800 shadow-2xl gap-2 p-4 pl-6 pt-2">
              <h1 className="text-xl text-black font-semibold">Vehicles</h1>
              <div className="flex flex-col">
                {/* Edit button */}
                <div className="flex justify-end">
                  <div className="flex items-center text-white font-normal text-[11px]">
                    <button
                      className="bg-orange-400 text-sm px-3 py-1 rounded-lg"
                      onClick={openEditVehiclePopup}
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {/* Vehical column */}
                <div className="flex gap-5 text-sm">
                  {/* vehical 1 */}
                  {selectedUser.vehicle.map((vehical, i) => (
                    <div key={vehical._id} className="bg-gray-700 p-2 rounded-md text-white">
                      {/* vehical num */}
                      <div>
                        <p className="font-medium underline">Vehical {i + 1}</p>
                        <p className="font-bold">{vehical.vehicle_type}</p>
                      </div>

                      {/* vehical name */}
                      <div className="mt-4">
                        <p className="font-medium">Vehical Name</p>
                        <p className="font-bold">{vehical.vehicle_name}</p>
                      </div>

                      {/* Vehical number */}
                      <div className="mt-4">
                        <p className="font-medium">Number</p>
                        <p className="font-bold">{vehical.vehicle_number}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add vehical button */}
                <div className="flex justify-end">
                  <button
                    className="text-[11px] bg-green-700 text-white text-sm px-3 py-1 rounded-lg cursor-pointer"
                    onClick={openAddVehiclePopup}
                  >
                    Add Vehicle
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Wash history table */}
          <div className="bg-white mt-8 rounded-md p-2">
            {/* Title and button */}
            <div className="flex justify-between">
              <h2 className="font-semibold">Wash history</h2>
              <button
                className="flex bg-purple-500 text-white p-1 rounded-md"
                onClick={() => {
                  setIsCreateWashModalOpen(true);
                  // setIsUserModalOpen(false);
                }}
              >
                <Plus /> Create New Wash
              </button>
            </div>

            {/* Table */}
            <div className="mt-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                  <p className="text-gray-500">Loading wash history...</p>
                </div>
              ) : userWashHistory.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">
                    No wash history found for this user.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-3 border text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="py-2 px-3 border text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vehicle
                        </th>
                        <th className="py-2 px-3 border text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service
                        </th>
                        <th className="py-2 px-3 border text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment
                        </th>
                        <th className="py-2 px-3 border text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="py-2 px-3 border text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {userWashHistory.map((wash) => (
                        <tr
                          key={wash._id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="py-2 px-3 border">
                            {new Date(wash.createdAt).toLocaleDateString()}{" "}
                            {new Date(wash.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="py-2 px-3 border">
                            <div className="font-medium">
                              {wash.vehicleNumber}
                            </div>
                            <div className="text-xs text-gray-500">
                              {wash.vehicleType}
                            </div>
                          </td>
                          <td className="py-2 px-3 border">
                            {wash.serviceType}
                          </td>
                          <td className="py-2 px-3 border">
                            {wash.paymentMethod}
                          </td>
                          <td className="py-2 px-3 border">₹{wash.amount}</td>
                          <td className="py-2 px-3 border">
                            {wash.isFreeWash ? (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                Free Wash
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                Paid
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Wash Model */}
      {/* Create Wash Modal */}
      {isCreateWashModalOpen && selectedUser && (
        <CreateWashModal
          user={selectedUser}
          onClose={() => setIsCreateWashModalOpen(false)}
          onSubmit={createWash}
        />
      )}

      {/* Add Vehicle */}
      {isAddVehiclePopupOpen && selectedUser && (
        <AddVehiclePopUp
          onClose={() => setIsAddVehiclePopupOpen(false)}
          onSubmit={handleVehicleSubmit}
          user={selectedUser}
          mode="add"
        />
      )}

      {/* Edit Vehicle */}
      {isEditVehiclePopupOpen && selectedUser && (
        <AddVehiclePopUp
          onClose={() => setIsEditVehiclePopupOpen(false)}
          onSubmit={handleVehicleSubmit}
          user={selectedUser}
          mode="edit"
        />
      )}

      {/* Edit User */}
      {isEditUserOpen && selectedUser && (
        <EditUserPopup
          onClose={() => setIsEditUserOpen(false)}
          onSubmit={handleUpdateUser}
          user={selectedUser}
        />
      )}

      {/* delete user */}
      {isDeleteUserModalOpen && selectedUser && (
        <DeleteUserModalConfirm
          userId={selectedUser._id}
          onCancel={() => setIsDeleteUserModalOpen(false)}
          onConfirm={handleDeleteUser}
        />
      )}
    </AdminDashboardLayout>
  );
};

export default UserManagement;
