import React from "react";
import AdminMenu from "../../components/admin/AdminMenu";

const AdminDashboardLayout = ({ children }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="lg:flex lg:gap-8">
        {/* menu */}
        <div className="lg:w-64 flex-shrink-0">
          <AdminMenu />
        </div>

        {/* content */}
        <div className="flex-1 bg-gray-100 p-4 rounded-lg px-8">{children}</div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
