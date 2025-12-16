import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { auth, db } from "./firebase";
import { getDoc, doc } from "firebase/firestore";

// Define User interface for authenticated user
interface AuthUser {
  fullName: string;
  email: string;
}

export default function Settings() {
  // State to check if notifications are ON or OFF
  const [notificationsOn, setNotificationsOn] = useState<boolean>(false);

  // State for authenticated user information
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  // State for form fields that can be edited
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // useEffect hook to fetch authenticated user data when component mounts
  useEffect(() => {
    // Get current authenticated user from Firebase
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          // Fetch user data from Firestore using their UID
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            // Extract user data from Firestore
            const userData = userDocSnapshot.data();
            const userInfo: AuthUser = {
              fullName: userData.fullName || "User",
              email: userData.email || user.email || "user@example.com",
            };
            setAuthUser(userInfo);
            // Populate form fields with user's data
            setFullName(userInfo.fullName);
            setEmail(userInfo.email);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const tabContent = {
    profile: {
      title: "Profile",
      content: (
        <>
          <h2 className="font-bold text-xl text-gray-800 text-left mt-0 mb-6">
            Profile Information
          </h2>
          {/* Display current authenticated user info */}
          <div className="mb-4 p-4 bg-blue-50 rounded-md border border-blue-200">
            <p className="text-sm text-gray-600">
              Currently logged in as:{" "}
              <span className="font-semibold text-gray-800">
                {authUser?.fullName || "Loading..."}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Email:{" "}
              <span className="font-semibold text-gray-800">
                {authUser?.email || "Loading..."}
              </span>
            </p>
          </div>

          {/* Profile form to edit user information */}
          <form className="flex flex-col gap-4">
            {/* Full Name input field */}
            <div>
              <label
                htmlFor="name"
                className="self-start block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                placeholder="JohnDoe"
                id="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="user-input w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Email input field */}
            <div>
              <label
                htmlFor="email"
                className="self-start block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                placeholder="you@email.com"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="email-input w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
            </div>
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
            <div className="w-full flex justify-between gap-4 mt-6">
              <div className="align-start flex gap-3">
                <img src="/notifications.svg" alt="notification icon" />
                <div className="flex flex-col ">
                  <h3 className="text-gray-800 text-left">
                    Email notifications
                  </h3>
                  <p className="text-gray-400 text-sm ">
                    Get notified about transactions
                  </p>
                </div>
              </div>

              {/* Toggle switch */}
              <div
                onClick={() => setNotificationsOn(!notificationsOn)} // Change state when clicked
                style={{
                  width: "46px", // Width of the switch
                  height: "24px", // Height of the switch
                  borderRadius: "20px", // Makes it round
                  backgroundColor: notificationsOn
                    ? "#22c55e" // Green when ON
                    : "#e5e7eb", // Light gray when OFF
                  display: "flex", // Allows circle movement
                  alignItems: "center", // Center circle vertically
                  padding: "2px", // Space inside the switch
                  cursor: "pointer", // Hand cursor on hover
                  transition: "background-color 0.3s", // Smooth color change
                }}
              >
                {/* Circle inside the switch */}
                <div
                  style={{
                    width: "20px", // Circle width
                    height: "20px", // Circle height
                    borderRadius: "50%", // Makes it a perfect circle
                    backgroundColor: "white", // Circle color
                    transform: notificationsOn
                      ? "translateX(22px)" // Move right when ON
                      : "translateX(0px)", // Stay left when OFF
                    transition: "transform 0.3s", // Smooth movement
                  }}
                />
              </div>
            </div>
          </div>
        </>
      ),
    },
    account: {
      title: "account",
      content: (
        <div className="flex flex-col w-full h-full bg-red-100 rounded-xl p-4 sm:p-6 md:p-8">
          <h3 className="font-bold text-xl text-left mb-4">Danger Zone</h3>
          <div className="w-full flex sm:flex-row justify-between items-start">
            <div className="flex flex-col space-y-1 items-start ">
              <p className="font-bold ">Delete Account</p>
              <p className="font-sm text-red-500">
                This action cannot be undone.
              </p>
            </div>
            <button className="acc text-white font-md px-2 py-2 rounded-xl mt-4 sm:mt-0">
              Delete Account
            </button>
          </div>
        </div>
      ),
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
