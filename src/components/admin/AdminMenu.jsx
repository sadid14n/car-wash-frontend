import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../App";


import Logo from "../../assets/logo.png";
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
    path: "/admin/dashboard",
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

    const { userAuth, setUserAuth } = useContext(UserContext);
      const navigate = useNavigate();
      const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogout = () => {
    setUserAuth(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div
        className="bg-gray-100 rounded-lg shadow-md h-fit"
      >
        <div className="p-2 flex justify-center">
          <img src={Logo} alt="" className="h-20 w-auto" />
        </div>

        {/* <p className="text-gray-400 pl-8 text-sm">MENU</p> */}
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

        
          {/* Login/Logout button */}
          <div className="w-full p-4">
            {userAuth?.isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 rounded-xl bg-white text-red-700 border border-red-700 hover:text-white transition hover:bg-red-700"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="ml-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Login
              </Link>
            )}
          </div>
        
      </div>

      
    </>
  );
};

export default AdminMenu;
