"use client";
import React from "react";
import "./List.css";
import { Transaction } from "../types/types";

interface ListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void; // Updated to string
}

const List: React.FC<ListProps> = ({ transactions, onDelete }) => {
  return (
    <ul className="ul-box">
      {transactions.map((transaction) => (
        <li key={transaction.id} className="list-box">
          <div className="list-item">{transaction.date}</div>
          <div className="list-item">{transaction.item}</div>
          <div className={transaction.type}>
            {transaction.amount * (transaction.type === "income" ? 1 : -1)}
          </div>
          <button
            className="delete-btn"
            onClick={() => onDelete(transaction.id)}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};

export default List;
