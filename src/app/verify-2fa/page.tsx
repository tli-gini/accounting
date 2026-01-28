"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const RUST_SERVER_URL = "http://localhost:3000";

export default function Verify2FAPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(""); // Stores the formatted string (e.g. "123 456")
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    if (!storedEmail) {
      router.push("/");
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  // ✨ Magic happens here: Auto-format input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 1. Get only numbers from input
    const rawValue = e.target.value.replace(/\D/g, "");

    // 2. Prevent entering more than 6 digits
    if (rawValue.length > 6) return;

    // 3. Add space after the 3rd digit
    let formattedValue = rawValue;
    if (rawValue.length > 3) {
      formattedValue = `${rawValue.slice(0, 3)} ${rawValue.slice(3)}`;
    }

    setOtp(formattedValue);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 🧹 Clean data: Remove the space before sending to backend
      const rawOtp = otp.replace(/\s/g, "");
      const now = Math.floor(Date.now() / 1000);

      console.log("Sending verification:", {
        user_id: email,
        otp: Number(rawOtp),
        t: now,
      });

      await axios.post(`${RUST_SERVER_URL}/verify`, {
        user_id: email,
        otp: Number(rawOtp), // Backend expects a number
        t: now,
      });

      // Success
      router.push("/accounting");
    } catch (err: any) {
      console.error("Verify Error:", err);
      setError("Verification failed. The code may be invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f3f4f6",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            marginBottom: "12px",
            color: "#111827",
            fontWeight: "bold",
            fontSize: "24px",
          }}
        >
          Security Verification
        </h2>
        <p
          style={{
            marginBottom: "32px",
            color: "#6b7280",
            fontSize: "14px",
            lineHeight: "1.5",
          }}
        >
          Please enter the 6-digit code from your authenticator app.
        </p>

        <form onSubmit={handleVerify}>
          <input
            type="text"
            // We removed maxLength here because the space adds 1 extra character length
            value={otp}
            onChange={handleChange}
            placeholder="000 000"
            style={{
              width: "100%",
              padding: "16px",
              fontSize: "28px",
              textAlign: "center",
              // Monospace font ensures numbers and spaces align perfectly
              fontFamily: '"Courier New", Courier, monospace',
              letterSpacing: "4px",
              marginBottom: "24px",
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              outline: "none",
              fontWeight: "bold",
              color: "#374151",
              backgroundColor: "#f9fafb",
            }}
          />

          {error && (
            <div
              style={{
                color: "#ef4444",
                marginBottom: "20px",
                fontSize: "14px",
                background: "#fee2e2",
                padding: "8px",
                borderRadius: "6px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            // Check raw length (without space) is 6
            disabled={loading || otp.replace(" ", "").length !== 6}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "#9ca3af" : "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "600",
              transition: "background 0.2s",
            }}
          >
            {loading ? "Verifying..." : "Confirm"}
          </button>
        </form>

        <div
          style={{
            marginTop: "24px",
            fontSize: "12px",
            color: "#9ca3af",
            fontFamily: "monospace",
          }}
        >
          User: {email}
        </div>
      </div>
    </div>
  );
}
