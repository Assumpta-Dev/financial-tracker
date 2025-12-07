import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../components/firebase";
import { setDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setFullname] = useState("");

  const handleLogout = async () => {
    await signOut(auth);
    toast.info("Logged out");
    navigate("/signin");
  };
  const handleRegistration: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long", {
        position: "top-center",
      });
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log(user);
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          fullName: name,
        });
      }

      console.log("User Registered Successfully!!");
      toast.success("User Registered Successfully!!", {
        position: "top-center",
      });

      // Redirect to sign in after 2 seconds
      setTimeout(() => {
        setActiveTab("signin"); // change to your sign-in route
      }, 2000);
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message, {
        position: "bottom-center",
      });
    }
  };
  const tabContent = {
    signin: {
      title: "Sign In",
      content: (
        <form className="w-full flex flex-col space-y-4 max-w-md m-auto">
          <label htmlFor="email" className="self-start">
            Email
          </label>
          <input
            type="email"
            placeholder="you@email.com"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            className="email-input p-2 border border-gray-300 rounded-md"
          />

          <label htmlFor="password" className="self-start">
            Password{" "}
          </label>
          <input
            type="password"
            placeholder="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            className="password-input p-2 border border-gray-300 rounded-md"
          />

          <button
            type="button"
            className="signin text-white p-2 rounded-md hover:bg-green-700"
            onClick={() => navigate("/dashboard")}
          >
            Sign In
          </button>
          <p className="text-gray-600 text-md">Or continue with</p>
          <button
            type="submit"
            className="google p-2 rounded-md  border border-gray-300 flex items-center justify-center space-x-2 w-full"
          >
            <span className="text-lg font-bold">G</span>
            <span> Google</span>
          </button>
        </form>
      ),
    },

    createAccount: {
      title: "Create Account",
      content: (
        <form
          onSubmit={handleRegistration}
          className="w-full flex flex-col space-y-4 max-w-md items-start m-auto"
        >
          <label htmlFor="name" className="self-start">
            Full Name
          </label>
          <input
            type="text"
            placeholder="JohnDoe"
            id="name"
            onChange={(e) => setFullname(e.target.value)}
            required
            className="user-input w-full p-2 border border-gray-300 rounded-md"
          />

          <label htmlFor="email" className="self-start">
            Email
          </label>
          <input
            type="email"
            placeholder="you@email.com"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="email-input w-full p-2 border border-gray-300 rounded-md"
          />

          <label htmlFor="password" className="self-start">
            Password
          </label>
          <input
            type="password"
            placeholder="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="password-input w-full p-2 border border-gray-300 rounded-md"
          />
          <p className="text-gray-600">
            Password must be atleast 8 characters long
          </p>

          <button
            type="submit"
            className="signin w-full  text-white p-2 rounded-md hover:bg-green-700"
          >
            Create Account
          </button>
          <p className="text-gray-600 text-md px-2">
            By signing up you agree to our Terms of Services and Privacy Policy
          </p>
        </form>
      ),
    },
  } as const;
  type Tabkey = keyof typeof tabContent;
  const [activeTab, setActiveTab] = useState<Tabkey>("signin");
  const navigate = useNavigate();

  return (
    <>
      <div className="grid grid-cols-2 w-full h-screen m-auto gap-4">
        <div className="flex flex-col p-8 bg-white my-auto">
          <div className="bg-green-100 p-2  rounded-xl flex items-center justify-center mx-auto">
            <img
              src="/finance-mode-icon.png"
              alt="Finance mode icon"
              className="p-4 h-16 w-16 object-contain "
            />
          </div>
          <h2 className="text-4xl font-bold text-gray-800 text-center p-2">
            Manage Your Money
          </h2>
          <p className="text-center text-gray-600 m-4 px-2">
            Track expenses, visualize spending patterns, and take control of
            your finances with our intuitive personal finance tracker.
          </p>
          <ul className="font-md text-sm  text-gray-800 list-disc list-inside text-left space-y-2 pl-0 marker:text-green-600">
            <li>Real-time expense tracking</li>
            <li>Smart analytics & insights</li>
            <li>Export & backup your data</li>
          </ul>
        </div>
        <div className="bg-white shadow-lg rounded-lg text-sm m-auto w-full h-full max-w-lg">
          <ul className="flex w-full p-2 space-x-4 justify-center items-center gap-4 bg-gray-100 rounded-2xl max-w-md mx-auto mt-8 mb-4">
            <li
              className={`text-lg cursor-pointer px-6 rounded-2xl w-full${
                activeTab == "signin"
                  ? " font-medium bg-white text-gray-800"
                  : " bg-gray-100 text-gray-500"
              }`}
              onClick={() => setActiveTab("signin")}
            >
              Sign In
            </li>
            <li
              className={`text-lg cursor-pointer px-6 rounded-2xl w-full${
                activeTab === "createAccount"
                  ? " font-medium bg-white text-gray-800"
                  : " bg-gray-100 text-gray-500"
              }`}
              onClick={() => setActiveTab("createAccount")}
            >
              Create Account
            </li>
          </ul>
          <div className="w-full flex flex-col m-auto">
            <p className="text-black font-md ">
              {tabContent[activeTab].content}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
