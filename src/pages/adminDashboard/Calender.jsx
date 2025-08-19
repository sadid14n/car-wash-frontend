import React, { useEffect, useState } from "react";
import AdminDashboardLayout from "./AdminDashboardLayout";

const Calender = () => {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Extracted fetch logic into a function so we can call it again on refresh
  const fetchBookings = () => {
    setLoading(true);
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
  };


  // ✅ Delete booking by ID
  const deleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      const res = await fetch(
        `https://car-wash-shared.onrender.com/api/bookings/${id}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        // Remove from UI immediately
        setBookings((prev) => prev.filter((b) => b._id !== id));
      } else {
        console.error("Failed to delete booking");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchBookings();

    // 🔄 Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchBookings();
    }, 30000); // 30000ms = 30s

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <AdminDashboardLayout>
      <div className="p-2">
      <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Booking Calendar</h1>
          <button
            onClick={fetchBookings}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            🔄 Refresh
          </button>
        </div>
        

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
                    <td className="p-3 border border-gray-700 text-center">
                      <button
                        onClick={() => deleteBooking(b._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      >
                        🗑 Delete
                      </button>
                    </td>
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
