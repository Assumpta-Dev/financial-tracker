import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast /*ToastContainer*/ } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../components/firebase";
import mapFirebaseError from "../utils/mapFirebaseError";
import { setDoc, doc, getDoc } from "firebase/firestore";
/*import { signOut } from "firebase/auth";*/

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setFullname] = useState("");
  const navigate = useNavigate();

  /*const handleLogout = async () => {
    await signOut(auth);
    toast.info("Logged out");
    navigate("/signin");
  };*/

  // Handle user registration with validation
  const handleRegistration: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();

    // Validate password length
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long", {
        position: "top-center",
      });
      return;
    }

    try {
      // Create user account in Firebase Authentication
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log(user);

      // Store user data in Firestore database
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          fullName: name,
          createdAt: new Date().toISOString(),
        });
      }

      console.log("User Registered Successfully!!");
      toast.success("User Registered Successfully!!", {
        position: "top-center",
      });

      // Redirect to signin after registration
      setTimeout(() => {
        setActiveTab("signin");
      }, 2000);
    } catch (error: any) {
      console.log(error.message);
      toast.error(mapFirebaseError(error), {
        position: "bottom-center",
      });
    }
  };

  // Handle user sign in with authentication validation
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Sign in user with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Check if user exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (!userDocSnapshot.exists()) {
        // User account not created, prevent signin
        toast.error("Account not found. Please create an account first.", {
          position: "top-center",
        });
        await auth.signOut();
        return;
      }

      console.log("User Signed In Successfully!!");
      toast.success("Signed In Successfully!!", {
        position: "top-center",
      });

      // Redirect to dashboard after successful authentication
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error: any) {
      console.log(error.message);
      toast.error(mapFirebaseError(error) || "Sign in failed", {
        position: "bottom-center",
      });
    }
  };
  const tabContent = {
    signin: {
      title: "Sign In",
      content: (
        <form
          onSubmit={handleSignIn}
          className="w-full flex flex-col space-y-4 max-w-md m-auto"
        >
          <label htmlFor="email" className="self-start">
            Email
          </label>
          <input
            type="email"
            placeholder="you@email.com"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="email-input p-2 border border-gray-300 rounded-md"
          />

          <label htmlFor="password" className="self-start">
            Password{" "}
          </label>
          <input
            type="password"
            placeholder="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="password-input p-2 border border-gray-300 rounded-md"
          />

          <button
            type="submit"
            className="signin text-white p-2 rounded-md hover:bg-green-700"
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
