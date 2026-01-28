"use client";
import React, { useState } from "react";
import signUp from "@/firebase/auth/signup";
import signin from "@/firebase/auth/signin";
import { useRouter } from "next/navigation";
import "./loginSignup.css";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { useAuthContext } from "@/context/AuthContext";

const LoginSignup = () => {
  const [action, setAction] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { loading } = useAuthContext();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (action === "Sign Up") {
      // --- Sign Up Logic (New User) ---
      const { result, error } = await signUp(email, password);

      if (result) {
        console.log("Sign up success:", result);
        // Auto-login logic: save email to session immediately
        sessionStorage.setItem("email", email);

        // Redirect to Settings to setup 2FA
        router.push("/settings");
      } else {
        console.log(error);
        setError("Failed to sign up. Please try again.");
      }
    } else if (action === "Login") {
      // --- Login Logic (Returning User) ---
      const { result, error } = await signin(email, password);

      if (result) {
        console.log("Login success:", result);
        sessionStorage.setItem("email", email);

        if (!loading) {
          // Redirect to 2FA Verification page
          router.push("/verify-2fa");
        }
      } else {
        setError("Failed to login. Please check your email or password.");
        console.log(error);
      }
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">My Expense Tracker</div>
        <div className="underline"></div>
      </div>

      <div className="inputs">
        <div className="switch-container">
          <div
            className={action === "Login" ? "switch gray" : "switch"}
            onClick={() => {
              setAction("Sign Up");
              setError("");
              setSuccess("");
            }}
          >
            Sign Up
          </div>
          <div
            className={action === "Sign Up" ? "switch gray" : "switch"}
            onClick={() => {
              setAction("Login");
              setError("");
              setSuccess("");
            }}
          >
            Login
          </div>
        </div>
        <div className="input">
          <MdEmail
            color="cornflowerblue"
            style={{
              paddingLeft: "10px",
              width: "36px",
              height: "36px",
            }}
          />
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input">
          <FaLock
            color="cornflowerblue"
            style={{
              paddingLeft: "12px",
              width: "30px",
              height: "30px",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}
        <div className="button-div">
          <button className="button-to-accounting" onClick={handleSubmit}>
            {action === "Sign Up" ? "Sign Up" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
