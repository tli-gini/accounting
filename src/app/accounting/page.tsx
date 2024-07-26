"use client";
import React, { useState } from "react";
import "./page.css";
import Form from "../components/Form";
import List from "../components/List";
import Balance from "../components/Balance";
import { Transaction } from "../types/types";
import Link from "next/link";

const AccountingPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions((prevTransactions) => [...prevTransactions, transaction]);
  };

  const handleDeleteTransaction = (id: number) => {
    setTransactions((prevTransactions) =>
      prevTransactions.filter((t) => t.id !== id)
    );
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
      <h1 className="title">- Track My Spending -</h1>
      <div className="wrapper">
        <Form onAddTransaction={handleAddTransaction} />
        <List transactions={transactions} onDelete={handleDeleteTransaction} />
      </div>
      <Balance
        balance={totalBalance}
        income={totalIncome}
        expense={totalExpense}
      />
      <div className="btn-to-home-div">
        <Link className="btn-to-home" href="/">
          Back to HomePage
        </Link>
      </div>
    </main>
  );
};

export default AccountingPage;
