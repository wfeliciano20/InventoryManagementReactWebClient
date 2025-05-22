// Importing required modules and components
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api";
import { useAuth } from "../hooks/useAuth";
import AuthForm from "../components/AuthForm";
import type { AuthFormData, AuthResponse } from "../models";

const RegisterPage = () => {
  // Hook for programmatic navigation
  const navigate = useNavigate();
  // Auth context hook for login functionality
  const { login } = useAuth();
  // State for storing API error messages
  const [apiError, setApiError] = useState<string | null>(null);

  // Mutation hook for handling user registration
  const mutation = useMutation<AuthResponse, Error, AuthFormData>({
    mutationFn: registerUser, // API function to call
    onSuccess: (data) => {
      // On successful registration:
      login(data.token, data.refreshToken, data.userName); // Store auth tokens and data
      navigate("/inventory"); // Redirect to inventory page
    },
    onError: (error) => {
      // On error, display error message
      setApiError(error.message || "Registration failed. Please try again.");
    },
  });

  // Handler for form submission
  const handleRegisterSubmit = async (formData: AuthFormData) => {
    setApiError(null); // Clear previous errors
    mutation.mutate(formData); // Trigger registration mutation
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-300 p-4 sm:p-6">
      {/* App title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-purple-800 mb-8">
        Simple Inventory App
      </h1>

      {/* Registration form container */}
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-semibold text-purple-700 text-center mb-6">
          Create Account
        </h2>

        {/* Reusable AuthForm component */}
        <AuthForm
          formType="register" // Specifies this is a registration form
          onSubmit={handleRegisterSubmit} // Submission handler
          submitButtonText="Register" // Button text
          error={apiError} // Error message to display
          isLoading={mutation.isPending} // Loading state
        />

        {/* Link to login page for existing users */}
        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-500 hover:text-indigo-700"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
