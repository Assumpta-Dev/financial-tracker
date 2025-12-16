import { useState, useEffect } from "react";
import BalanceChart from "../components/BalanceChart";
import { signOut } from "firebase/auth";
import { auth, db } from "../components/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import mapFirebaseError from "../utils/mapFirebaseError";
import IncomeExpenseChart from "../components/IncomeExpenseChart";
import CategoryPieChart from "../components/CategoryPieChart";
import Settings from "../components/settings";
import AddTransactionModal from "../components/AddTransactionModal";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";

// Define Transaction interface for type safety
interface Transaction {
  id: string;
  userId: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  type: "income" | "expense";
  createdAt?: any;
}

// Define User interface for authenticated user
interface AuthUser {
  fullName: string;
  email: string;
}

export default function Dashboard() {
  const navigate = useNavigate();

  // State for logout button
  const [logoutActive, setLogoutActive] = useState(false);

  // State for modal visibility
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);

  // State for transactions list from Firebase
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // State for authenticated user information
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  // State for loading and error handling
  const [isLoading, setIsLoading] = useState(true);

  // useEffect hook to fetch authenticated user data and set up transactions listener
  useEffect(() => {
    // Check if user is authenticated
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        // User is not authenticated, redirect to login
        navigate("/signin");
        return;
      }

      try {
        // Fetch user data from Firestore using their UID
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          // Set authenticated user information from Firestore
          const userData = userDocSnapshot.data();
          setAuthUser({
            fullName: userData.fullName || "User",
            email: userData.email || user.email || "user@example.com",
          });
        } else {
          // Fallback to Firebase auth user if not in Firestore
          setAuthUser({
            fullName: "User",
            email: user.email || "user@example.com",
          });
        }

        // Set up real-time listener for user's transactions
        // Query Firestore for transactions where userId matches current user's UID
        const q = query(
          collection(db, "transactions"),
          where("userId", "==", user.uid)
        );

        // Subscribe to real-time updates
        const unsubscribeTransactions = onSnapshot(q, (querySnapshot) => {
          const transactionsList: Transaction[] = [];
          querySnapshot.forEach((doc) => {
            // Convert Firestore document to Transaction object with ID
            transactionsList.push({
              id: doc.id,
              ...doc.data(),
            } as Transaction);
          });
          // Sort transactions by date (newest first)
          transactionsList.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setTransactions(transactionsList);
          setIsLoading(false);
        });

        return () => unsubscribeTransactions();
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  // Handle user logout
  const handleLogout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      toast.info("Logged out successfully");
      navigate("/signin");
    } catch (error: any) {
      toast.error(mapFirebaseError(error));
    }
  };

  // Handle delete transaction
  const handleDeleteTransaction = async (transactionId: string) => {
    // Confirm deletion with user
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      // Delete transaction document from Firestore
      await deleteDoc(doc(db, "transactions", transactionId));
      toast.success("Transaction deleted successfully", {
        position: "top-center",
      });
    } catch (error: any) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction: " + mapFirebaseError(error), {
        position: "bottom-center",
      });
    }
  };

  // Handle transaction refresh callback from modal
  const handleTransactionAdded = () => {
    // Transactions will be automatically updated by the useEffect listener
    // This callback is just for any additional actions if needed
  };

  const tabContents = {
    dashboard: {
      title: "Dashboard",
      content: (
        <>
          {/* Top Header Bar - displays authenticated user info */}
          <div className="fixed top-0 left-64 right-0 h-24 bg-white shadow-md z-10 px-8 flex items-center justify-between">
            <h2 className="font-bold items-start text-lg text-gray-800">
              Dashboard
            </h2>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                {/* Display authenticated user's full name */}
                <p className="font-bold text-gray-800">
                  {authUser?.fullName || "Loading..."}
                </p>
                {/* Display authenticated user's email */}
                <p className="text-sm text-gray-500">
                  {authUser?.email || "Loading..."}
                </p>
              </div>

              <div className="p-3 rounded-full bg-gray-100">
                <img src="/person.png" alt="Profile" className="w-6" />
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="ml-64 pt-28 px-8">
            <div className="grid grid-cols-3 gap-6">
              {/* CARD */}
              <div className="flex justify-between items-center bg-white p-4 md:p-8 rounded-xl shadow-lg">
                <div>
                  <h4 className="text-gray-800 font-bold">Total Balance</h4>
                  <p className="text-green-600 font-bold text-2xl">$8,750.56</p>
                </div>

                <div className="p-4 rounded-xl bg-green-100">
                  <img src="/dollar.png" className="w-6" />
                </div>
              </div>

              {/* CARD */}
              <div className="flex justify-between items-center bg-white p-4 md:p-8 rounded-xl shadow-lg">
                <div>
                  <h4 className="text-gray-800 font-bold">Total Balance</h4>
                  <p className="text-green-600 font-bold text-2xl">$2,800.5</p>
                </div>

                <div className="p-4 rounded-xl bg-green-100">
                  <img src="/trending-up.png" className="w-6" />
                </div>
              </div>

              {/* CARD */}
              <div className="flex justify-between items-center bg-white p-4 md:p-8 rounded-xl shadow-lg">
                <div>
                  <h4 className="text-gray-800 font-bold">Total Balance</h4>
                  <p className="text-green-600 font-bold text-2xl">$1,000.0</p>
                </div>

                <div className="p-4 rounded-xl bg-red-100">
                  <img src="/trending-down.png" className="w-6" />
                </div>
              </div>
            </div>
            {/*chart card*/}
            <div className="w-full flex flex-col bg-white h-64 md:h-96 p-4 md:p-8 lg:p-12 mt-8 rounded-xl shadow-lg">
              {/* Heading at the TOP */}
              <h3 className="text-gray-800 font-bold mb-4 text-lg text-left">
                Balance Trend
              </h3>

              {/* Chart takes the remaining space */}
              <div className="w-full flex-1 text-sm">
                <BalanceChart
                  data={[
                    { date: "Jan-05", balance: 7899.567 },
                    { date: "March-20", balance: 5555.6 },
                    { date: "June-28", balance: 3900.0 },
                    { date: "July-01", balance: 2800.5 },
                    { date: "Aug-15", balance: 2200.95 },
                    { date: "Oct-07", balance: 1200.95 },
                    { date: "Today", balance: 1000.0 },
                  ]}
                />
              </div>
            </div>
            {/*Recent transaction cards*/}
            <div className="flex flex-col h-full gap-4">
              <div className="w-full flex justify-between items-center mt-8">
                <h3 className="text-gray-800 font-bold text-2xl text-left">
                  Recent Transactions
                </h3>
                {/* Add Transaction button - opens modal */}
                <button
                  onClick={() => setIsAddTransactionOpen(true)}
                  className="add px-2 py-2 rounded-md bg-green-500 text-white flex items-center justify-center gap-1 w-44 md:w-56 hover:bg-green-600 transition"
                >
                  <span className="font-md text-xl mr-2">+</span> Add
                  Transaction
                </button>
              </div>

              {/* Dynamic Transaction Cards - from Firebase */}
              {isLoading ? (
                <div className="h-full flex items-center justify-center py-8">
                  <p className="text-gray-500">Loading transactions...</p>
                </div>
              ) : transactions.length === 0 ? (
                <div className="h-full flex items-center justify-center py-8">
                  <p className="text-gray-500">
                    No transactions yet. Click "Add Transaction" to get started!
                  </p>
                </div>
              ) : (
                // Display each transaction from Firebase
                transactions.slice(0, 5).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex flex-col-2 justify-between items-center bg-white p-4 md:p-8 lg:p-12 shadow-lg rounded-xl"
                  >
                    {/* Transaction info section - left side */}
                    <div className="flex justify-items items-center space-x-2">
                      {/* Category icon background - color based on income/expense */}
                      <div
                        className={`p-2 rounded-xl ${
                          transaction.type === "income"
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        {/* Icon for transaction type */}
                        <img
                          src={
                            transaction.type === "income"
                              ? "/trending-up.png"
                              : "/trending-down.png"
                          }
                          alt={transaction.category}
                          className="w-6"
                        />
                      </div>

                      {/* Transaction category and description */}
                      <div className="text-left">
                        <h3 className="text-gray-800 font-bold mb-2 text-lg">
                          {transaction.category}
                        </h3>
                        <p className="font-sm text-sm text-gray-500">
                          {transaction.description || "No description"}
                        </p>
                      </div>
                    </div>

                    {/* Transaction amount and actions section - right side */}
                    <div className="text-right flex items-center justify-end gap-2">
                      <div className="flex flex-col items-end">
                        {/* Display amount with +/- prefix based on type */}
                        <h3
                          className={`font-bold mb-2 text-lg ${
                            transaction.type === "income"
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}$
                          {transaction.amount.toFixed(2)}
                        </h3>
                        {/* Transaction date */}
                        <p className="font-sm text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Delete button - removes transaction */}
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="trans-card ml-4 text-red-500 hover:text-red-700 font-bold text-lg"
                        title="Delete transaction"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Modal for adding new transactions */}
          <AddTransactionModal
            isOpen={isAddTransactionOpen}
            onClose={() => setIsAddTransactionOpen(false)}
            onTransactionAdded={handleTransactionAdded}
          />
        </>
      ),
    },
    transactions: {
      title: "Transactions",
      content: (
        <>
          {/* Top Header Bar - displays authenticated user info for Transactions tab */}
          <div className="fixed top-0 left-64 right-0 h-24 bg-white shadow-md z-10 px-8 flex items-center justify-between">
            <h2 className="font-bold items-start text-lg text-gray-800">
              Transactions
            </h2>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                {/* Display authenticated user's full name */}
                <p className="font-bold text-gray-800">
                  {authUser?.fullName || "Loading..."}
                </p>
                {/* Display authenticated user's email */}
                <p className="text-sm text-gray-500">
                  {authUser?.email || "Loading..."}
                </p>
              </div>

              <div className="p-3 rounded-full bg-gray-100">
                <img src="/person.png" alt="Profile" className="w-6" />
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="ml-64 pt-28 px-8">
            <div className="flex flex-col h-full gap-4">
              <div className="w-full flex justify-between mt-8">
                <div className="flex-col items-center">
                  <h3 className="text-gray-800 font-bold text-2xl text-left">
                    Transactions
                  </h3>
                  <p className="text-gray-500 text-sm text-left">
                    View and manage all your financial transactions
                  </p>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <button
                    type="submit"
                    className="download flex px-3 rounded-md  border border-gray-300  gap-1 text-xs"
                  >
                    <img src="/download.svg" alt="download icon" className="" />
                    Export SCV
                  </button>
                  <button
                    type="submit"
                    className="add px-2  rounded-md  border border-gray-300 gap-1 text-xs"
                  >
                    <span className="font-md text-md">+</span> Add Transaction
                  </button>
                </div>
              </div>

              <div className="grid grid-col-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* CARD */}
                <div className="flex justify-between items-center bg-white p-4 md:p-8 gap-1rounded-xl shadow-lg min-w-max">
                  <div className="text-left">
                    <h4 className="text-gray-800 font-bold">Total Balance</h4>
                    <p className="text-green-600 font-bold text-2xl">
                      $8,750.56
                    </p>
                  </div>

                  <div className="p-2 rounded-xl bg-green-100">
                    <p className="text-green-800 text-sm text-right">+2</p>
                  </div>
                </div>

                {/* CARD */}
                <div className="flex justify-between items-center bg-white p-4 md:p-8 gap-1 rounded-xl shadow-lg min-w-max">
                  <div className="text-left ">
                    <h4 className="text-gray-800 font-bold">Total Balance</h4>
                    <p className="text-red-600 font-bold text-2xl">$2,800.5</p>
                  </div>

                  <div className="p-2 rounded-xl bg-red-100">
                    <p className="text-red-800 text-sm text-right">4</p>
                  </div>
                </div>

                {/* CARD */}
                <div className="flex justify-between items-center bg-white p-4 md:p-8 gap-1 rounded-xl shadow-lg min-w-max">
                  <div className="text-left">
                    <h4 className="text-gray-800 font-bold">Total Balance</h4>
                    <p className="text-green-600 font-bold text-2xl">
                      $1,000.0
                    </p>
                  </div>

                  <div className="p-2 rounded-xl bg-green-100">
                    <p className="text-green-800 text-sm text-right">Total 6</p>
                  </div>
                </div>
              </div>
              {/*filtering card*/}
              <div className="w-full flex flex-col bg-white h-32 md:h-42 p-4 md:p-8 lg:p-12 mt-8 rounded-xl shadow-lg">
                {/* Heading at the TOP */}

                <h3 className="flex text-gray-800 font-bold text-lg text-left my-0">
                  <img src="/filter.svg" alt="filtering icon" /> Filters
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                  {/* Search */}
                  <div className="flex flex-col gap-1 text-gray-800 text-left">
                    <h6 className="font-medium">Search</h6>
                    <div className="relative ">
                      <img
                        src="/search.svg"
                        alt="search-icon"
                        className=" absolute left-0 top-1/2 -translate-y-1/2"
                      />

                      <input
                        type="text"
                        name="search"
                        placeholder="Search transactions"
                        className="w-full border border-gray-300 rounded-md pl-6 py-2 text-sm text-gray-700"
                      />
                    </div>
                  </div>

                  {/* Type */}
                  <div className="flex flex-col gap-1 text-gray-800 text-left">
                    <h6 className="font-medium">Type</h6>
                    <select className="border border-gray-300 rounded-md p-2 text-sm ">
                      <option>All Types</option>
                      <option>Income</option>
                      <option>Expenses</option>
                    </select>
                  </div>

                  {/* Category */}
                  <div className="flex flex-col gap-1 text-gray-800 text-left">
                    <h6 className="font-medium">Category</h6>
                    <select className="border border-gray-300 rounded-md p-2 text-sm ">
                      <option className="cursor-pointer hover:bg-green-100 hover:border-green-500">
                        All Categories
                      </option>
                      <option>Salary</option>
                      <option>Food</option>
                      <option>Entertainment</option>
                      <option>Freelance</option>
                      <option>Transportation</option>
                    </select>
                  </div>

                  {/* Button (no heading) */}
                  <div className="flex items-end">
                    <button className="filter w-full rounded-md p-2">
                      Clear Filter
                    </button>
                  </div>
                </div>
              </div>
              {/*Recent transaction cards*/}

              <div className="flex flex-col-2 justify-between items-center bg-white p-4 md:p-8 lg:p-12 shadow-lg rounded-xl">
                <div className="flex justify-items items-center space-x-2">
                  <div className="p-2 rounded-xl bg-green-500 list-disc list-inside items-start"></div>
                  <div className="text-left w-full">
                    <h3 className="text-gray-800 font-bold mb-2 text-lg">
                      Monthly Salary
                    </h3>
                    <p className="transaction font-sm text-sm text-gray-500">
                      Salary
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-2 space-x-2">
                    <div className="flex flex-col items center">
                      <h3 className="text-green-700 font-bold text-lg">
                        +$300.0
                      </h3>
                      <p className="trans font-sm text-sm text-green-500 bg-green-100">
                        income
                      </p>
                    </div>

                    <img
                      src="edit.svg"
                      alt="edit icon"
                      className="w-5 h-5 cursor-pointer"
                    />
                    <img
                      src="delete.svg"
                      alt="delete icon"
                      className="w-5 h-5 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col-2 justify-between items-center bg-white p-4 md:p-8 lg:p-12 shadow-lg rounded-xl">
                <div className="flex justify-items items-center space-x-2">
                  <div className="p-2 rounded-xl bg-red-500 list-disc list-inside items-start"></div>
                  <div className="text-left">
                    <h3 className="text-gray-800 font-bold mb-2 text-lg">
                      Restaurant
                    </h3>
                    <p className="transaction font-sm text-sm text-gray-500">
                      Food
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-2 space-x-2">
                    <div className="flex flex-col items center">
                      <h3 className="text-red-700 font-bold text-lg">
                        -$300.0
                      </h3>
                      <p className="trans font-sm text-sm text-red-500 bg-red-100">
                        expense
                      </p>
                    </div>

                    <img
                      src="edit.svg"
                      alt="edit icon"
                      className="w-5 h-5 cursor-pointer"
                    />
                    <img
                      src="delete.svg"
                      alt="delete icon"
                      className="w-5 h-5 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col-2 justify-between items-center bg-white p-4 md:p-8 lg:p-12 shadow-lg rounded-xl">
                <div className="flex justify-items items-center space-x-2">
                  <div className="p-2 rounded-xl bg-red-500 list-disc list-inside items-start"></div>
                  <div className="text-left">
                    <h3 className="text-gray-800 font-bold mb-2 text-lg">
                      Drinks
                    </h3>
                    <p className="transaction font-sm text-sm text-gray-500">
                      Cofee
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-2 space-x-2">
                    <div className="flex flex-col items center">
                      <h3 className="text-red-700 font-bold text-lg">
                        -$300.0
                      </h3>
                      <p className="trans font-sm text-sm text-red-500 bg-red-100">
                        expense
                      </p>
                    </div>

                    <img
                      src="edit.svg"
                      alt="edit icon"
                      className="w-5 h-5 cursor-pointer"
                    />
                    <img
                      src="delete.svg"
                      alt="delete icon"
                      className="w-5 h-5 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col-2 justify-between items-center bg-white p-4 md:p-8 lg:p-12 shadow-lg rounded-xl">
                <div className="flex justify-items items-center space-x-2">
                  <div className="p-2 rounded-xl bg-red-500 list-disc list-inside items-start"></div>
                  <div className="text-left">
                    <h3 className="text-gray-800 font-bold mb-2 text-lg">
                      Bills
                    </h3>
                    <p className="transaction font-sm text-sm text-gray-500">
                      Water & Electricity
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-2 space-x-2">
                    <div className="flex flex-col items center">
                      <h3 className="text-red-700 font-bold text-lg">
                        -$300.0
                      </h3>
                      <p className="trans font-sm text-sm text-red-500 bg-red-100">
                        expense
                      </p>
                    </div>

                    <img
                      src="edit.svg"
                      alt="edit icon"
                      className="w-5 h-5 cursor-pointer"
                    />
                    <img
                      src="delete.svg"
                      alt="delete icon"
                      className="w-5 h-5 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col-2 justify-between items-center bg-white p-4 md:p-8 lg:p-12 shadow-lg rounded-xl">
                <div className="flex justify-items items-center space-x-2">
                  <div className="p-2 rounded-xl bg-green-500 list-disc list-inside items-start"></div>
                  <div className="text-left">
                    <h3 className="text-gray-800 font-bold mb-2 text-lg">
                      Freelance Project
                    </h3>
                    <p className="transaction font-sm text-sm text-gray-500">
                      Freelance
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-2 space-x-2">
                    <div className="flex flex-col items center">
                      <h3 className="text-green-700 font-bold text-lg">
                        +$300.0
                      </h3>
                      <p className="trans font-sm text-sm text-green-500 bg-green-100">
                        income
                      </p>
                    </div>

                    <img
                      src="edit.svg"
                      alt="edit icon"
                      className="w-5 h-5 cursor-pointer"
                    />
                    <img
                      src="delete.svg"
                      alt="delete icon"
                      className="w-5 h-5 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ),
    },
    categories: {
      title: "Categories",
      content: (
        <>
          <div className="fixed top-0 left-64 right-0 h-24 bg-white shadow-md z-10 px-8 flex items-center justify-between">
            <h2 className="font-bold items-start text-lg text-gray-800">
              Categories
            </h2>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                {/* Display authenticated user's full name */}
                <p className="font-bold text-gray-800">
                  {authUser?.fullName || "Loading..."}
                </p>
                {/* Display authenticated user's email */}
                <p className="text-sm text-gray-500">
                  {authUser?.email || "Loading..."}
                </p>
              </div>

              <div className="p-3 rounded-full bg-gray-100">
                <img src="/person.png" alt="Profile" className="w-6" />
              </div>
            </div>
          </div>
          <div className="ml-64 pt-28 px-8">
            <div className="flex flex-col h-full gap-4">
              <div className="w-full flex justify-between items-center mt-8">
                <div className="flex-col items-center">
                  <h3 className="text-gray-800 font-bold text-2xl text-left">
                    Categories
                  </h3>
                  <p className="text-gray-500 text-sm text-left">
                    Manage your transaction categories
                  </p>
                </div>
                <button
                  type="submit"
                  className="add  rounded-md  border border-gray-300 flex items-center justify-center text-sm gap-1 w-44 md:w-56"
                >
                  <span className="font-md text-xl mr-2">+</span> Add Category
                </button>
              </div>
              <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-6 justify-center items-stretch ">
                {/* Card 1 */}
                <div className="w-full flex flex-col items-center bg-white text-gray-800 rounded-md shadow-xl gap-4 p-6 min-h-[200px]">
                  <div className="flex justify-center items-center space-x-2">
                    <img
                      src="category-1.svg"
                      alt="category icon"
                      className="w-6 h-6"
                    />
                    <h3 className="font-bold text-xl text-green-600">
                      Income Categories (2)
                    </h3>
                  </div>
                  <div className="flex justify-between items-center w-full gap-4 space-x-2 bg-gray-50 rounded-lg p-2">
                    {/* Left: H3 and P */}
                    <div className="flex justify-center space-x-2 gap-1">
                      <h3 className="text-gray-700 font-bold text-lg">
                        Salary
                      </h3>
                      <p className="trans font-sm text-sm text-green-500 bg-gray-100 p-2 rounded">
                        income
                      </p>
                    </div>

                    {/* Right: Icons */}
                    <div className="flex gap-4">
                      <img
                        src="edit.svg"
                        alt="edit icon"
                        className="w-5 h-5 cursor-pointer"
                      />
                      <img
                        src="delete.svg"
                        alt="delete icon"
                        className="w-5 h-5 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center w-full gap-4 space-x-2 bg-gray-50 rounded-lg p-2">
                    {/* Left: H3 and P */}
                    <div className="flex justify-center space-x-2 gap-1">
                      <h3 className="text-gray-700 font-bold text-lg">
                        Freelancer
                      </h3>
                      <p className="trans font-sm text-sm text-green-500 bg-gray-100 p-2 rounded">
                        income
                      </p>
                    </div>

                    {/* Right: Icons */}
                    <div className="flex gap-4">
                      <img
                        src="edit.svg"
                        alt="edit icon"
                        className="w-5 h-5 cursor-pointer"
                      />
                      <img
                        src="delete.svg"
                        alt="delete icon"
                        className="w-5 h-5 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="w-full flex flex-col items-center bg-white text-gray-800 rounded-md shadow-xl gap-4 p-6 min-h-[200px]">
                  <div className="flex justify-center items-center space-x-2">
                    <img
                      src="category-2.svg"
                      alt="category icon"
                      className="w-6 h-6"
                    />
                    <h3 className="font-bold text-xl text-red-600">
                      Expense Categories (4)
                    </h3>
                  </div>
                  <div className="flex justify-between items-center w-full gap-4 space-x-2 bg-gray-50 rounded-lg p-2">
                    {/* Left: H3 and P */}
                    <div className="flex justify-center space-x-2 gap-1">
                      <h3 className="text-gray-700 font-bold text-lg">Food</h3>
                      <p className="trans font-sm text-sm text-red-500 bg-gray-100 p-2 rounded">
                        expense
                      </p>
                    </div>

                    {/* Right: Icons */}
                    <div className="flex gap-4">
                      <img
                        src="edit.svg"
                        alt="edit icon"
                        className="w-5 h-5 cursor-pointer"
                      />
                      <img
                        src="delete.svg"
                        alt="delete icon"
                        className="w-5 h-5 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center w-full gap-4 space-x-2 bg-gray-50 rounded-lg p-2">
                    {/* Left: H3 and P */}
                    <div className="flex justify-center space-x-2 gap-1">
                      <h3 className="text-gray-700 font-bold text-lg">
                        Entertainment
                      </h3>
                      <p className="trans font-sm text-sm text-red-500 bg-gray-100 p-2 rounded">
                        expense
                      </p>
                    </div>

                    {/* Right: Icons */}
                    <div className="flex gap-4">
                      <img
                        src="edit.svg"
                        alt="edit icon"
                        className="w-5 h-5 cursor-pointer"
                      />
                      <img
                        src="delete.svg"
                        alt="delete icon"
                        className="w-5 h-5 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center w-full gap-4 space-x-2 bg-gray-50 rounded-lg p-2">
                    {/* Left: H3 and P */}
                    <div className="flex justify-center space-x-2 gap-1">
                      <h3 className="text-gray-700 font-bold text-lg">
                        Transportation
                      </h3>
                      <p className="trans font-sm text-sm text-red-500 bg-gray-100 p-2 rounded">
                        expense
                      </p>
                    </div>

                    {/* Right: Icons */}
                    <div className="flex gap-4">
                      <img
                        src="edit.svg"
                        alt="edit icon"
                        className="w-5 h-5 cursor-pointer"
                      />
                      <img
                        src="delete.svg"
                        alt="delete icon"
                        className="w-5 h-5 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center w-full gap-4 space-x-2 bg-gray-50 rounded-lg p-2">
                    {/* Left: H3 and P */}
                    <div className="flex justify-center space-x-2 gap-1">
                      <h3 className="text-gray-700 font-bold text-lg">Bills</h3>
                      <p className="trans font-sm text-sm text-red-500 bg-gray-100 p-2 rounded">
                        expense
                      </p>
                    </div>

                    {/* Right: Icons */}
                    <div className="flex gap-4">
                      <img
                        src="edit.svg"
                        alt="edit icon"
                        className="w-5 h-5 cursor-pointer"
                      />
                      <img
                        src="delete.svg"
                        alt="delete icon"
                        className="w-5 h-5 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ),
    },
    analytics: {
      title: "Analytics",
      content: (
        <>
          <div className="fixed top-0 left-64 right-0 h-24 bg-white shadow-md z-10 px-8 flex items-center justify-between">
            <h2 className="font-bold items-start text-lg text-gray-800">
              Analytics
            </h2>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                {/* Display authenticated user's full name */}
                <p className="font-bold text-gray-800">
                  {authUser?.fullName || "Loading..."}
                </p>
                {/* Display authenticated user's email */}
                <p className="text-sm text-gray-500">
                  {authUser?.email || "Loading..."}
                </p>
              </div>

              <div className="p-3 rounded-full bg-gray-100">
                <img src="/person.png" alt="Profile" className="w-6" />
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="ml-64 pt-28 px-8">
            <div className="grid grid-cols-3 gap-6">
              {/* CARD */}
              <div className="flex justify-between items-center bg-white p-4 md:p-8 rounded-xl shadow-lg">
                <div>
                  <h4 className="text-gray-800 font-bold">Total Balance</h4>
                  <p className="text-green-600 font-bold text-2xl">$8,750.56</p>
                </div>

                <div className="p-4 rounded-xl bg-green-100">
                  <img src="/trending-down-1.svg" className="w-6" />
                </div>
              </div>

              {/* CARD */}
              <div className="flex justify-between items-center bg-white p-4 md:p-8 rounded-xl shadow-lg">
                <div>
                  <h4 className="text-gray-800 font-bold">Total Balance</h4>
                  <p className="text-green-600 font-bold text-2xl">$2,800.5</p>
                </div>

                <div className="p-4 rounded-xl bg-green-100">
                  <img src="/trending-up.png" className="w-6" />
                </div>
              </div>

              {/* CARD */}
              <div className="flex justify-between items-center bg-white p-4 md:p-8 rounded-xl shadow-lg">
                <div>
                  <h4 className="text-gray-800 font-bold">Total Balance</h4>
                  <p className="text-green-600 font-bold text-2xl">$1,000.0</p>
                </div>

                <div className="p-4 rounded-xl bg-red-100">
                  <img src="/trending-down.png" className="w-6" />
                </div>
              </div>
            </div>

            {/* ================= CHART 1 ================= */}
            <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-6 justify-center items-stretch mt-6">
              <div className="w-full flex flex-col bg-white text-gray-800 rounded-md shadow-xl p-2 min-h-[350px]">
                <IncomeExpenseChart
                  data={[
                    { month: "Jan", income: 3000, expense: 2000 },
                    { month: "Feb", income: 2500, expense: 3500 },
                    { month: "Mar", income: 2000, expense: 9800 },
                    { month: "Apr", income: 4000, expense: 1500 },
                    { month: "May", income: 3200, expense: 2100 },
                    { month: "Jun", income: 5000, expense: 3000 },
                  ]}
                />
              </div>

              {/* ================= CHART 2 ================= */}

              <div className="w-full flex flex-col bg-white text-gray-800 rounded-md shadow-xl p-2 min-h-[350px]">
                <CategoryPieChart
                  data={[
                    { name: "Food", value: 450 },
                    { name: "Transport", value: 320 },
                    { name: "Entertainment", value: 280 },
                    { name: "Bills", value: 200 },
                    { name: "Drinks", value: 15 },
                  ]}
                />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-3xl mx-auto mt-8">
              <h2 className="text-xl font-semibold mb-4">Summary</h2>

              <div className="grid grid-cols-3 gap-6 text-center">
                {/* Savings Rate */}
                <div>
                  <p className="text-gray-500 text-sm">Savings Rate</p>
                  <p className="text-green-600 font-bold text-2xl">52%</p>
                </div>

                {/* Average Monthly Expense */}
                <div>
                  <p className="text-gray-500 text-sm">
                    Average Monthly Expense
                  </p>
                  <p className="text-gray-800 font-bold text-2xl">$1,767.67</p>
                </div>

                {/* Average Monthly Income */}
                <div>
                  <p className="text-gray-500 text-sm">
                    Average Monthly Income
                  </p>
                  <p className="text-gray-800 font-bold text-2xl">$3,490.00</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ),
    },
    settings: {
      title: "Settings",
      content: (
        <>
          <div className="fixed top-0 left-64 right-0 h-24 bg-white shadow-md z-10 px-8 flex items-center justify-between">
            <h2 className="font-bold items-start text-lg text-gray-800">
              Settings
            </h2>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                {/* Display authenticated user's full name */}
                <p className="font-bold text-gray-800">
                  {authUser?.fullName || "Loading..."}
                </p>
                {/* Display authenticated user's email */}
                <p className="text-sm text-gray-500">
                  {authUser?.email || "Loading..."}
                </p>
              </div>

              <div className="p-3 rounded-full bg-gray-100">
                <img src="/person.png" alt="Profile" className="w-6" />
              </div>
            </div>
          </div>
          {/*Settings main content*/}
          <div>
            <Settings />
          </div>
        </>
      ),
    },
    signout: {
      title: "Sign Out",
      content: (
        <>
          <div className="fixed top-0 left-64 right-0 h-24 bg-white shadow-md z-10 px-8 flex items-center justify-between">
            <h2 className="font-bold items-start text-lg text-gray-800">
              Sign Out
            </h2>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-bold text-gray-800">Joe Doe</p>
                <p className="text-sm text-gray-500">john@example.com</p>
              </div>

              <div className="p-3 rounded-full bg-gray-100">
                <img src="/person.png" alt="Profile" className="w-6" />
              </div>
            </div>
          </div>
        </>
      ),
    },
  } as const;

  type Tabkey = keyof typeof tabContents;
  const [activeTab, setActiveTab] = useState<Tabkey>("dashboard");
  return (
    <>
      {/* SIDEBAR */}
      <div className="fixed top-0 left-0 w-64 h-screen bg-white shadow-xl p-6">
        <div className="text-left">
          <h2 className="font-bold text-xl text-green-800">Finance</h2>
          <p className="text-sm text-gray-400 mb-8">Personal Tracker</p>
        </div>

        <ul className="space-y-4">
          <li
            className={`flex items-center justify-start cursor-pointer p-3 rounded-xl ${
              activeTab === "dashboard"
                ? "bg-green-700 text-white"
                : "text-gray-800"
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <img src="/dashboard.svg" className="w-5 mr-3 dicon" />
            Dashboard
          </li>
          <li
            className={`flex items-center justify-start cursor-pointer p-3 rounded-xl ${
              activeTab === "transactions"
                ? "bg-green-700 text-white"
                : "text-gray-800"
            }`}
            onClick={() => setActiveTab("transactions")}
          >
            <img src="/transactions.svg" className="w-5 mr-3 dicon" />
            Transactions
          </li>
          <li
            className={`flex items-center justify-start cursor-pointer p-3 rounded-xl ${
              activeTab === "categories"
                ? "bg-green-700 text-white"
                : "text-gray-800"
            }`}
            onClick={() => setActiveTab("categories")}
          >
            <img src="/category.svg" className="w-5 mr-3 dicon" />
            Categories
          </li>
          <li
            className={`flex items-center justify-start cursor-pointer p-3 rounded-xl ${
              activeTab === "analytics"
                ? "bg-green-700 text-white"
                : "text-gray-800"
            }`}
            onClick={() => setActiveTab("analytics")}
          >
            <img src="/analytics.svg" className="w-5 mr-3 dicon" />
            Analytics
          </li>
          <li
            className={`flex items-center justify-start cursor-pointer p-3 rounded-xl ${
              activeTab === "settings"
                ? "bg-green-700 text-white"
                : "text-gray-800"
            }`}
            onClick={() => setActiveTab("settings")}
          >
            <img src="/settings.svg" className="w-5 mr-3 dicon" />
            Settings
          </li>
          <li
            className={`flex items-center justify-start cursor-pointer p-3 rounded-xl ${
              logoutActive ? "bg-green-700 text-white" : "text-gray-800"
            }`}
            onClick={() => {
              setLogoutActive(true);
              handleLogout();
            }}
          >
            <img src="/logout.svg" className="w-5 mr-3 dicon" />
            Sign Out
          </li>
        </ul>
      </div>

      {/* MAIN PAGE OUTPUT */}
      <div className="w-full">{tabContents[activeTab].content}</div>
    </>
  );
}
