// Importing required icons from react-icons library
import { IoArrowBackCircle } from "react-icons/io5";
import { IoLogOutSharp } from "react-icons/io5";

// Importing routing utilities from react-router-dom
import { Link, useLocation, useNavigate } from "react-router-dom";

// Importing custom authentication hook
import { useAuth } from "../hooks/useAuth";

// Importing React hooks
import { useState, useEffect } from "react";

// Interface defining props for Navbar component
interface NavbarProps {
  title: string;
}

// Main Navbar component
const Navbar = ({ title }: NavbarProps) => {
  // Using auth hook to get logout function
  const { logout } = useAuth();

  // State for navbar title with initial value from localStorage
  const [navTitle, setNavTitle] = useState(localStorage.getItem("navTitle"));

  // Navigation hook for programmatic routing
  const navigate = useNavigate();

  // Checking if current route is inventory page
  const isInventoryRoute = useLocation().pathname === "/inventory";

  // Logout handler function
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Getting username from localStorage
  const userName = localStorage.getItem("authUser");

  // Effect to update navbar title and localStorage when title prop changes
  useEffect(() => {
    setNavTitle(title);
    localStorage.setItem("navTitle", title);
  }, [title]);

  // component render
  return (
    <nav className="bg-white p-4 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Back button (only shown when not on inventory page) */}
        <Link to="/inventory">
          {!isInventoryRoute && (
            <IoArrowBackCircle className="text-purple-800 text-4xl" />
          )}
        </Link>

        {/* Navbar title section */}
        <div className="flex items-center font-bold space-x-4 text-2xl text-purple-800">
          {!navTitle
            ? isInventoryRoute && `${userName}'s Inventory page`
            : navTitle}
        </div>

        {/* Logout button */}
        <div className="flex items-center space-x-4">
          <button onClick={handleLogout}>
            <span
              className="text-2xl cursor-pointer"
              title={userName ? userName : "Logout"}
            >
              <IoLogOutSharp className="text-purple-800 text-4xl" />
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
