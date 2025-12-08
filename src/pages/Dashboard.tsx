import { useState } from "react";
import BalanceChart from "../components/BalanceChart"; // path points to src/components/BalanceChart.tsx
import { signOut } from "firebase/auth";
import { auth } from "../components/firebase"; // adjust path if different
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Dashboard() {
  const navigate = useNavigate();

  const [logoutActive, setLogoutActive] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.info("Logged out successfully");
      navigate("/signin");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const tabContents = {
    dashboard: {
      title: "Dashboard",
      content: (
        <>
          <div className="fixed top-0 left-64 right-0 h-24 bg-white shadow-md z-10 px-8 flex items-center justify-between">
            <h2 className="font-bold items-start text-lg text-gray-800">
              Dashboard
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
              <div className="w-full flex justify-between items-center px-8 mt-8">
                <h3 className="text-gray-800 font-bold text-2xl text-left">
                  Recent Transactions
                </h3>
                <button
                  type="submit"
                  className="add px-4 rounded-md  border border-gray-300 flex items-center justify-center gap-2 w-44 md:w-56"
                >
                  <span className="font-md text-2xl mr-2">+</span> Add
                  Transaction
                </button>
              </div>
              <div className="flex flex-col-2 justify-between items-center bg-white p-4 md:p-8 lg:p-12 shadow-lg rounded-xl">
                <div className="flex justify-items items-center space-x-2">
                  <div className="p-2 rounded-xl bg-green-100">
                    <img
                      src="/trending-up.png"
                      alt="trending arrow up"
                      className="w-6"
                    />
                  </div>
                  <div className="text-left">
                    <h3 className="text-gray-800 font-bold mb-2 text-lg">
                      Monthly Salary
                    </h3>
                    <p className="font-sm text-sm text-gray-500">Salary</p>
                  </div>
                </div>
                <div className="text-rigt">
                  <h3 className="text-green-700 font-bold mb-2 text-lg">
                    +$5000.0
                  </h3>
                  <p className="font-sm text-sm text-gray-500 text-right">
                    Nov 30
                  </p>
                </div>
              </div>
              <div className="flex flex-col-2 justify-between items-center bg-white p-4 md:p-8 lg:p-12 shadow-lg rounded-xl">
                <div className="flex justify-items items-center space-x-2">
                  <div className="p-2 rounded-xl bg-green-100">
                    <img
                      src="/restaurant.png"
                      alt="Restaurant icon"
                      className="w-6"
                    />
                  </div>
                  <div className="text-left">
                    <h3 className="text-gray-800 font-bold mb-2 text-lg">
                      Restaurant
                    </h3>
                    <p className="font-sm text-sm text-gray-500">Food</p>
                  </div>
                </div>
                <div className="text-rigt">
                  <h3 className="text-green-700 font-bold mb-2 text-lg">
                    +$200.0
                  </h3>
                  <p className="font-sm text-sm text-gray-500 text-right">
                    Dec 01
                  </p>
                </div>
              </div>
              <div className="flex flex-col-2 justify-between items-center bg-white p-4 md:p-8 lg:p-12 shadow-lg rounded-xl">
                <div className="flex justify-items items-center space-x-2">
                  <div className="p-2 rounded-xl bg-green-100">
                    <img src="/drinks.png" alt="Drinks icon" className="w-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-gray-800 font-bold mb-2 text-lg">
                      Drinks
                    </h3>
                    <p className="font-sm text-sm text-gray-500">Cofee</p>
                  </div>
                </div>
                <div className="text-rigt">
                  <h3 className="text-green-700 font-bold mb-2 text-lg">
                    +$90.0
                  </h3>
                  <p className="font-sm text-sm text-gray-500 text-right">
                    Dec 03
                  </p>
                </div>
              </div>
              <div className="flex flex-col-2 justify-between items-center bg-white p-4 md:p-8 lg:p-12 shadow-lg rounded-xl">
                <div className="flex justify-items items-center space-x-2">
                  <div className="p-2 rounded-xl bg-green-100">
                    <img src="/bills.png" alt="Bills" className="w-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-gray-800 font-bold mb-2 text-lg">
                      Bills
                    </h3>
                    <p className="font-sm text-sm text-gray-500">
                      Water & Electricity
                    </p>
                  </div>
                </div>
                <div className="text-rigt">
                  <h3 className="text-green-700 font-bold mb-2 text-lg">
                    +$100.0
                  </h3>
                  <p className="font-sm text-sm text-gray-500 text-right">
                    Nov 30
                  </p>
                </div>
              </div>
              <div className="flex flex-col-2 justify-between items-center bg-white p-4 md:p-8 lg:p-12 shadow-lg rounded-xl">
                <div className="flex justify-items items-center space-x-2">
                  <div className="p-2 rounded-xl bg-green-100">
                    <img src="/dollar.png" alt="Money" className="w-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-gray-800 font-bold mb-2 text-lg">
                      Deposit
                    </h3>
                    <p className="font-sm text-sm text-gray-500">Savings</p>
                  </div>
                </div>
                <div className="text-rigt">
                  <h3 className="text-green-700 font-bold mb-2 text-lg">
                    +$300.0
                  </h3>
                  <p className="font-sm text-sm text-gray-500 text-right">
                    Dec 06
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      ),
    },
    transactions: {
      title: "Transactions",
      content: (
        <>
          <div className="fixed top-0 left-64 right-0 h-24 bg-white shadow-md z-10 px-8 flex items-center justify-between">
            <h2 className="font-bold items-start text-lg text-gray-800">
              Transactions
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
