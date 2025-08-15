import React, { useState } from "react";

const CreateWashModal = ({ user, onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [formData, setFormData] = useState({
    vehicleNumber: "",
    vehicleType: "Car",
    serviceType: "Basic Wash",
    paymentMethod: "Cash",
    amount: 200,
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "amount" ? Number(value) : value,
    });
  };

  const handleProceedToConfirmation = (e) => {
    e.preventDefault();

    if (!formData.vehicleNumber) {
      setError("Vehicle number is required");
      return;
    }

    if (!formData.amount || formData.amount < 0) {
      setError("Valid amount is required");
      return;
    }

    setError("");
    setShowConfirmation(true);
  };

  const handleGoBack = () => {
    setShowConfirmation(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      // Check if this is a free wash (perks = 7)
      const isFreeWash = user.account_info?.perks === 7;

      console.log("User perks:", user.account_info?.perks);
      console.log("Setting isFreeWash to:", isFreeWash);

      // Add isFreeWash to the form data
      const washData = {
        ...formData,
        isFreeWash: isFreeWash,
      };

      console.log("Submitting wash data:", washData);

      await onSubmit(washData);
    } catch (err) {
      setError("Failed to create wash record");
      setShowConfirmation(false);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {showConfirmation ? "Confirm Wash Details" : "Create Wash Record"}
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          <div className="mb-4">
            <p className="text-sm text-gray-500">Creating wash record for:</p>
            <p className="font-medium text-gray-800">
              {user.name} ({user.phone})
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {!showConfirmation ? (
            <form onSubmit={handleProceedToConfirmation}>
              <div className="mb-4">
                {/* <label htmlFor="vehicleNumber">Vehicle Number</label>
                <select
                  id="vehicleNumber"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                >
                  <option value="">Select Vehicle</option>
                  {user.vehicle.map((vehicle) => (
                    <option key={vehicle._id} value={vehicle.number}>
                      {vehicle.number}
                    </option>
                  ))}
                </select> */}
                {/* <label
                  className="block text-gray-700 mb-2"
                  htmlFor="vehicleNumber"
                >
                  Vehicle Number *
                </label>
                <input
                  type="text"
                  id="vehicleNumber"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="e.g., MH01AB1234"
                /> */}
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 mb-2"
                  htmlFor="vehicleNumber"
                >
                  Vehicle Number *
                </label>
                <select
                  id="vehicleNumber"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Vehicle</option>
                  {Array.isArray(user.vehicle) && user.vehicle.length > 0 ? (
                    user.vehicle.map((vehicle) => (
                      <option key={vehicle._id} value={vehicle.vehicle_number}>
                        {vehicle.vehicle_number}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No vehicles found
                    </option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    className="block text-gray-700 mb-2"
                    htmlFor="vehicleType"
                  >
                    Vehicle Type
                  </label>
                  <select
                    id="vehicleType"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Car">Car</option>
                    <option value="SUV">SUV</option>
                    <option value="Truck">Truck</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    className="block text-gray-700 mb-2"
                    htmlFor="serviceType"
                  >
                    Service Type
                  </label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Basic Wash">Basic Wash</option>
                    <option value="Premium Wash">Premium Wash</option>
                    <option value="Deluxe Wash">Deluxe Wash</option>
                    <option value="Interior Cleaning">Interior Cleaning</option>
                    <option value="Full Service">Full Service</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    className="block text-gray-700 mb-2"
                    htmlFor="paymentMethod"
                  >
                    Payment Method
                  </label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="UPI">UPI</option>
                    <option value="Wallet">Wallet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="amount">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="1"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="notes">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Any additional information..."
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Review Details
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="bg-blue-50 p-5 rounded-lg mb-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 border-b border-blue-200 pb-2">
                  Wash Record Summary
                </h3>

                <div className="space-y-4">
                  {/* Customer Information */}
                  <div className="bg-white p-3 rounded shadow-sm">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                      Customer Information
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-gray-600">Name:</div>
                      <div className="font-medium">{user.name}</div>

                      <div className="text-gray-600">Email:</div>
                      <div className="font-medium">{user.email}</div>

                      <div className="text-gray-600">Current Perks:</div>
                      <div className="font-medium">
                        {user.account_info?.perks || 0}/7
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Information */}
                  <div className="bg-white p-3 rounded shadow-sm">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                      Vehicle Information
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-gray-600">Vehicle Number:</div>
                      <div className="font-medium">
                        {formData.vehicleNumber}
                      </div>

                      <div className="text-gray-600">Vehicle Type:</div>
                      <div className="font-medium">{formData.vehicleType}</div>
                    </div>
                  </div>

                  {/* Service Information */}
                  <div className="bg-white p-3 rounded shadow-sm">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                      Service Details
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-gray-600">Service Type:</div>
                      <div className="font-medium">{formData.serviceType}</div>

                      <div className="text-gray-600">Payment Method:</div>
                      <div className="font-medium">
                        {formData.paymentMethod}
                      </div>

                      <div className="text-gray-600">Amount:</div>
                      <div className="font-medium text-lg text-green-700">
                        ₹{formData.amount}
                      </div>
                    </div>
                  </div>

                  {/* Notes (if any) */}
                  {formData.notes && (
                    <div className="bg-white p-3 rounded shadow-sm">
                      <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                        Additional Notes
                      </h4>
                      <div className="text-gray-700 italic">
                        "{formData.notes}"
                      </div>
                    </div>
                  )}

                  {/* Perks Update Preview */}
                  <div className="bg-yellow-50 p-3 rounded shadow-sm border border-yellow-100">
                    <h4 className="text-sm font-semibold text-yellow-700 uppercase mb-2">
                      Perks Update Preview
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-gray-600">Current Perks:</div>
                      <div className="font-medium">
                        {user.account_info?.perks || 0}/7
                      </div>

                      <div className="text-gray-600">After This Wash:</div>
                      <div className="font-medium">
                        {user.account_info?.perks === 7
                          ? "7/7 (Free wash used!)"
                          : `${(user.account_info?.perks || 0) + 1}/7`}
                      </div>

                      <div className="text-gray-600">Status:</div>
                      <div className="font-medium">
                        {user.account_info?.perks === 7 ? (
                          <span className="text-green-600 font-bold">
                            This is a FREE wash!
                          </span>
                        ) : user.account_info?.perks === 6 ? (
                          <span className="text-blue-600 font-bold">
                            Next wash will be FREE!
                          </span>
                        ) : (
                          <span>Regular paid wash</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleGoBack}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  disabled={loading}
                >
                  Back to Edit
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className={`px-4 py-2 bg-green-600 text-white rounded ${
                    loading
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-green-700"
                  }`}
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Confirm & Create"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateWashModal;
