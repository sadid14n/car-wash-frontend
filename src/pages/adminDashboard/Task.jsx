import React, { useContext, useEffect, useState } from "react";
import AdminDashboardLayout from "./AdminDashboardLayout";
import { Search } from "lucide-react";
import axios from "axios";
import { UserContext } from "../../App";
import CreateWashModal from "../../components/CreateWashModal";
import ViewWashDetailsModal from "../../components/ViewWashDetailsModal";

const Task = () => {
  const [todaysCurrentWash, setTodaysCurrentWash] = useState(null);
  const [todaysCompletedWash, setTodaysCompletedWash] = useState(0);
  const [loading, setLoading] = useState(false);

  const [selectedWash, setSelectedWash] = useState(null);
  const [isWashDetailsModalOpen, setIsWashDetailsModalOpen] = useState(false);

  const { userAuth } = useContext(UserContext);

  const getTodaysCurrentWash = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        import.meta.env.VITE_SERVER_DOMAIN +
          "/api/v1/wash-history/todays-current-wash",
        {
          headers: {
            Authorization: `Bearer ${userAuth?.token}`,
          },
        }
      );

      if (data.success) {
        setTodaysCurrentWash(data.todaysCurrentWash);
      } else {
        console.error("Failed ", data.message);
      }
    } catch (error) {
      console.error("Error fetching today's current wash ", error.message);
    } finally {
      setLoading(false);
    }
  };

  const getTodaysCompletedWash = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        import.meta.env.VITE_SERVER_DOMAIN +
          "/api/v1/wash-history/todays-completed-wash",
        {
          headers: {
            Authorization: `Bearer ${userAuth?.token}`,
          },
        }
      );

      if (data.success) {
        setTodaysCompletedWash(data.todaysCompletedWash);
      } else {
        console.error("Failed ", data.message);
      }
    } catch (error) {
      console.error("Error fetching today's completed wash ", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTodaysCurrentWash();
    getTodaysCompletedWash();
  }, []);

  const viewWashDetailsModal = (wash) => {
    setSelectedWash(wash);
    setIsWashDetailsModalOpen(true);
  };

  const onClose = () => {
    setIsWashDetailsModalOpen(false);
  };

  return (
    <AdminDashboardLayout>
      {/* Search Bar */}
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
            // value={searchTerm}
            // onChange={handleSearchChange}
          />
          {/* {searchTerm && (
            <span className="absolute right-3 cursor-pointer">
              <X className="w-5 h-5" onClick={() => setSearchTerm("")} />
            </span>
          )} */}
        </div>

        <p className="text-gray-400">Total User: </p>
      </div>

      {/* Current Task */}
      <div className="bg-white mt-4 py-1 pl-4">
        <h1 className="text-xl">Current Wash</h1>
      </div>

      {/* Table */}
      <div className="overflow-x-auto pt-5">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">WhatsApp No.</th>
              <th className="py-2 px-4 border">Number</th>
              <th className="py-2 px-4 border">Service</th>
              <th className="py-2 px-4 border">Payment</th>
              <th className="py-2 px-4 border">Amount</th>
              <th className="py-2 px-4 border">Status</th>
            </tr>
          </thead>

          {/* Table body */}
          <tbody>
            {todaysCurrentWash?.length > 0 ? (
              todaysCurrentWash.map((wash) => (
                <tr key={wash._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 border">{wash.user.name}</td>
                  <td className="py-2 px-4 border">{wash.user.email}</td>
                  <td className="py-2 px-4 border">{wash.vehicleNumber}</td>
                  <td className="py-2 px-4 border">{wash.serviceType}</td>
                  <td className="py-2 px-4 border">{wash.paymentMethod}</td>
                  <td className="py-2 px-4 border">{wash.amount}</td>
                  <td className="py-2 px-4 border">
                    <button className="bg-yellow-300 text-white px-2">
                      {wash.status}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  No current wash found for today.
                </td>
              </tr>
            )}

            {/* <tr>
              <td className="py-2 px-4 border">John Doe</td>
              <td className="py-2 px-4 border">9876543210</td>
              <td className="py-2 px-4 border">1234567890</td>
              <td className="py-2 px-4 border">Basic Wash</td>
              <td className="py-2 px-4 border">Cash</td>
              <td className="py-2 px-4 border">₹200</td>
              <td className="py-2 px-4 border">Active</td>
            </tr> */}
          </tbody>
        </table>
      </div>

      {/* Completed Task */}
      <div className="bg-white mt-4 py-1 pl-4 mt-20">
        <h1 className="text-xl">Wash History</h1>
      </div>

      {/* Table */}
      <div className="overflow-x-auto pt-5">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">WhatsApp No.</th>
              <th className="py-2 px-4 border">Number</th>
              <th className="py-2 px-4 border">Service</th>
              <th className="py-2 px-4 border">Payment</th>
              <th className="py-2 px-4 border">Amount</th>
              <th className="py-2 px-4 border">Status</th>
            </tr>
          </thead>

          {/* Table body */}
          <tbody>
            {todaysCompletedWash?.length > 0 ? (
              todaysCompletedWash.map((wash) => {
                // console.log(wash);
                return (
                  <tr key={wash._id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 border">{wash.user.name}</td>
                    <td className="py-2 px-4 border">{wash.user.email}</td>
                    <td className="py-2 px-4 border">{wash.vehicleNumber}</td>
                    <td className="py-2 px-4 border">{wash.serviceType}</td>
                    <td className="py-2 px-4 border">{wash.paymentMethod}</td>
                    <td className="py-2 px-4 border">{wash.amount}</td>
                    <td className="py-2 px-4 border">
                      <div className="flex gap-2">
                        <button
                          className="bg-green-500 text-white text-[10px] text-nowrap px-1"
                          onClick={() => viewWashDetailsModal(wash)}
                        >
                          View Details
                        </button>
                        <button className="bg-green-800 text-white px-2 text-[14px]">
                          {wash.status}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  No completed wash found for today.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Wash Details Modal */}
      {isWashDetailsModalOpen && selectedWash && (
        <ViewWashDetailsModal wash={selectedWash} onClose={onClose} />
      )}
    </AdminDashboardLayout>
  );
};

export default Task;
