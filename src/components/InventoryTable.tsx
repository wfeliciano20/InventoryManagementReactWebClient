// Importing required modules
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { InventoryItem } from "../models";
import { FcAlphabeticalSortingAz } from "react-icons/fc";
import { FcAlphabeticalSortingZa } from "react-icons/fc";
import { FcNumericalSorting12 } from "react-icons/fc";
import { FcNumericalSorting21 } from "react-icons/fc";
import { mergeSort } from "../utils";

// Props interface for the InventoryTable component
interface InventoryTableProps {
  items: InventoryItem[]; // Array of inventory items to display
  onDeleteItem: (itemId: string) => void; // Callback for delete action
  isDeleting: boolean; // Flag to disable delete button during API call
}

const InventoryTable = ({
  items,
  onDeleteItem,
  isDeleting,
}: InventoryTableProps) => {
  const navigate = useNavigate();

  // Update sorted items when the items prop changes
  useEffect(() => {
    setItemsSorted(items);
  }, [items]);

  // State for sorted items, sort order, and sort field
  const [itemsSorted, setItemsSorted] = useState<InventoryItem[]>(items);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortField, setSortField] = useState<"name" | "quantity">("name");

  // Handle sorting by field (name or quantity)
  const handleSort = (field: "name" | "quantity") => {
    // Toggle sort order if clicking the same field
    const newSortOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    setSortField(field);

    // Comparison function for sorting
    const compareFn = (a: InventoryItem, b: InventoryItem) => {
      if (field === "name") {
        return newSortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        return newSortOrder === "asc"
          ? a.quantity - b.quantity
          : b.quantity - a.quantity;
      }
    };

    // Apply merge sort with the comparison function
    setItemsSorted(mergeSort([...items], compareFn));
  };

  return (
    <div className="shadow-lg mt-[10vh] rounded-lg overflow-x-auto">
      <table className="min-w-full bg-white border-2 border-gray-200">
        {/* Table header with sortable columns */}
        <thead className="bg-purple-100 border-b-2 border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <p
                className="d-flex gap-2 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Name{" "}
                {sortOrder === "asc" && (
                  <FcAlphabeticalSortingAz className="inline text-xl" />
                )}
                {sortOrder === "desc" && (
                  <FcAlphabeticalSortingZa className="inline text-xl" />
                )}
              </p>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <p
                className="d-flex gap-2 cursor-pointer"
                onClick={() => handleSort("quantity")}
              >
                Quantity{" "}
                {sortOrder === "asc" && (
                  <FcNumericalSorting12 className="inline text-xl" />
                )}
                {sortOrder === "desc" && (
                  <FcNumericalSorting21 className="inline text-xl" />
                )}
              </p>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        {/* Table body with inventory items */}
        <tbody className="divide-y divide-gray-200">
          {/* Empty state */}
          {(!items || items.length === 0) && (
            <tr>
              <td> </td>
              <td className="text-center text-gray-500 py-8">
                No items in inventory. Add some!
              </td>
              <td> </td>
            </tr>
          )}
          {/* Render sorted items */}
          {items.length > 0 &&
            itemsSorted.map((item, index) => (
              <tr
                key={item._id}
                className={`hover:bg-purple-100 ${
                  index % 2 !== 0 ? "bg-purple-50" : ""
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b-2 border-r-2 border-gray-200">
                  {item.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-b-2 border-r-2 border-gray-200">
                  <span
                    className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-badge-bg text-badge-text`}
                  >
                    {item.quantity}
                  </span>
                </td>
                {/* Action buttons */}
                <td className="px-6 py-4 text-purple-800 whitespace-nowrap flex items-center text-sm font-medium space-x-2">
                  <button
                    onClick={() => navigate(`/edit-item/${item._id}`)}
                    className="bg-purple-700 hover:bg-purple-800 text-white py-1 px-3 rounded text-xs transition duration-150"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteItem(item._id)}
                    disabled={isDeleting}
                    className="bg-red-500  hover:bg-red-700 text-white py-1 px-3 rounded text-xs hover:transition duration-150 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
