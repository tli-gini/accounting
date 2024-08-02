"use client";
import React, { useState, FormEvent } from "react";
import "./Form.css";
import { Transaction } from "../types/types";

interface FormProps {
  onAddTransaction: (transaction: Transaction) => void;
}

const Form: React.FC<FormProps> = ({ onAddTransaction }) => {
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onAddTransaction({
      id: Date.now().toString(), // id to string
      item,
      amount: parseInt(amount, 10),
      date,
      type,
    });

    // Reset form
    setItem("");
    setAmount("");
    setDate("");
    setType("income");
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-box">
        <select
          className="selector"
          value={type}
          style={{
            width: "150px",
            height: "40px",
            color: "#3b578c",
            borderRadius: "5px",
            padding: "5px 10px",
            marginTop: "18px",
          }}
          onChange={(e) => setType(e.target.value as "income" | "expense")}
        >
          <option className="income-btn" value="income">
            Income
          </option>
          <option className="expense-btn" value="expense">
            Expense
          </option>
        </select>
      </div>

      <div className="form-box">
        <label htmlFor="date">DATE</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="form-box">
        <label htmlFor="amount">AMOUNT</label>
        <input
          type="number"
          id="amount"
          value={amount}
          placeholder="$"
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div className="form-box">
        <label htmlFor="item">ITEM</label>
        <input
          type="text"
          id="item"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          required
        />
      </div>
      <div className="form-box">
        <button type="submit">Add</button>
      </div>
    </form>
  );
};

export default Form;
