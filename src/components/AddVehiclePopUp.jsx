import React, { useEffect, useState } from "react";

const AddVehiclePopUp = ({ onClose, onSubmit, user, mode = "add" }) => {
  const [newVehicle, setNewVehicle] = useState({
    vehicle_type: "",
    vehicle_name: "",
    vehicle_number: "",
  });

  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState(null);

  useEffect(() => {
    if (mode === "add") {
      setNewVehicle({
        vehicle_type: "",
        vehicle_name: "",
        vehicle_number: "",
      });
      setSelectedVehicleIndex(null);
    }
  }, [mode]);

  const handleEditVehicleClick = (vehicle, index) => {
    setNewVehicle(vehicle);
    setSelectedVehicleIndex(index);
  };

  const handleChange = (e) => {
    setNewVehicle((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // If editing an existing vehicle
    if (mode === "edit" && selectedVehicleIndex !== null) {
      onSubmit("edit", user._id, selectedVehicleIndex, newVehicle);
    } else {
      // Adding a new vehicle
      onSubmit("add", user._id, newVehicle);
    }

    setNewVehicle({
      vehicle_type: "",
      vehicle_name: "",
      vehicle_number: "",
    });

    onClose();
  };

  const handleDelete = (vehicleId) => {
    if (mode === "edit") {
      onSubmit("delete", user._id, vehicleId);
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setNewVehicle({
      vehicle_type: "",
      vehicle_name: "",
      vehicle_number: "",
    });
    setSelectedVehicleIndex(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {mode === "edit" ? "Edit Vehicle" : "Add Vehicle"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-xl font-bold"
          >
            &times;
          </button>
        </div>

        {/* Edit Mode Vehicle Selection List */}
        {mode === "edit" &&
          user?.vehicle?.length > 0 &&
          selectedVehicleIndex === null && (
            <div className="flex flex-col gap-3 mb-4">
              {user.vehicle.map((vehicle, idx) => (
                <div
                  key={vehicle._id || idx}
                  className="bg-gray-100 p-4 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p>{vehicle.vehicle_type}</p>
                    <p>{vehicle.vehicle_name}</p>
                    <p>{vehicle.vehicle_number}</p>
                  </div>
                  <button
                    className="px-3 py-1 text-sm rounded-md bg-orange-500 text-white hover:bg-orange-600"
                    onClick={() => handleEditVehicleClick(vehicle, idx)}
                  >
                    Edit
                  </button>

                  <button
                    className="px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
                    onClick={() => handleDelete(vehicle._id)} // ✅ pass _id here
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

        {/* Vehicle Form */}
        {(mode === "add" || selectedVehicleIndex !== null) && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vehicle Type
              </label>
              <input
                type="text"
                name="vehicle_type"
                value={newVehicle.vehicle_type}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vehicle Name
              </label>
              <input
                type="text"
                name="vehicle_name"
                value={newVehicle.vehicle_name}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vehicle Number
              </label>
              <input
                type="text"
                name="vehicle_number"
                value={newVehicle.vehicle_number}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between mt-6">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  {mode === "edit" && selectedVehicleIndex !== null
                    ? "Update Vehicle"
                    : "Add Vehicle"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddVehiclePopUp;
