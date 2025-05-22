// Importing required modules and components
import React, { useState } from "react";
import type { AuthFormData as formData } from "../models";

// Interface defining the props for the AuthForm component
interface AuthFormProps {
  formType: "login" | "register"; // Determines if this is a login or registration form
  onSubmit: (formData: formData) => Promise<void>; // Async callback for form submission
  submitButtonText: string; // Text to display on the submit button
  error?: string | null; // Optional error message to display
  isLoading: boolean; // Loading state to disable inputs/button
}

// AuthForm component handles both login and registration forms
const AuthForm = ({
  formType,
  onSubmit,
  submitButtonText,
  error,
  isLoading,
}: AuthFormProps) => {
  // State for form fields
  const [name, setName] = useState(""); // Only used for registration
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState(""); // Only used for registration
  const [passwordError, setPasswordError] = useState("");

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // The other possible errors will be handled by the html validation
    // Validate password match for registration
    if (formType === "register" && password !== retypePassword) {
      setPasswordError("Passwords don't match!");
      return;
    }
    // Prepare form data based on form type
    const formData =
      formType === "register" ? { name, email, password } : { email, password };
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name field - only shown for registration */}
      {formType === "register" && (
        <div>
          <label
            htmlFor="name-auth"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <input
            id="name-auth"
            name="name"
            type="text"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-300 focus:border-purple-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
        </div>
      )}

      {/* Email field - shown for both login and registration */}
      <div>
        <label
          htmlFor="email-auth"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          id="email-auth"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-300 focus:border-purple-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>

      {/* Password field - shown for both login and registration */}
      <div>
        <label
          htmlFor="password-auth"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>
        <input
          id="password-auth"
          name="password"
          type="password"
          autoComplete={
            formType === "login" ? "current-password" : "new-password"
          }
          required
          className={`w-full px-4 py-2 border ${
            passwordError.length === 0 ? "border-gray-300" : "border-red-500"
          } rounded-md shadow-sm  focus:ring-purple-300 focus:border-purple-500`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
        {passwordError && (
          <label
            htmlFor="password-auth"
            className="text-red-500 text-xs text-center"
          >
            {passwordError}
          </label>
        )}
      </div>

      {/* Password confirmation - only shown for registration */}
      {formType === "register" && (
        <div>
          <label
            htmlFor="retype-password-auth"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Re-type Password
          </label>
          <input
            id="retype-password-auth"
            name="retypePassword"
            type="password"
            autoComplete="new-password"
            required
            className={`w-full px-4 py-2 border ${
              passwordError.length === 0 ? "border-gray-300" : "border-red-500"
            } rounded-md shadow-sm  focus:ring-purple-300 focus:border-purple-500`}
            value={retypePassword}
            onChange={(e) => setRetypePassword(e.target.value)}
            disabled={isLoading}
          />
          {formType == "register" && passwordError && (
            <label
              htmlFor="retype-password-auth"
              className="text-red-500 text-xs text-center"
            >
              {passwordError}
            </label>
          )}
        </div>
      )}

      {/* Error message display */}
      {error && <p className="text-red-500 text-xs text-center">{error}</p>}

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-md transition duration-150 disabled:opacity-50"
      >
        {isLoading ? "Processing..." : submitButtonText}
      </button>
    </form>
  );
};

export default AuthForm;
