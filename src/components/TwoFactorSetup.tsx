"use client";

import React, { useState } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";

// ⚠️ Note: Ensure your Rust server is running on this URL
const RUST_SERVER_URL = "http://localhost:3000";

interface TwoFactorSetupProps {
  username: string;
}

export default function TwoFactorSetup({ username }: TwoFactorSetupProps) {
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(
        `Connecting to Rust server at ${RUST_SERVER_URL} for registration...`
      );

      // 1. Call Backend API
      const response = await axios.post(`${RUST_SERVER_URL}/register`, {
        user_id: username,
      });

      // 2. Format data for the Mobile App
      const appPayload = {
        user_id: username,
        credential: response.data.credential,
      };

      // 3. Convert to string for QR Code
      setQrData(JSON.stringify(appPayload));
    } catch (err: any) {
      console.error("Registration failed:", err);
      setError(
        "Connection failed. Please check if the Rust Server is running on port 3000."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "24px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        maxWidth: "400px",
        margin: "20px auto",
      }}
    >
      <h2
        style={{
          color: "#333",
          marginBottom: "16px",
          fontSize: "1.25rem",
          fontWeight: "bold",
        }}
      >
        2FA - Two-Factor Authentication
      </h2>

      {!qrData ? (
        <div>
          <p style={{ color: "#666", marginBottom: "20px", lineHeight: "1.5" }}>
            Secure your account by enabling pPRG-based 2FA. Click the button
            below to generate your setup key.
          </p>
          <button
            onClick={handleRegister}
            disabled={loading}
            style={{
              padding: "12px 24px",
              background: loading ? "#ccc" : "#4a90e2",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "600",
              width: "100%",
              transition: "background 0.2s",
            }}
          >
            {loading ? "Connecting..." : "Enable 2FA"}
          </button>
          {error && (
            <div
              style={{
                marginTop: "16px",
                padding: "10px",
                background: "#fee2e2",
                color: "#dc2626",
                borderRadius: "6px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#dcfce7",
              color: "#166534",
              padding: "10px 20px",
              borderRadius: "6px",
              marginBottom: "20px",
              width: "100%",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            ✅ Registration Successful!
          </div>

          <p style={{ fontSize: "14px", color: "#555", marginBottom: "12px" }}>
            Scan this QR code with your Authenticator App:
          </p>

          <div
            style={{
              padding: "16px",
              border: "4px solid #1f2937",
              borderRadius: "12px",
              background: "white",
            }}
          >
            <QRCodeSVG value={qrData} size={200} />
          </div>

          <p
            style={{
              marginTop: "16px",
              fontSize: "12px",
              color: "#9ca3af",
              fontFamily: "monospace",
            }}
          >
            User ID: {username}
          </p>

          <button
            onClick={() => setQrData(null)}
            style={{
              marginTop: "24px",
              color: "#6b7280",
              background: "none",
              border: "none",
              textDecoration: "underline",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Close / Reset
          </button>
        </div>
      )}
    </div>
  );
}
