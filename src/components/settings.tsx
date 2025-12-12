/*import { useNavigate } from "react-router-dom";*/
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";

export default function Settings() {
  const tabContent = {
    profile: {
      title: "Profile",
      content: (
        <>
          <h2 className="font-bold text-xl text-gray-800 text-left mt-0 mb-6">
            Profile Information
          </h2>
          <form className="flex justify-between items-center  ">
            <label htmlFor="name" className="self-start">
              Full Name
            </label>
            <input
              type="text"
              placeholder="JohnDoe"
              id="name"
              required
              className="user-input p-2 border border-gray-300 rounded-md"
            />
            <label htmlFor="email" className="self-start">
              Email
            </label>
            <input
              type="email"
              placeholder="you@email.com"
              id="email"
              className="email-input p-2 border border-gray-300 rounded-md"
            />
          </form>
          <div className="flex justify-between items-center mt-6">
            <div className="flex flex-col items-start">
              <p className="font-md text-md text-gray-700">Password</p>
              <p className="font-md text-sm text-gray-400">Change Password</p>
            </div>
            <button
              type="button"
              className=" pass p-4 space-x-2 rounded-md hover:bg-green-700 flex items-center gap-2"
            >
              <img
                src="/password.png"
                alt="password icon"
                className="w-4 h-4"
              />{" "}
              Change Password
            </button>
          </div>
        </>
      ),
    },

    preferences: {
      title: "Preferences",
      content: (
        <>
          <div className="flex flex-col items-start space-y-3">
            <h3 className="font-bold text-lg text-gray-800">App Preferences</h3>
            <p>Currency</p>
            <select className="w-full border border-gray-300 rounded-md p-2 text-sm  text-gray-800">
              <option>US Dollar (USD)</option>
              <option>Euro (EUR)</option>
              <option>British Pound (GBP)</option>
            </select>
            <div></div>
          </div>
        </>
      ),
    },
    account: {
      title: "account",
      content: <div></div>,
    },
  } as const;
  type Tabkey = keyof typeof tabContent;
  const [activeTab, setActiveTab] = useState<Tabkey>("profile");

  return (
    <>
      <div className=" ml-64 pt-28 px-8">
        <div className="bg-white shadow-lg rounded-2xl text-base w-full max-w-3xl m-auto p-6 flex flex-col min-h-[400px] space-y-6">
          <ul className="flex w-full justify-between items-center bg-gray-100 rounded-4xl p-1 max-w-3xl mx-auto m-2">
            <li
              className={`text-lg cursor-pointer p-2 rounded-4xl w-full flex justify-center gap-2${
                activeTab == "profile"
                  ? " font-medium bg-white text-gray-800"
                  : " bg-gray-100 text-gray-500"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              <img src="/account.svg" className="w-5 h-5 align-middle" />{" "}
              Profile
            </li>
            <li
              className={`text-lg cursor-pointer p-2 rounded-2xl w-full flex justify-center gap-2${
                activeTab === "preferences"
                  ? " font-medium bg-white text-gray-800"
                  : " bg-gray-100 text-gray-500"
              }`}
              onClick={() => setActiveTab("preferences")}
            >
              <img src="/settings.png" className="w-5 h-5 align-middle" />{" "}
              Preferences
            </li>
            <li
              className={`text-lg cursor-pointer p-2 rounded-4xl w-full flex justify-center gap-2${
                activeTab === "account"
                  ? " font-medium bg-white text-gray-800"
                  : " bg-gray-100 text-gray-500"
              }`}
              onClick={() => setActiveTab("account")}
            >
              <img src="/warning.svg" className="w-5 h-5 align-middle" />{" "}
              Account
            </li>
          </ul>
          <div className="w-full flex flex-col space-y-6 m-auto">
            <p className="text-black font-md ">
              {tabContent[activeTab].content}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
