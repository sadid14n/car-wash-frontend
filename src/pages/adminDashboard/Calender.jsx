import React, { useEffect, useState } from "react";
import AdminDashboardLayout from "./AdminDashboardLayout";

const Calender = () => {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 👇 Replace with your actual deployed backend API URL
    fetch("https://car-wash-shared.onrender.com/api/bookings")
      .then((res) => res.json())
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching bookings:", err);
        setLoading(false);
      });
  }, []);

  return (
    <AdminDashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Booking Calendar</h1>

        {loading ? (
          <p>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-700 text-sm">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-3 border border-gray-700">Full Name</th>
                  <th className="p-3 border border-gray-700">Mobile</th>
                  <th className="p-3 border border-gray-700">Vehicle Type</th>
                  <th className="p-3 border border-gray-700">Model</th>
                  <th className="p-3 border border-gray-700">Reg Number</th>
                  <th className="p-3 border border-gray-700">Service</th>
                  <th className="p-3 border border-gray-700">Date & Time</th>
                  <th className="p-3 border border-gray-700">Payment Mode</th>
                  <th className="p-3 border border-gray-700">Consent</th>
                  <th className="p-3 border border-gray-700">Comments</th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 text-gray-200">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-700">
                    <td className="p-3 border border-gray-700">{b.fullName}</td>
                    <td className="p-3 border border-gray-700">{b.mobile}</td>
                    <td className="p-3 border border-gray-700">{b.vehicleType}</td>
                    <td className="p-3 border border-gray-700">{b.modelName}</td>
                    <td className="p-3 border border-gray-700">{b.regNumber}</td>
                    <td className="p-3 border border-gray-700">{b.service}</td>
                    <td className="p-3 border border-gray-700">
                      {new Date(b.dateTime).toLocaleString()}
                    </td>
                    <td className="p-3 border border-gray-700">{b.paymentMode}</td>
                    <td className="p-3 border border-gray-700">
                      {b.consent ? "✔️" : "❌"}
                    </td>
                    <td className="p-3 border border-gray-700">{b.comments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default Calender;
