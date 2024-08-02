export interface Transaction {
  id: string; // Changed from number to string
  item: string;
  amount: number;
  date: string;
  type: "income" | "expense";
}
