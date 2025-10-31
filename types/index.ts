export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  currency: string;
  timestamp: number;
  fee: number;
}

export interface Block {
  id: number;
  hash: string;
  previousHash: string;
  timestamp: number;
  transactions: Transaction[];
  nonce: number;
  merkleRoot: string;
}

export interface Node {
  id: string;
  x: number;
  y: number;
  blocks: Block[];
  isActive: boolean;
  isMining: boolean;
  blocksMined: number;
}

export interface Propagation {
  id: string;
  fromNode: string;
  toNode: string;
  blockId: number;
  progress: number;
}

export interface TransactionFormData {
  from: string;
  to: string;
  amount: string;
  currency: string;
}

