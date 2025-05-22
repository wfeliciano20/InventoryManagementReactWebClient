// Import React hooks and other dependencies
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInventoryItem } from "../api";
import ItemForm from "../components/ItemForm";
import Navbar from "../components/Navbar";

const AddItemPage = () => {
  // Hook for programmatic navigation
  const navigate = useNavigate();
  // Hook for managing query cache
  const queryClient = useQueryClient();
  // State for storing API error messages
  const [apiError, setApiError] = useState<string | null>(null);

  // Mutation hook for creating inventory items
  const mutation = useMutation({
    mutationFn: createInventoryItem, // Function to call for mutation
    onSuccess: async () => {
      // Invalidate cache and navigate to inventory page on success
      await queryClient.invalidateQueries({ queryKey: ["inventoryItems"] });
      navigate("/inventory");
    },
    onError: (error) => {
      // Set error message if mutation fails
      setApiError(error.message || "Failed to add item.");
    },
  });

  // Handler for adding new item
  const handleAddItem = async (itemData: {
    name: string;
    quantity: number;
  }) => {
    setApiError(null); // Clear previous errors
    mutation.mutate(itemData); // Trigger mutation with item data
  };

  return (
    <div>
      {/* Navigation bar component */}
      <Navbar title="Add Item Page" />
      {/* Main content container */}
      <div className="flex flex-col items-center  p-4 sm:p-6 bg-purple-300 min-h-[calc(100vh-4rem)]">
        {/* Form container */}
        <div className="bg-white mt-[25vh] p-6 sm:p-8 rounded-xl shadow-xl w-full max-w-lg">
          {/* Item form component */}
          <ItemForm
            onSubmit={handleAddItem} // Form submission handler
            submitButtonText="Add Item" // Button text
            isLoading={mutation.isPending} // Loading state
            error={apiError} // Error message
          />
        </div>
      </div>
    </div>
  );
};

export default AddItemPage;
