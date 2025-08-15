import { useContext, useEffect, useState } from "react";
import AdminDashboardLayout from "./AdminDashboardLayout";
import { Search, Command, MoveUpRight } from "lucide-react";
import axios from "axios";
import { UserContext } from "../../App";
import { getMonthName, getDayName } from "../../../data/calendar.js";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [monthlyTotalWash, setMonthlyTotalWash] = useState(0);
  const [todaysCurrentWash, setTodaysCurrentWash] = useState(0);
  const [todaysCompletedWash, setTodaysCompletedWash] = useState(0);
  const [totalUsers, setTotalUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registerModalOpen, setIsRegisterModalOpen] = useState(false);

  const currentDay = getDayName(new Date().getDay());
  const currentMonth = getMonthName(new Date().getMonth());

  // New state for user registration form
  const [newUserData, setNewUserData] = useState({
    name: "",
    phone: "",
    password: "",
  });

  const { userAuth } = useContext(UserContext);

  const navigate = useNavigate();

  // Get total user count
  const getTotalUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        import.meta.env.VITE_SERVER_DOMAIN + "/api/v1/user/total-user-count",
        {
          headers: {
            Authorization: `Bearer ${userAuth?.token}`,
          },
        }
      );
      setTotalUsers(response.data.totalUser);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // get monthly total wash count
  const getMonthlyTotalWash = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        import.meta.env.VITE_SERVER_DOMAIN +
          "/api/v1/wash-history/monthly-total-wash",
        {
          headers: {
            Authorization: `Bearer ${userAuth?.token}`,
          },
        }
      );
      setMonthlyTotalWash(response.data.totalWash);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // get todays current wash
  const getTodaysCurrentWash = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        import.meta.env.VITE_SERVER_DOMAIN +
          "/api/v1/wash-history/todays-current-wash",
        {
          headers: {
            Authorization: `Bearer ${userAuth?.token}`,
          },
        }
      );
      setTodaysCurrentWash(response.data.totalWash);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // todays completed wash
  const getTodaysCompletedWash = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        import.meta.env.VITE_SERVER_DOMAIN +
          "/api/v1/wash-history/todays-completed-wash",
        {
          headers: {
            Authorization: `Bearer ${userAuth?.token}`,
          },
        }
      );
      setTodaysCompletedWash(response.data.totalWash);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // ++++++++ Register New User **********

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
    if (!newUserData.name || !newUserData.password || !newUserData.phone) {
      toast.error("All fields are required");
      return;
    }

    console.log(newUserData);

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
          phone: "",
          password: "",
        });
        // Refresh user list
        navigate("/admin/user-management");
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
  // ++++++++ Register New User **********

  useEffect(() => {
    if (userAuth?.token) {
      getTotalUser();
      getMonthlyTotalWash();
      getTodaysCurrentWash();
      getTodaysCompletedWash();
    }
  }, [userAuth]);

  return (
    <AdminDashboardLayout>
      <Toaster />
      {/* Search Bar */}
      <div className="flex relative items-center p-4 bg-white rounded-full w-84 h-12">
        <span className="absolute left-3  z-10">
          <Search className="w-5 h-5 " />
        </span>
        <input
          type="text"
          name=""
          className=" ml-8 py-2 placeholder:text-sm text-sm absolute w-2/3 outline-none"
          placeholder="Search task"
        />
        <span className="absolute left-70  flex items-center bg-gray-100 rounded-md px-2">
          <Command className="w-5 h-5" size={48} /> F
        </span>
      </div>

      {/* Title */}
      <div className="flex max-sm:flex-col max-sm:gap-10 items-center justify-between mt-6">
        <div>
          <h1 className="text-4xl">Admin Dashboard</h1>
          <p>Welcome, admin | Managing 5 users</p>
        </div>

        {registerModalOpen ? (
          ""
        ) : (
          <button
            className="border-2 bg-green-700 text-white py-3 px-7 rounded-full"
            onClick={() => setIsRegisterModalOpen(true)}
          >
            Register New User
          </button>
        )}
      </div>

      {/* New User Registration Section */}
      {registerModalOpen && (
        <div className="mb-8 bg-gray-50 p-6 rounded-lg mt-4">
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
                <label className="block text-gray-700 mb-2" htmlFor="phone">
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={newUserData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // remove non-numeric
                    if (value.length <= 10) {
                      handleNewUserInputChange({
                        target: { name: "phone", value },
                      });
                    }
                  }}
                  maxLength={10}
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
      )}

      {/* card */}
      <div className="flex flex-wrap gap-20 mt-10 max-sm:justify-center">
        {/* Total wash */}
        <div className="w-[200px] h-[150px] max-sm:w-[90%] bg-green-700 text-white rounded-md">
          <div className="flex justify-between px-4 pt-4 pb-2">
            <p className="text-lg">Total Washes</p>
            <span className="p-1 bg-white rounded-full border-1 border-black">
              <MoveUpRight color="black" />
            </span>
          </div>

          <p className="px-4 text-3xl">{monthlyTotalWash}</p>
          <p className="px-4 pt-1">{currentMonth}: Last 30 days</p>
        </div>

        {/* Current wash */}
        <div className="w-[200px] h-[150px] max-sm:w-[90%] bg-white text-black  rounded-md">
          <div className="flex justify-between px-4 pt-4 pb-2">
            <p className="text-lg">Current Washes</p>
            <span className="p-1 bg-white rounded-full border-1 border-black">
              <MoveUpRight color="black" />
            </span>
          </div>

          <p className="px-4 text-3xl">{todaysCurrentWash}</p>
          <p className="px-4 pt-1">{currentDay}: Today</p>
        </div>

        {/* Completed Wash */}
        <div className="w-[200px] h-[150px] max-sm:w-[90%] bg-white text-black rounded-md">
          <div className="flex justify-between px-4 pt-4 pb-2">
            <p className="text-lg">Completed Washes</p>
            <span className="p-1 bg-white rounded-full border-1 border-black">
              <MoveUpRight color="black" />
            </span>
          </div>

          <p className="px-4 text-3xl">{todaysCompletedWash}</p>
          <p className="px-4 pt-1">{currentDay}: Today</p>
        </div>
        {/* This is for mobile booking */}
        {/* 
        <div className="w-[200px] h-[150px] max-sm:w-[90%] bg-white text-black rounded-md">
          <div className="flex justify-between px-4 pt-4 pb-2">
            <p className="text-lg">Booking</p>
            <span className="p-1 bg-white rounded-full border-1 border-black">
              <MoveUpRight color="black" />
            </span>
          </div>

          <p className="px-4 text-3xl">200</p>
          <p className="px-4 pt-1">July: Last 30 days</p>
        </div> */}

        <div className="w-[200px] h-[150px] max-sm:w-[90%] bg-white text-black rounded-md">
          <div className="flex justify-between px-4 pt-4 pb-2">
            <p className="text-lg">Total Users</p>
            <span className="p-1 bg-white rounded-full border-1 border-black">
              <MoveUpRight color="black" />
            </span>
          </div>

          <p className="px-4 text-3xl">{totalUsers}</p>
          <p className="px-4 pt-1">Till {currentMonth}</p>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default Dashboard;
