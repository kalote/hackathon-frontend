import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

export const TransactionContext = React.createContext<TxContext | null>(null);

let eth: any;

if (typeof window !== "undefined") {
  eth = window.ethereum;
}

export const TransactionProvider: React.FC<React.ReactNode> = ({
  children,
}) => {
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [currentBalance, setCurrentBalance] = useState<string>("");
  const [ethPrice, setEthPrice] = useState<string>("");

  useEffect(() => {
    checkIfWalletIsConnected();
    getEthPrice();
  }, [currentAccount, ethPrice]);

  const getEthPrice = async () => {
    // get eth price
    const etherscan = new ethers.providers.EtherscanProvider(
      undefined,
      process.env.ETHERSCAN_KEY
    );
    const ethPrice = await etherscan.getEtherPrice();
    setEthPrice(ethPrice.toString());
    console.log(ethPrice);
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

        // get account balance
        const provider = new ethers.providers.Web3Provider(metamask);
        const bal = await provider.getBalance(currentAccount);

        setCurrentBalance(ethers.utils.formatEther(bal));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        currentAccount,
        currentBalance,
        connectWallet,
        ethPrice,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
