import React, { useEffect, useState, useContext } from "react";
import Image from "next/image";
import { GoSearch } from "react-icons/go";
import logoRe from "../assets/logoRe.png";
import { TransactionContext } from "../context/transactionContext";

const styles = {
  wrapper: `p-4 bg-[#212122] w-screen flex justify-between items-center`,
  headerLogo: `flex w-1/3 items-center justify-start`,
  nav: `flex-1 flex justify-center items-center`,
  navItemsContainer: `flex bg-[#191B1F] rounded-3xl`,
  navItem: `px-4 py-2 m-1 flex items-center text-lg font-semibold text-[0.9rem] cursor-pointer rounded-3xl`,
  activeItem: `bg-[#20242A]`,
  buttonContainer: `flex w-1/3 items-center justify-end`,
  button: `flex items-center bg-[#191B1F] rounded-lg mx-2 font-semibold text-[0.9rem] cursor-pointer`,
  buttonPadding: `p-2`,
  buttonTextContainer: `h-8 flex items-center`,
  buttonIconContainer: `flex items-center justify-center w-8 h-8`,
  buttonAccent: `bg-[#172A42] border border-[#163256] hover:border-[#234169] h-full rounded-lg flex items-center justify-center text-[#4F90EA]`,
};

const Header = () => {
  const [selectedNav, setSelectedNav] = useState("dashboard");
  const [username, setUsername] = useState<string>("");
  const { connectWallet, currentAccount } = useContext(
    TransactionContext
  ) as TxContext;

  useEffect(() => {
    if (!currentAccount) return;
    setUsername(
      `${currentAccount.substring(0, 6)} ... ${currentAccount.slice(-5)}`
    );
  }, [currentAccount]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerLogo}>
        {/* <Image src={logoRe} alt="myethdashboard" height={43} width={226} /> */}
        <Image src={logoRe} alt="myethdashboard" height={60} width={330} />
      </div>
      <div className={styles.nav}>
        <div className={styles.navItemsContainer}>
          <div
            onClick={() => setSelectedNav("dashboard")}
            className={`${styles.navItem} ${
              selectedNav === "dashboard" && styles.activeItem
            }`}
          >
            Dashboard
          </div>
          <div
            onClick={() => setSelectedNav("account")}
            className={`${styles.navItem} ${
              selectedNav === "account" && styles.activeItem
            }`}
          >
            Account
          </div>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        {currentAccount ? (
          <div className={`${styles.button} ${styles.buttonPadding}`}>
            <div className={styles.buttonTextContainer}>{username}</div>
          </div>
        ) : (
          <div
            onClick={() => connectWallet()}
            className={`${styles.button} ${styles.buttonPadding}`}
          >
            <div className={`${styles.buttonAccent} ${styles.buttonPadding}`}>
              Connect Wallet
            </div>
          </div>
        )}
        {!currentAccount && (
          <div className={`${styles.button} ${styles.buttonPadding}`}>
            <div className={`${styles.buttonIconContainer} mx-2`}>
              <GoSearch />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
