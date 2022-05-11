/// <reference types="next" />
/// <reference types="next/image-types/global" />

interface Window {
  ethereum: any;
}

interface TxContext {
  connectWallet: (metamask?: Window.ethereum) => Promise<void>;
  currentAccount: string;
  currentBalance: string;
  ethPrice: string;
}

type GraphProps = {
  balanceData: any;
};

type Transaction = {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  price: string;
};

type Transactions = Transaction[];

interface GraphData {
  labels: string[];
  data: Data;
}

interface Data {
  in: string[];
  out: string[];
}
