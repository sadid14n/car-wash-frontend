import React, { useState, useContext } from "react";
import { UserContext } from "../App";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";

const Register = () => {
  const { userAuth } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state or default to user dashboard
  const from = location.state?.from || "/user/dashboard";
  const message = location.state?.message || "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(message);
  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear password error when user types in password fields
    if (e.target.name === "password" || e.target.name === "confirmPassword") {
      setPasswordError("");
    }
  };

  const validateForm = () => {
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }

    // Check password length
    if (formData.password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Register the user
      const registerResponse = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + "/api/v1/user/register",
        {
          headers: {
            Authorization: `Bearer ${userAuth?.token}`,
          },
        },
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );

      if (registerResponse.data.success) {
        navigate("/admin/dashboard");
      } else {
        setError(registerResponse.data.message || "Registration failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Create an Account
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                passwordError ? "border-red-500" : "border-gray-300"
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 mb-2"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                passwordError ? "border-red-500" : "border-gray-300"
              } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
            {passwordError && (
              <p className="mt-1 text-sm text-red-600">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded text-white font-medium ${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
