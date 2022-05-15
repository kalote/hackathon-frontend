import React, {
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { RiSettings3Fill } from "react-icons/ri";
import Graph from "./Graph";
import { TransactionContext } from "../context/transactionContext";
import { ethers } from "ethers";

const styles = {
  wrapper: `w-screen flex items-center justify-center`,
  wrapperText: `w-screen flex items-center justify-center mb-5 mt-10`,
  titleContainer: `w-[30rem] md:w-[40rem] lg:w-[60rem] flex items-center justify-start`,
  titleText: `text-xl text-left border-b-2 border-dashed border-[#2E2F30] py-1`,
  content: `bg-[#212122] w-[30rem] md:w-[40rem] lg:w-[60rem] rounded-lg p-4`,
  relative: `relative`,
  overlay: `z-10 absolute top-0 left-0 bg-[#000] w-full h-full flex justify-center items-center`,
  opacity: `opacity-75`,
  textInOverlay: `text-white font-bold text-2xl`,
  formHeader: `mb-5 flex items-center justify-between font-semibold text-xl`,
  transferPropContainer: `bg-[#20242A] my-3 rounded-2xl p-4 text-3xl border border-[#20242A] hover:border-[#41444F] flex justify-between`,
  transferPropInput: `bg-transparent placeholder:text-[#B2B9D2] outline-none mb-2 w-full text-2xl`,
  currencySelector: `flex w-1/4`,
  currencySelectorContent: `w-full h-min flex justify-between items-center bg-[#2D2F36] hover:bg-[#41444F] rounded-2xl text-xl font-medium cursor-pointer p-2 mt-[-0.2rem]`,
  currencySelectorIcon: `flex items-center`,
  currencySelectorTicker: `mx-2`,
  currencySelectorArrow: `text-lg`,
  confirmButton: `bg-[#2172E5] my-2 rounded-2xl py-4 px-8 text-xl font-semibold flex items-center justify-center cursor-pointer border border-[#2172E5] hover:border-[#234169]`,
};

const Main = () => {
  const [balanceData, setBalanceData] = useState<GraphData | undefined>(
    undefined
  );
  const [currentBalanceInEth, setCurrentBalanceInEth] = useState<
    string | undefined
  >(undefined);
  const [currentBalanceInDollar, setCurrentBalanceInDollar] = useState<
    string | undefined
  >(undefined);

  const overlayRef = useRef() as MutableRefObject<HTMLDivElement>;

  const {
    currentAccount,
    ethPrice,
    eth: ethProvider,
  } = useContext(TransactionContext) as TxContext;

  // Get Current account balance in ETH
  useEffect(() => {
    if (!currentAccount) return;
    !(async () => {
      // get account balance
      const provider = new ethers.providers.Web3Provider(ethProvider);
      const bal = await provider.getBalance(currentAccount);

      setCurrentBalanceInEth(ethers.utils.formatEther(bal));
    })();
  }, [currentAccount]);

  // Calculate account balance in dollar based on ethPrice + current balance in ETH
  useEffect(() => {
    if (!currentBalanceInEth || !ethPrice) return;
    const balInDollar = (parseFloat(currentBalanceInEth) * parseFloat(ethPrice))
      .toFixed(2)
      .toString();
    setCurrentBalanceInDollar(balInDollar);
  }, [currentBalanceInEth, ethPrice]);

  // Remove overlay since we have an account connected
  useEffect(() => {
    if (currentAccount) {
      overlayRef.current.remove();
    }
  }, [currentAccount]);

  // get tx data for the connected account
  useEffect(() => {
    if (!currentAccount) return;
    !(async () => {
      const URL = `http://134.122.118.59:4000/transactions/${currentAccount}`;
      const res = await fetch(URL);
      const data: Transactions = await res.json();
      transformData(data);
    })();
  }, [currentAccount]);

  // utility to calculate price in a human readable way
  const getValueUSD = (price: string, value: string): string => {
    return ((parseInt(price) / 1e18) * (parseInt(value) / 1e18)).toString();
  };

  // transform data for chart.js format
  const transformData = (data: Transactions) => {
    let transformed: GraphData = {
      labels: [],
      data: {
        in: [],
        out: [],
      },
    };

    data.map((tx: Transaction) => {
      transformed.labels.push(tx.blockNumber);
      if (tx.to === currentAccount) {
        transformed.data.in.push(getValueUSD(tx.price, tx.value));
        transformed.data.out.push("");
      } else if (tx.from === currentAccount) {
        transformed.data.out.push(getValueUSD(tx.price, tx.value));
        transformed.data.in.push("");
      }
    });
    setBalanceData(transformed);
  };

  return (
    <>
      <div className={styles.wrapperText}>
        <div className={styles.titleContainer}>
          <p className={styles.titleText}>Portfolio</p>
        </div>
      </div>
      <div className={styles.wrapper}>
        <div className={`${styles.content} ${styles.relative}`}>
          <div
            className={`${styles.content} ${styles.overlay} ${styles.opacity}`}
            ref={overlayRef}
          >
            <div className={styles.textInOverlay}>Connect your account</div>
          </div>
          <div className={styles.formHeader}>
            <div>
              $ {currentBalanceInDollar ? currentBalanceInDollar : "1,926.20"}
            </div>
            <div>
              <RiSettings3Fill />
            </div>
          </div>
          <Graph balanceData={balanceData} />
        </div>
      </div>
    </>
  );
};

export default Main;
