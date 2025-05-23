// Importing required modules and components
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api";
import { useAuth } from "../hooks/useAuth";
import AuthForm from "../components/AuthForm";
import type { AuthResponse, AuthFormData } from "../models";

const LoginPage = () => {
  // Hook for programmatic navigation
  const navigate = useNavigate();
  // Auth context hook for login functionality
  const { login } = useAuth();
  // State for storing API error messages
  const [apiError, setApiError] = useState<string | null>(null);

  // Mutation hook for handling login API call
  const mutation = useMutation<AuthResponse, Error, AuthFormData>({
    mutationFn: loginUser, // Function that performs the API call
    onSuccess: (data) => {
      // On successful login: store tokens, update auth state, and redirect
      login(data.token, data.refreshToken, data.userName);
      navigate("/inventory");
    },
    onError: (error) => {
      // On error: display error message to user
      setApiError(
        error.message || "Login failed. Please check your credentials."
      );
    },
  });

  // Handler for form submission
  const handleLoginSubmit = async (formData: AuthFormData) => {
    setApiError(null); // Clear previous errors
    mutation.mutate(formData); // Trigger the mutation
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-300 p-4 sm:p-6">
      {/* Application title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-purple-800 mb-8">
        Simple Inventory App
      </h1>
      {/* Login form container */}
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-semibold text-purple-800 text-center mb-6">
          Sign In
        </h2>
        {/* Reusable auth form component */}
        <AuthForm
          formType="login"
          onSubmit={handleLoginSubmit}
          submitButtonText="Sign In"
          error={apiError}
          isLoading={mutation.isPending}
        />
        {/* Registration link */}
        <p className="mt-6 text-center text-sm">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-indigo-500 hover:text-indigo-700"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
