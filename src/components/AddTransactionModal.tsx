import { useState } from "react";
import { toast } from "react-toastify";
import { db, auth } from "./firebase";
import mapFirebaseError from "../utils/mapFirebaseError";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionAdded: () => void;
}

export default function AddTransactionModal({
  isOpen,
  onClose,
  onTransactionAdded,
}: AddTransactionModalProps) {
  // State variables for form fields
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Groceries");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    "expense"
  );
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission to add transaction to Firebase
  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!amount || !category || !date) {
      toast.error("Please fill in all required fields", {
        position: "top-center",
      });
      return;
    }

    // Get current authenticated user
    const user = auth.currentUser;
    if (!user) {
      toast.error("Please log in to add transactions", {
        position: "top-center",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Add transaction to Firestore database under transactions collection
      // Each transaction is linked to the current user's UID
      await addDoc(collection(db, "transactions"), {
        userId: user.uid, // Store user ID to filter transactions by user
        amount: parseFloat(amount), // Convert to number
        category: category,
        date: date,
        description: description,
        type: transactionType, // income or expense
        createdAt: serverTimestamp(), // Server timestamp for sorting
      });

      toast.success("Transaction added successfully!", {
        position: "top-center",
      });

      // Reset form fields
      setAmount("");
      setCategory("Groceries");
      setDate(new Date().toISOString().split("T")[0]);
      setDescription("");
      setTransactionType("expense");

      // Call parent callback to refresh transactions list
      onTransactionAdded();

      // Close modal
      onClose();
    } catch (error: any) {
      console.error("Error adding transaction:", error);
      toast.error("Failed to add transaction: " + mapFirebaseError(error), {
        position: "bottom-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if modal is not open
  if (!isOpen) return null;

  return (
    <>
      {/* Modal backdrop - dark overlay when modal is open */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal card centered on screen */}
      <div className="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto py-8">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4 my-auto">
          {/* Modal header with title and close button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Add Transaction
            </h2>
            {/* Close button (X) - click to close modal */}
            <button
              onClick={onClose}
              className="cancel text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Transaction form */}
          <form onSubmit={handleAddTransaction} className="space-y-4">
            {/* Transaction Type Selection - Income or Expense */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Type
              </label>
              <div className="flex gap-4">
                {/* Income button */}
                <button
                  type="button"
                  onClick={() => setTransactionType("income")}
                  className={`trans-card flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                    transactionType === "income"
                      ? "bg-green-500 text-white"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  + Income
                </button>
                {/* Expense button */}
                <button
                  type="button"
                  onClick={() => setTransactionType("expense")}
                  className={`trans-card flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                    transactionType === "expense"
                      ? "bg-red-500 text-white"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
                >
                  - Expense
                </button>
              </div>
            </div>

            {/* Amount Input Field */}
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Amount ($)
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                step="0.01"
                min="0"
                required
                className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Category Selection Dropdown */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {/* Expense categories */}
                <option value="Groceries">🛒 Groceries</option>
                <option value="Rent">🏠 Rent</option>
                <option value="Utilities">💡 Utilities</option>
                <option value="Entertainment">🎬 Entertainment</option>
                <option value="Food">🍔 Food & Dining</option>
                <option value="Transportation">🚗 Transportation</option>
                <option value="Shopping">🛍️ Shopping</option>
                <option value="Health">⚕️ Health & Medical</option>
                <option value="Other">📌 Other</option>
              </select>
            </div>

            {/* Date Input with Calendar */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Date
              </label>
              {/* HTML5 date input provides a calendar picker */}
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Description Input Field */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Grocery shopping, Monthly rent, Electricity bill"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Form Submit Button */}
            <div className="flex gap-3 pt-4">
              {/* Cancel button - closes modal without saving */}
              <button
                type="button"
                onClick={onClose}
                className="trans-card flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 font-medium transition-colors"
              >
                Cancel
              </button>
              {/* Submit button - adds transaction to Firebase */}
              <button
                type="submit"
                disabled={isLoading}
                className="trans-card flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 font-medium disabled:bg-gray-400 transition-colors"
              >
                {isLoading ? "Adding..." : "Add Transaction"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
