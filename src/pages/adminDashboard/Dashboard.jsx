import React from "react";
import AdminMenu from "../../components/admin/AdminMenu";
import AdminDashboardLayout from "./AdminDashboardLayout";
import { Search, Command, MoveUpRight } from "lucide-react";

const Dashboard = () => {
  return (
    <AdminDashboardLayout>
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
        <button className="border-2 bg-green-700 text-white py-3 px-7 rounded-full">
          Register New User
        </button>
      </div>

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

          <p className="px-4 text-3xl">200</p>
          <p className="px-4 pt-1">July: Last 30 days</p>
        </div>

        {/* Current wash */}
        <div className="w-[200px] h-[150px] max-sm:w-[90%] bg-white text-black  rounded-md">
          <div className="flex justify-between px-4 pt-4 pb-2">
            <p className="text-lg">Current Washes</p>
            <span className="p-1 bg-white rounded-full border-1 border-black">
              <MoveUpRight color="black" />
            </span>
          </div>

          <p className="px-4 text-3xl">2</p>
          <p className="px-4 pt-1">Wednesday: Today</p>
        </div>

        {/* Completed Wash */}
        <div className="w-[200px] h-[150px] max-sm:w-[90%] bg-green-700 text-white rounded-md">
          <div className="flex justify-between px-4 pt-4 pb-2">
            <p className="text-lg">Total Washes</p>
            <span className="p-1 bg-white rounded-full border-1 border-black">
              <MoveUpRight color="black" />
            </span>
          </div>

          <p className="px-4 text-3xl">200</p>
          <p className="px-4 pt-1">July: Last 30 days</p>
        </div>

        <div className="w-[200px] h-[150px] max-sm:w-[90%] bg-green-700 text-white rounded-md">
          <div className="flex justify-between px-4 pt-4 pb-2">
            <p className="text-lg">Total Washes</p>
            <span className="p-1 bg-white rounded-full border-1 border-black">
              <MoveUpRight color="black" />
            </span>
          </div>

          <p className="px-4 text-3xl">200</p>
          <p className="px-4 pt-1">July: Last 30 days</p>
        </div>

        <div className="w-[200px] h-[150px] max-sm:w-[90%] bg-green-700 text-white rounded-md">
          <div className="flex justify-between px-4 pt-4 pb-2">
            <p className="text-lg">Total Washes</p>
            <span className="p-1 bg-white rounded-full border-1 border-black">
              <MoveUpRight color="black" />
            </span>
          </div>

          <p className="px-4 text-3xl">200</p>
          <p className="px-4 pt-1">July: Last 30 days</p>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default Dashboard;
