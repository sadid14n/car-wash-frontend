import axios from "axios";
import React, { useContext, useState } from "react";
import { UserContext } from "../App";

const ViewWashDetailsModal = ({ wash, onClose }) => {
  const [loading, setLoading] = useState(false);

  const { userAuth } = useContext(UserContext);

  const handleGoBack = () => {
    onClose();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        import.meta.env.VITE_SERVER_DOMAIN + "/api/v1/wash-history/update-wash",
        {
          id: wash._id,
          status: "Done",
        },
        {
          headers: {
            Authorization: `Bearer ${userAuth?.token}`,
          },
        }
      );
      console.log(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">Wash Details</h2>

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
              {wash.user.name} ({wash.user.email})
            </p>
          </div>

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
                    <div className="font-medium">{wash.user.name}</div>

                    <div className="text-gray-600">Email:</div>
                    <div className="font-medium">{wash.user.email}</div>

                    <div className="text-gray-600">Current Perks:</div>
                    {/* <div className="font-medium">
                        {user.account_info?.perks || 0}/7
                      </div> */}
                  </div>
                </div>

                {/* Vehicle Information */}
                <div className="bg-white p-3 rounded shadow-sm">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                    Vehicle Information
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-600">Vehicle Number:</div>
                    <div className="font-medium">{wash.vehicleNumber}</div>

                    <div className="text-gray-600">Vehicle Type:</div>
                    <div className="font-medium">{wash.vehicleType}</div>
                  </div>
                </div>

                {/* Service Information */}
                <div className="bg-white p-3 rounded shadow-sm">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                    Service Details
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-600">Service Type:</div>
                    <div className="font-medium">{wash.serviceType}</div>

                    <div className="text-gray-600">Payment Method:</div>
                    <div className="font-medium">{wash.paymentMethod}</div>

                    <div className="text-gray-600">Amount:</div>
                    <div className="font-medium text-lg text-green-700">
                      ₹{wash.amount}
                    </div>
                  </div>
                </div>

                {/* Notes (if any) */}
                {/* {formData.notes && (
                    <div className="bg-white p-3 rounded shadow-sm">
                      <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                        Additional Notes
                      </h4>
                      <div className="text-gray-700 italic">
                        "{formData.notes}"
                      </div>
                    </div>
                  )} */}

                {/* Perks Update Preview */}
                {/* <div className="bg-yellow-50 p-3 rounded shadow-sm border border-yellow-100">
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
                  </div> */}
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
                // onClick={}
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
        </div>
      </div>
    </div>
  );
};

export default ViewWashDetailsModal;
