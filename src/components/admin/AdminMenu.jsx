import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/logo.jpg";
import {
  X,
  Menu,
  LayoutDashboard,
  ChevronRight,
  BookCheck,
  Calendar,
  ChartNoAxesColumnIncreasing,
  User,
  MessageCircleMore,
  Mail,
  Bell,
} from "lucide-react";
import UserImage from "../../assets/user.jpg";

const MenuItem = [
  {
    name: "Dashboard",
    path: "/admin/dash",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    name: "Tasks",
    path: "/admin/tasks",
    icon: <BookCheck className="w-5 h-5" />,
  },
  {
    name: "Calender",
    path: "/admin/calender",
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    name: "Analytics",
    path: "/admin/analytics",
    icon: <ChartNoAxesColumnIncreasing className="w-5 h-5" />,
  },
  {
    name: "User Management",
    path: "/admin/user-management",
    icon: <User className="w-5 h-5" />,
  },
];

const AdminMenu = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname == path;
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Admin Dashboard</h2>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      <div
        className={`${
          isMobileMenuOpen ? "block" : "hidden"
        } lg:block bg-gray-100 rounded-lg shadow-md overflow-hidden mb-6`}
      >
        <div className="hidden lg:block p-6">
          <img src={Logo} alt="" />
        </div>

        <p className="text-gray-400 pl-8 text-sm">MENU</p>
        <nav className="p-4">
          <ul className="space-y-2">
            {MenuItem.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                    isActive(item.path)
                      ? "font-semibold text-black"
                      : "text-gray-400"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span
                    className={`mr-3 ${
                      isActive(item.path) ? "text-green-800" : ""
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.name}</span>
                  <ChevronRight
                    className={`w-5 h-5 ${
                      isActive(item.path)
                        ? "font-semibold text-black"
                        : "text-gray-400"
                    }`}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Inbox */}
        <div>
          <p className="pl-8 text-sm text-gray-400">INBOX</p>

          <div className="flex items-center pl-8 gap-4 pt-3">
            <MessageCircleMore className="w-5 h-5" />
            <p className="font-semibold text-gray-400">WhatsApp</p>
          </div>
        </div>

        <div className="flex items-center pl-6 pt-14 pb-6">
          <span className="bg-white p-2 rounded-full">
            <Mail className="w-5 h-5" />
          </span>
          <span className="bg-white p-2 rounded-full">
            <Bell className="w-5 h-5" />
          </span>

          <div className="flex items-center pl-2">
            <div className="w-10 h-10 bg-white rounded-full">
              <img
                src={UserImage}
                className="w-full h-full rounded-full object-contain"
                alt=""
              />
            </div>
            <div>
              <p className="text-sm font-semibold">Totak Michel</p>
              <p className="text-sm text-gray-400">tys@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        {/* logo */}
        {/* <div className="pt-3 px-2 h-[80px]">
          <img src={Logo} alt="" className="w-full h-full object-contain" />
        </div> */}

        {/* <div className="pl-5 pt-14">
          <p className="text-[12px] text-gray-500">MENU</p>

          <div className="flex flex-col gap-2">
            {MenuItem.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex gap-3 items-center transition-all duration-150 
                  ${isActive ? "text-black font-semibold" : "text-gray-500"}`}
                >
                  <i className={item.logo} font-medium></i>
                  <p className="text-md pb-1">{item.name}</p>
                </Link>
              );
            })}
          </div>
        </div> */}
      </div>
    </>
  );
};

export default AdminMenu;
