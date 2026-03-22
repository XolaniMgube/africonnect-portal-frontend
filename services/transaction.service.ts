import { Transaction } from "@/types/models";

let transactions: Transaction[] = [];

export const createTransaction = async (
  transaction: Transaction
): Promise<Transaction> => {
  transactions.push(transaction);
  return transaction;
};

export const getTransactions = async (): Promise<Transaction[]> => {
  return transactions;
};