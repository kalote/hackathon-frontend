import React, { useState, useEffect } from "react";

export const TransactionContext = React.createContext<TxContext | null>(null);

let eth: any;

if (typeof window !== "undefined") {
  eth = window.ethereum;
}

export const TransactionProvider: React.FC<React.ReactNode> = ({
  children,
}) => {
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [ethPrice, setEthPrice] = useState<string>("");

  useEffect(() => {
    getEthPrice();
  }, []);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [currentAccount]);

  const getEthPrice = async () => {
    const URL = `http://134.122.118.59:4000/price/latest`;
    const res = await fetch(URL);
    const data = await res.json();
    const price = (parseInt(data?.price) / 1e18).toString();
    setEthPrice(price);
  };

  const connectWallet = async (metamask = eth): Promise<void> => {
    try {
      if (!metamask) return alert("install MetaMask!");
      const accounts = await metamask.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      // connection refused by user
      console.error(error);
    }
  };

  const checkIfWalletIsConnected = async (metamask = eth): Promise<void> => {
    try {
      if (!metamask) return alert("install MetaMask!");
      const accounts = await metamask.request({ method: "eth_accounts" });
      if (accounts.length) {
        // account connected
        setCurrentAccount(accounts[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        currentAccount,
        connectWallet,
        ethPrice,
        eth,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
