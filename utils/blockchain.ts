import { Transaction, Block } from '../types';

export const generateTransactions = (blockId: number): Transaction[] => {
  const participants = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
  const currencies = ['BTC', 'ETH', 'ADA', 'SOL'];
  const transactions: Transaction[] = [];
  
  const numTransactions = Math.floor(Math.random() * 3) + 1;
  
  for (let i = 0; i < numTransactions; i++) {
    const from = participants[Math.floor(Math.random() * participants.length)];
    let to = participants[Math.floor(Math.random() * participants.length)];
    while (to === from) {
      to = participants[Math.floor(Math.random() * participants.length)];
    }
    
    transactions.push({
      id: `tx_${blockId}_${i}_${Date.now()}`,
      from,
      to,
      amount: Math.floor(Math.random() * 100) + 1,
      currency: currencies[Math.floor(Math.random() * currencies.length)],
      timestamp: Date.now() + i * 1000,
      fee: Math.floor(Math.random() * 5) + 1
    });
  }
  
  return transactions;
};

export const generateAutoTransaction = (): Transaction => {
  const participants = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
  const currencies = ['BTC', 'ETH', 'ADA', 'SOL'];
  
  const from = participants[Math.floor(Math.random() * participants.length)];
  let to = participants[Math.floor(Math.random() * participants.length)];
  while (to === from) {
    to = participants[Math.floor(Math.random() * participants.length)];
  }
  
  return {
    id: `auto_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    from,
    to,
    amount: Math.floor(Math.random() * 50) + 1,
    currency: currencies[Math.floor(Math.random() * currencies.length)],
    timestamp: Date.now(),
    fee: Math.floor(Math.random() * 3) + 1
  };
};

export const createTransaction = (from: string, to: string, amount: number, currency: string): Transaction => {
  return {
    id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    from,
    to,
    amount,
    currency,
    timestamp: Date.now(),
    fee: Math.floor(Math.random() * 5) + 1
  };
};

export const calculateBlockHash = (previousHash: string, merkleRoot: string, nonce: number, blockId: number): string => {
  const hashInput = `${previousHash}${merkleRoot}${nonce}${blockId}`;
  return `hash_${btoa(hashInput).slice(0, 16)}`;
};

export const createNewBlock = (
  blockId: number,
  transactions: Transaction[],
  previousHash: string
): Block => {
  const merkleRoot = `merkle_${blockId}_${transactions.length}`;
  const nonce = Math.floor(Math.random() * 1000000);
  const hash = calculateBlockHash(previousHash, merkleRoot, nonce, blockId);
  
  return {
    id: blockId,
    hash,
    previousHash,
    timestamp: Date.now(),
    transactions,
    nonce,
    merkleRoot
  };
};

