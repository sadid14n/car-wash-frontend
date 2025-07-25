import React from "react";
import AdminDashboardLayout from "./AdminDashboardLayout";
import { MoveUpRight, Search } from "lucide-react";

const Analytics = () => {
  return (
    <AdminDashboardLayout>
      {/* Search Bar */}
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

      {/* Title */}
      <div className="flex max-sm:flex-col max-sm:gap-10 items-center justify-between mt-6">
        <div>
          <h1 className="text-2xl">Analytics</h1>
        </div>
      </div>

      {/* Sales */}
      <div className="flex flex-wrap gap-20 mt-10 max-sm:justify-center">
        {/* Today Sales */}
        <div className="w-[200px] h-[150px] max-sm:w-[90%] bg-white text-black rounded-md">
          <div className="flex justify-between px-4 pt-4 pb-2">
            <p className="text-lg">Todays Sales</p>
            <span className="p-1 bg-white rounded-full border-1 border-black">
              <MoveUpRight color="black" />
            </span>
          </div>

          <p className="px-4 text-3xl">5</p>
          <p className="px-4 pt-1">Wednesday: Last 30 days</p>
        </div>

        {/* Total Weekly Sales */}
        <div className="w-[200px] h-[150px] max-sm:w-[90%] bg-white text-black rounded-md">
          <div className="flex justify-between px-4 pt-4 pb-2">
            <p className="text-lg">Total Week Sales</p>
            <span className="p-1 bg-white rounded-full border-1 border-black">
              <MoveUpRight color="black" />
            </span>
          </div>

          <p className="px-4 text-3xl">35</p>
          <p className="px-4 pt-1">Last 7 days</p>
        </div>

        {/* Total Month Sales */}
        <div className="w-[200px] h-[150px] max-sm:w-[90%] bg-white text-black rounded-md">
          <div className="flex justify-between px-4 pt-4 pb-2 items-center">
            <p className="text-lg">Total Month Sales</p>
            <span className="p-1 bg-white rounded-full border-1 border-black">
              <MoveUpRight color="black" />
            </span>
          </div>

          <p className="px-4 text-3xl">35</p>
          <p className="px-4 pt-1">Last 30 days</p>
        </div>
      </div>

      {/* Revinew */}
      <div className="flex flex-wrap gap-20 mt-20 max-sm:justify-center">
        {/* Today Revenue */}
        <div className="w-[200px] h-[150px] max-sm:w-[90%] bg-white text-black rounded-md">
          <div className="flex justify-between px-4 pt-4 pb-2">
            <p className="text-lg">Todays Revenue</p>
            <span className="p-1 bg-white rounded-full border-1 border-black">
              <MoveUpRight color="black" />
            </span>
          </div>

          <p className="px-4 text-3xl">5000</p>
          <p className="px-4 pt-1">Wednesday: Last 30 days</p>
        </div>

        {/* Week Revenue */}
        <div className="w-[200px] h-[150px] max-sm:w-[90%] bg-white text-black rounded-md">
          <div className="flex justify-between px-4 pt-4 pb-2">
            <p className="text-lg">Week Revenue</p>
            <span className="p-1 bg-white rounded-full border-1 border-black">
              <MoveUpRight color="black" />
            </span>
          </div>

          <p className="px-4 text-3xl">35</p>
          <p className="px-4 pt-1">Last 7 days</p>
        </div>

        {/* Month Revenew */}
        <div className="w-[200px] h-[150px] max-sm:w-[90%] bg-white text-black rounded-md">
          <div className="flex justify-between items-center px-4 pt-4 pb-2">
            <p className="text-lg">Month Report</p>
            <span className="p-1  bg-white rounded-full border-1 border-black">
              <MoveUpRight color="black" />
            </span>
          </div>

          <p className="px-4 text-3xl">35</p>
          <p className="px-4 pt-1">Last 30 days</p>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default Analytics;
