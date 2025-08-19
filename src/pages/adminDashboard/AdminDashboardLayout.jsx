import React from "react";
import AdminMenu from "../../components/admin/AdminMenu";

const AdminDashboardLayout = ({ children }) => {
  return (
    <div className="w-full mx-auto px-0 py-4 h-screen flex">
      
        {/* menu */}
        <div className="w-64 flex-shrink-0 h-full">
          <AdminMenu />
        </div>

        {/* content */}
        <div className="flex-1 bg-gray-100 p-2 rounded-lg px-8 h-full overflow-y-auto">{children}</div>
      
    </div>
  );
};

export default AdminDashboardLayout;
