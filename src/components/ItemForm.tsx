// Import React hooks and types
import React, { useState, useEffect } from "react";
import type { InventoryItem } from "../models";

// Define props interface for the component
interface ItemFormProps {
  onSubmit: (itemData: { name: string; quantity: number }) => Promise<void>;
  initialData?: Partial<InventoryItem> | null; // Optional initial data for edit mode
  submitButtonText: string; // Text for submit button
  isLoading: boolean; // Loading state flag
  error?: string | null; // Optional error message
}

// Main component function
const ItemForm = ({
  onSubmit,
  initialData,
  submitButtonText,
  isLoading,
  error,
}: ItemFormProps) => {
  // State for form fields
  const [name, setName] = useState(""); // Item name state
  const [quantity, setQuantity] = useState<string | number>(""); // Quantity state (string for input, number for submission)
  const [quantityError, setQuantityError] = useState(""); // quantity error state
  // Effect to initialize form with initialData when it changes
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setQuantity(
        initialData.quantity !== undefined
          ? initialData.quantity.toString()
          : ""
      );
    } else {
      setName("");
      setQuantity("");
    }
  }, [initialData]);

  // Form submission handler
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const numQuantity = parseInt(quantity as string, 10);
    if (isNaN(numQuantity) || numQuantity < 0) {
      setQuantityError("Quantity must be a non-negative number.");
      return;
    }
    onSubmit({ name, quantity: numQuantity }); // Call parent's submit handler
  };

  // Form JSX
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name input field */}
      <div>
        <label
          htmlFor="itemName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Name
        </label>
        <input
          type="text"
          id="itemName"
          placeholder="Item Name"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm  focus:ring-purple-300 focus:border-purple-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      {/* Quantity input field */}
      <div>
        <label
          htmlFor="itemQuantity"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Quantity
        </label>
        <input
          type="number"
          id="itemQuantity"
          placeholder="Item Quantity"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm  focus:ring-purple-300 focus:border-purple-500"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="0"
          required
          disabled={isLoading}
        />
        {quantityError.length > 0 && (
          <label
            htmlFor="itemQuantity"
            className="text-red-500 text-xm text-center"
          >
            {quantityError}
          </label>
        )}
      </div>

      {/* Error display */}
      {error && <p className="text-red-500 text-xs text-center">{error}</p>}

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-purple-800 hover:bg-purple-700 text-white font-bold py-2.5 px-4 rounded-md transition duration-150 disabled:opacity-50"
      >
        {isLoading ? "Processing..." : submitButtonText}
      </button>
    </form>
  );
};

export default ItemForm;
