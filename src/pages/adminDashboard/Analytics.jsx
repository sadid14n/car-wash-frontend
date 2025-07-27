import React, { useContext, useEffect, useState } from "react";
import AdminDashboardLayout from "./AdminDashboardLayout";
import { MoveUpRight, Search } from "lucide-react";
import axios from "axios";
import { UserContext } from "../../App";
import { getDayName, getMonthName } from "../../../data/calendar";

const Analytics = () => {
  const [todaysSales, setTodaysSales] = useState(0);
  const [totalWeekSales, setTotalWeekSales] = useState(0);
  const [totalMonthSales, setTotalMonthSales] = useState(0);
  const [todaysRevenue, setTodaysRevenue] = useState(0);
  const [totalWeekRevenue, setTotalWeekRevenue] = useState(0);
  const [totalMonthRevenue, setTotalMonthRevenue] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);

  const { userAuth } = useContext(UserContext);

  const currentDay = getDayName(new Date().getDay());
  const currentMonth = getMonthName(new Date().getMonth());

  // get todays sales and revenue
  const getTodaysSales = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        import.meta.env.VITE_SERVER_DOMAIN +
          "/api/v1/wash-history/todays-total-sale",
        {
          headers: {
            Authorization: `Bearer ${userAuth?.token}`,
          },
        }
      );
      if (data.success) {
        setTodaysSales(data.totalSales);
        setTodaysRevenue(data.totalAmount);
      } else {
        console.log("Failed ", data.message);
      }
    } catch (error) {
      console.log("Error in fetching today's sales", error.message);
    } finally {
      setLoading(false);
    }
  };

  // get weekly sales and revenue
  const getTotalWeekSales = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        import.meta.env.VITE_SERVER_DOMAIN +
          "/api/v1/wash-history/weekly-total-sale",
        {
          headers: {
            Authorization: `Bearer ${userAuth?.token}`,
          },
        }
      );
      if (data.success) {
        setTotalWeekSales(data.totalSales);
        setTotalWeekRevenue(data.totalAmount);
      } else {
        console.log("Failed ", data.message);
      }
    } catch (error) {
      console.log("Error in fetching today's sales", error.message);
    } finally {
      setLoading(false);
    }
  };

  // get monthly sales and revenue
  const getTotalMonthSales = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        import.meta.env.VITE_SERVER_DOMAIN +
          "/api/v1/wash-history/monthly-total-sale",
        {
          headers: {
            Authorization: `Bearer ${userAuth?.token}`,
          },
        }
      );
      if (data.success) {
        setTotalMonthSales(data.totalSales);
        setTotalMonthRevenue(data.totalAmount);
      } else {
        console.log("Failed ", data.message);
      }
    } catch (error) {
      console.log("Error in fetching today's sales", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTodaysSales();
    getTotalWeekSales();
    getTotalMonthSales();
  }, [userAuth.token]);

  // Get total user count
  // const getTotalUser = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get(
  //       import.meta.env.VITE_SERVER_DOMAIN + "/api/v1/user/total-user-count",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${userAuth?.token}`,
  //         },
  //       }
  //     );
  //     setTotalUsers(response.data.totalUser);
  //     setLoading(false);
  //   } catch (err) {
  //     console.error(err);
  //     setLoading(false);
  //   }
  // };
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

          <p className="px-4 text-3xl">{todaysSales}</p>
          <p className="px-4 pt-1">{currentDay}: Today</p>
        </div>

        {/* Total Weekly Sales */}
        <div className="w-[200px] h-[150px] max-sm:w-[90%] bg-white text-black rounded-md">
          <div className="flex justify-between px-4 pt-4 pb-2">
            <p className="text-lg">Total Week Sales</p>
            <span className="p-1 bg-white rounded-full border-1 border-black">
              <MoveUpRight color="black" />
            </span>
          </div>

          <p className="px-4 text-3xl">{totalWeekSales}</p>
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

          <p className="px-4 text-3xl">{totalMonthSales}</p>
          <p className="px-4 pt-1">Last 30 days</p>
        </div>
      </div>

      {/* Revenue */}
      <div className="flex flex-wrap gap-20 mt-20 max-sm:justify-center">
        {/* Today Revenue */}
        <div className="w-[200px] h-[150px] max-sm:w-[90%] bg-white text-black rounded-md">
          <div className="flex justify-between px-4 pt-4 pb-2">
            <p className="text-lg">Todays Revenue</p>
            <span className="p-1 bg-white rounded-full border-1 border-black">
              <MoveUpRight color="black" />
            </span>
          </div>

          <p className="px-4 text-3xl">{todaysRevenue}</p>
          <p className="px-4 pt-1">{currentDay}: Today</p>
        </div>

        {/* Week Revenue */}
        <div className="w-[200px] h-[150px] max-sm:w-[90%] bg-white text-black rounded-md">
          <div className="flex justify-between px-4 pt-4 pb-2">
            <p className="text-lg">Week Revenue</p>
            <span className="p-1 bg-white rounded-full border-1 border-black">
              <MoveUpRight color="black" />
            </span>
          </div>

          <p className="px-4 text-3xl">{totalWeekRevenue}</p>
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

          <p className="px-4 text-3xl">{totalMonthRevenue}</p>
          <p className="px-4 pt-1">Last 30 days</p>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default Analytics;
