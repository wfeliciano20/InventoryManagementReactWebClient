// Import required React hooks and libraries
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInventoryItemById, updateInventoryItem } from "../api";
import ItemForm from "../components/ItemForm";
import type { InventoryItem } from "../models";
import Navbar from "../components/Navbar";

// Main component for editing an inventory item
const EditItemPage = () => {
  // Get item ID from URL params
  const { itemId } = useParams<{ itemId: string }>();
  // Navigation hook for redirecting
  const navigate = useNavigate();
  // Query client for managing server state
  const queryClient = useQueryClient();
  // State for API error messages
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch item data using React Query
  const {
    data: item,
    isLoading: isLoadingItem,
    error: itemError,
  } = useQuery<InventoryItem, Error>({
    queryKey: ["inventoryItem", itemId], // Unique key for caching
    queryFn: () => getInventoryItemById(itemId!), // Fetch function
    enabled: !!itemId, // Only fetch if itemId exists
  });

  // Mutation for updating item data
  const updateMutation = useMutation({
    mutationFn: (updatedItemData: { name: string; quantity: number }) =>
      updateInventoryItem(itemId!, updatedItemData), // Update function
    onSuccess: () => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["inventoryItems"] });
      queryClient.invalidateQueries({ queryKey: ["inventoryItem", itemId] });
      navigate("/inventory"); // Redirect after success
    },
    onError: (error) => {
      setApiError(error.message || "Failed to update item."); // Set error message
    },
  });

  // Handler for form submission
  const handleEditItem = async (itemData: {
    name: string;
    quantity: number;
  }) => {
    setApiError(null); // Clear previous errors
    updateMutation.mutate(itemData); // Trigger update mutation
  };

  // Loading state
  if (isLoadingItem)
    return <div className="text-center p-10">Loading item data...</div>;
  // Error state
  if (itemError)
    return (
      <div className="text-center p-10 text-red-500">
        Error loading item: {itemError.message}
      </div>
    );
  // No item found state
  if (!item)
    return (
      <div className="text-center p-10 text-gray-500">Item not found.</div>
    );

  // Main component render
  return (
    <div>
      <Navbar title="Edit Item Page" />
      <div className="flex flex-col items-center p-4 sm:p-6 bg-purple-300 min-h-[calc(100vh-4rem)]">
        <Navbar title="Edit Item Page" />
        <div className="bg-white p-6 mt-[25vh] sm:p-8 rounded-xl shadow-xl w-full max-w-lg">
          {/* Form component with props */}
          <ItemForm
            onSubmit={handleEditItem} // Form submission handler
            initialData={item} // Item data
            submitButtonText="Save Changes" // Button text
            isLoading={updateMutation.isPending} // Loading state
            error={apiError} // Error text
          />
        </div>
      </div>
    </div>
  );
};

export default EditItemPage;
