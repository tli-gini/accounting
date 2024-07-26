// src/types/types.ts
export interface Transaction {
  id: number;
  item: string;
  amount: number;
  date: string;
  type: "income" | "expense";
}
