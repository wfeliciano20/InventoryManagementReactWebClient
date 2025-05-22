// Importing required modules and components
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import InventoryListPage from "./pages/InventoryListPage";
import AddItemPage from "./pages/AddItemPage";
import EditItemPage from "./pages/EditItemPage";
import type { JSX } from "react";
import { AuthProvider } from "./contexts/AuthContext";

// ProtectedRoute component - checks for auth token and redirects if not authenticated
const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { token } = useAuth(); // Get auth token from context
  if (!token) {
    return <Navigate to="/login" replace />; // Redirect to login if no token
  }
  return children; // Render protected content if authenticated
};

// Main app content component with routing logic
function AppContent() {
  const { token } = useAuth(); // Get auth token from context

  return (
    <div className="flex flex-col min-h-screen">
      <div className={`flex-grow ${token ? "pt-16" : ""}`}>
        {" "}
        {/* Conditional padding based on auth state */}
        <Routes>
          {/* Public routes (only accessible when not logged in) */}
          <Route
            path="/login"
            element={!token ? <LoginPage /> : <Navigate to="/inventory" />}
          />
          <Route
            path="/register"
            element={!token ? <RegisterPage /> : <Navigate to="/inventory" />}
          />

          {/* Protected routes (require authentication) */}
          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <InventoryListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-item"
            element={
              <ProtectedRoute>
                <AddItemPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-item/:itemId"
            element={
              <ProtectedRoute>
                <EditItemPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route - redirects based on auth state */}
          <Route
            path="*"
            element={<Navigate to={token ? "/inventory" : "/login"} />}
          />
        </Routes>
      </div>
    </div>
  );
}

// Root App component wrapping everything with Router and AuthProvider
function App() {
  return (
    <Router>
      {" "}
      {/* Provides routing context */}
      <AuthProvider>
        {" "}
        {/* Provides authentication context */}
        <AppContent /> {/* Main application content */}
      </AuthProvider>
    </Router>
  );
}

export default App;
