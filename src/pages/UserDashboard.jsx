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
  const [loading, setLoading] = useState(true);
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
    } catch (err) {
      setError("Failed to fetch user data");
      setLoading(false);
      console.error(err);
    }
  };

  // Get perk image based on perks level
  const getPerkImage = (perksLevel) => {
    const images = {
      1: img1,
      2: img2,
      3: img3,
      4: img4,
      5: img5,
      6: img6,
      7: img7,
      0: "/images/perks/no-perks.png",
    };

    return images[perksLevel] || images[0];
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );

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
                <div className=" relative">
                  <img
                    src={getPerkImage(userData?.account_info?.perks || 0)}
                    alt={`Perk level ${userData?.account_info?.perks || 0}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="mt-4 text-sm text-gray-500 text-center">
                  {userData?.account_info?.perks === 7
                    ? "You've reached the maximum perks level! Enjoy your reward on your next visit."
                    : `${
                        6 - (userData?.account_info?.perks || 0)
                      } more washes until your next reward!`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
