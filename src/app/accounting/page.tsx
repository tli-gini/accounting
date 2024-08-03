"use client";
import React, { useState, useEffect } from "react";
import "./page.css";
import Form from "../../components/Form";
import List from "../../components/List";
import Balance from "../../components/Balance";
import { Transaction } from "../../types/types";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { getAuth } from "firebase/auth";
import getDocuments from "../../firebase/firestore/getData";
import addData from "../../firebase/firestore/addData";
import deleteData from "../../firebase/firestore/deleteData";

const AccountingPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();
  const { user, loading } = useAuthContext();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) {
        console.log("User not authenticated, redirecting to home");
        router.push("/");
        return;
      }

      const storedEmail = sessionStorage.getItem("email");
      setEmail(storedEmail);

      if (storedEmail) {
        const { result, error } = await getDocuments(
          "transactions",
          storedEmail
        );
        if (result) {
          setTransactions(result);
        } else {
          console.error("Failed to fetch transactions:", error);
        }
      }
    };

    if (!loading && user) {
      fetchTransactions();
    }
  }, [user, loading, router]);

  // Handle user logout
  const logout = () => {
    const auth = getAuth();
    auth
      .signOut()
      .then(() => {
        console.log("User signed out.");
        sessionStorage.clear();
        router.push("/");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  // Ensure all hooks are called at the top level of your component
  if (loading || !user) {
    return <div className="loading">Loading...</div>; // Render a loading or placeholder element instead of null
  }

  const handleAddTransaction = async (transaction: Transaction) => {
    if (email) {
      const dataWithUserEmail = { ...transaction, email };
      const { result, error } = await addData(
        "transactions",
        dataWithUserEmail
      );
      if (result) {
        setTransactions((prevTransactions) => [
          ...prevTransactions,
          { ...transaction, id: result.id }, // Ensure id is string
        ]);
      } else {
        console.error("Failed to add transaction:", error);
      }
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    setIsDeleting(true);
    try {
      const { result, error } = await deleteData("transactions", id);
      if (result) {
        setTransactions((prevTransactions) =>
          prevTransactions.filter((t) => t.id !== id)
        );
      } else {
        console.error("Failed to delete transaction:", error);
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, record) => sum + record.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, record) => sum + record.amount, 0);
  const totalBalance = totalIncome - totalExpense;

  return (
    <main className="accounting-container">
      <h1 className="title">
        You have logged in using <span className="email-span">{email}</span>
      </h1>
      <div className="wrapper">
        <Form onAddTransaction={handleAddTransaction} />
        <List transactions={transactions} onDelete={handleDeleteTransaction} />
      </div>
      {isDeleting && <div className="loading">Deleting...</div>}
      <Balance
        balance={totalBalance}
        income={totalIncome}
        expense={totalExpense}
      />
      <div className="btn-to-home-div">
        <button className="btn-to-home" onClick={logout}>
          Log Out
        </button>
      </div>
    </main>
  );
};

export default AccountingPage;
