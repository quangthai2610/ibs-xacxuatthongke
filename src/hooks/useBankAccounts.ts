"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  getBankAccounts, 
  addBankAccount as addBankAccountAction, 
  updateBankAccount as updateBankAccountAction, 
  deleteBankAccount as deleteBankAccountAction 
} from "@/app/actions/bank";

export interface SavedBankAccount {
  id: string;
  bin: string;
  shortName: string;
  accountNo: string;
  accountName: string;
  label?: string; // Optional friendly label, e.g., "Tài khoản của Hùng"
}

export function useBankAccounts() {
  const [accounts, setAccounts] = useState<SavedBankAccount[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchAccounts = useCallback(async () => {
    try {
      const data = await getBankAccounts();
      setAccounts(data);
    } catch (err) {
      console.error("Error loading bank accounts", err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Load from DB on mount
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const addAccount = async (account: Omit<SavedBankAccount, "id">) => {
    await addBankAccountAction(account);
    await fetchAccounts();
  };

  const updateAccount = async (id: string, updates: Partial<SavedBankAccount>) => {
    await updateBankAccountAction(id, updates);
    await fetchAccounts();
  };

  const deleteAccount = async (id: string) => {
    await deleteBankAccountAction(id);
    await fetchAccounts();
  };

  return {
    accounts,
    isLoaded,
    addAccount,
    updateAccount,
    deleteAccount,
    refreshAccounts: fetchAccounts,
  };
}
