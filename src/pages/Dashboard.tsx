import { useState } from "react";
export default function Dashboard() {
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
              <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-lg">
                <div>
                  <h4 className="text-gray-800 font-bold">Total Balance</h4>
                  <p className="text-green-600 font-bold text-2xl">$8,750.56</p>
                </div>

                <div className="p-4 rounded-xl bg-green-100">
                  <img src="/dollar.png" className="w-6" />
                </div>
              </div>

              {/* CARD */}
              <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-lg">
                <div>
                  <h4 className="text-gray-800 font-bold">Total Balance</h4>
                  <p className="text-green-600 font-bold text-2xl">$8,750.56</p>
                </div>

                <div className="p-4 rounded-xl bg-green-100">
                  <img src="/trending-up.png" className="w-6" />
                </div>
              </div>

              {/* CARD */}
              <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-lg">
                <div>
                  <h4 className="text-gray-800 font-bold">Total Balance</h4>
                  <p className="text-green-600 font-bold text-2xl">$8,750.56</p>
                </div>

                <div className="p-4 rounded-xl bg-red-100">
                  <img src="/trending-down.png" className="w-6" />
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
  } as const;

  type Tabkey = keyof typeof tabContents;
  const [activeTab, setActiveTab] = useState<Tabkey>("dashboard");
  return (
    <>
      {/* SIDEBAR */}
      <div className="fixed top-0 left-0 w-64 h-screen bg-white shadow-xl p-6">
        <h2 className="font-bold text-xl text-green-800">Finance</h2>
        <p className="text-sm text-gray-400 mb-8">Personal Tracker</p>

        <ul className="space-y-4">
          <li
            className={`flex items-center justify-center cursor-pointer p-3 rounded-xl ${
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
            className={`flex items-center justify-center cursor-pointer p-3 rounded-xl ${
              activeTab === "transactions"
                ? "bg-green-700 text-white"
                : "text-gray-800"
            }`}
            onClick={() => setActiveTab("transactions")}
          >
            <img src="/transactions.svg" className="w-5 mr-3 dicon" />
            Transactions
          </li>
        </ul>
      </div>

      {/* MAIN PAGE OUTPUT */}
      <div>{tabContents[activeTab].content}</div>
    </>
  );
}
