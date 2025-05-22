// Importing necessary React and other libraries
import { Link } from "react-router-dom"; // For navigation
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // For data fetching and mutations
import { getInventoryItems, deleteInventoryItem } from "../api"; // API functions
import InventoryTable from "../components/InventoryTable"; // Table component
import Navbar from "../components/Navbar"; // Navigation bar component

// Component for the inventory list page
const InventoryListPage = () => {
  const queryClient = useQueryClient(); // Access to query client for cache management

  // Get username from local storage for personalized display
  const userName = localStorage.getItem("authUser");

  // Data fetching using React Query
  const {
    data: item,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["inventoryItem"], // Unique key for this query
    queryFn: getInventoryItems, // Function to fetch data
    refetchOnMount: true, // Refetch when component mounts
  });

  // Mutation for deleting an item
  const deleteMutation = useMutation({
    mutationFn: deleteInventoryItem, // Function to delete item
    onSuccess: () => {
      // Invalidate query to refetch data after successful deletion
      queryClient.invalidateQueries({ queryKey: ["inventoryItem"] });
    },
    onError: (error) => {
      // Error handling for deletion
      alert(`Error deleting item: ${error.message}`);
    },
  });

  // Handler for deleting an item with confirmation
  const handleDeleteItem = (itemId: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteMutation.mutate(itemId); // Trigger deletion mutation
    }
  };

  // Loading state
  if (isLoading)
    return <div className="text-center p-10">Loading inventory...</div>;

  // Error state
  if (isError)
    return (
      <div className="text-center p-10 text-red-500">
        Error fetching inventory: {error?.message}
      </div>
    );

  return (
    <div>
      {/* Navigation bar with dynamic title */}
      <Navbar
        title={!userName ? `Inventory List` : `${userName}'s Inventory List`}
      />
      {/* Main content area */}
      <div className="bg-purple-300 p-4 sm:p-6 h-[100vh]">
        {/* Inventory table component */}
        <InventoryTable
          items={item || []} // Pass data or empty array if null
          onDeleteItem={handleDeleteItem} // Delete handler
          isDeleting={deleteMutation.isPending} // Loading state for deletion
        />
        {/* Add item button */}
        <Link
          to="/add-item"
          className="fixed bottom-8 right-8 bg-white hover:bg-button-primary-hover text-purple-800 w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-lg transition duration-150"
          title="Add New Item"
        >
          +
        </Link>
      </div>
    </div>
  );
};

export default InventoryListPage;
