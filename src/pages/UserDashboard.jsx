import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../App";

import img1 from "../assets/1.jpg";
import img2 from "../assets/2.jpg";
import img3 from "../assets/3.jpg";
import img4 from "../assets/4.jpg";
import img5 from "../assets/5.jpg";
import img6 from "../assets/6.jpg";
import img7 from "../assets/7.jpg";
import { Navigate, useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const { userAuth } = useContext(UserContext);
  const [userData, setUserData] = useState(null);
  const [washHistory, setWashHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userAuth?.token) {
      fetchUserData();
    }
  }, [userAuth]);

  const fetchUserData = async () => {
    try {
      console.log(userAuth);
      setLoading(true);
      const response = await axios.get(
        import.meta.env.VITE_SERVER_DOMAIN + "/api/v1/user/profile",
        {
          headers: {
            Authorization: `Bearer ${userAuth?.token}`,
          },
        }
      );

      setUserData(response.data.user);
      setLoading(false);

      // After getting user data, fetch wash history
      fetchWashHistory(response.data.user._id);
    } catch (err) {
      setError("Failed to fetch user data");
      setLoading(false);
      console.error(err);
    }
  };

  const fetchWashHistory = async (userId) => {
    try {
      setHistoryLoading(true);
      const response = await axios.get(
        import.meta.env.VITE_SERVER_DOMAIN +
          `/api/v1/wash-history/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${userAuth?.token}`,
          },
        }
      );
      setWashHistory(response.data.washHistory);
      setHistoryLoading(false);
    } catch (err) {
      console.error("Failed to fetch wash history:", err);
      setHistoryLoading(false);
    }
  };

  const getPerkImage = (perkLevel) => {
    switch (perkLevel) {
      case 1:
        return img1;
      case 2:
        return img2;
      case 3:
        return img3;
      case 4:
        return img4;
      case 5:
        return img5;
      case 6:
        return img6;
      case 7:
        return img7;
      default:
        return img1;
    }
  };

  if (loading) return <div className="text-center p-5">Loading...</div>;
  if (error) return <div className="text-center p-5 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <h1 className="text-3xl font-bold">Welcome, {userData?.name}</h1>
          <p className="opacity-80">
            Member since {new Date(userData?.joinedAt).toLocaleDateString()}
          </p>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Your Profile
              </h2>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-800">
                      {userData?.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">
                      {userData?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Account Status</p>
                    <p className="font-medium text-gray-800">Active</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Wash & Perks
              </h2>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Washes</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {userData?.account_info?.total_wash || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Perks</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {userData?.account_info?.perks || 0}/7
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-2">Perks Progress</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width: `${
                          ((userData?.account_info?.perks || 0) / 7) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center">
                <p className="text-lg font-medium text-gray-800 mb-4">
                  Your Current Perk
                </p>
                <div className="relative">
                  <img
                    src={getPerkImage(userData?.account_info?.perks || 0)}
                    alt={`Perk level ${userData?.account_info?.perks || 0}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="mt-4 text-sm text-gray-500 text-center">
                  {userData?.account_info?.perks === 7
                    ? "You've availed your FREE WASH! Perks will reset on your next visit."
                    : userData?.account_info?.perks === 6
                    ? "Your next wash is FREE! Visit us to claim your reward."
                    : `${6 - (userData?.account_info?.perks || 0)} more wash${
                        6 - (userData?.account_info?.perks || 0) !== 1
                          ? "es"
                          : ""
                      } until your free wash!`}
                </p>
              </div>
            </div>
          </div>

          {/* Wash History Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Your Wash History
            </h2>

            {historyLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                <p className="text-gray-500">Loading wash history...</p>
              </div>
            ) : washHistory.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No wash history found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto bg-gray-50 p-4 rounded-lg">
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
                    {washHistory.map((wash) => (
                      <tr key={wash._id} className="border-b hover:bg-gray-50">
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
                        <td className="py-2 px-3 border">{wash.serviceType}</td>
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
    </div>
  );
};

export default UserDashboard;
