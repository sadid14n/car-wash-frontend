import React from "react";

const DeleteUserModalConfirm = ({ userId, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-lg font-semibold mb-4">Delete User</h2>
        <p className="mb-6">Are you sure you want to delete the user?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => onConfirm(userId)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Done
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModalConfirm;
