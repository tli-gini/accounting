"use client";
import React from "react";
import "./Balance.css";

interface BalanceProps {
  balance: number;
  income: number;
  expense: number;
}

const Balance: React.FC<BalanceProps> = ({ balance, income, expense }) => {
  return (
    <section id="total-sec">
      <div className="box-container" id="income-box">
        <div className="box-name" id="income-label">
          Income
        </div>
        <div className="box-value" id="income">
          ${income}
        </div>
      </div>
      <div className="box-container" id="expense-box">
        <div className="box-name" id="expense-label">
          Expense
        </div>
        <div className="box-value" id="expense">
          ${expense * -1}
        </div>
      </div>
      <div className="box-container" id="balance-box">
        <div className="box-name" id="balance-label">
          Total Balance
        </div>
        <div className="box-value" id="balance">
          ${balance}
        </div>
      </div>
    </section>
  );
};

export default Balance;
