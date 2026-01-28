"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TwoFactorSetup from "@/components/TwoFactorSetup";

export default function SettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    // Retrieve email from sessionStorage (set in loginSignup.tsx)
    const storedEmail = sessionStorage.getItem("email");

    if (!storedEmail) {
      // Redirect to login if session is missing
      router.push("/");
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  // Loading state while checking session
  if (!email)
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
        Loading...
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "800",
            color: "#111827",
            marginBottom: "24px",
          }}
        >
          Account Settings
        </h1>

        <div
          style={{
            background: "white",
            padding: "20px 24px",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginBottom: "24px",
          }}
        >
          <p style={{ color: "#4b5563", fontSize: "16px" }}>
            Current User: <strong style={{ color: "#2563eb" }}>{email}</strong>
          </p>
        </div>

        {/* 2FA Setup Component */}
        <TwoFactorSetup username={email} />

        <button
          onClick={() => router.push("/accounting")}
          style={{
            marginTop: "32px",
            background: "none",
            border: "none",
            color: "#6b7280",
            cursor: "pointer",
            fontSize: "15px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span>←</span> Back to Accounting
        </button>
      </div>
    </div>
  );
}
