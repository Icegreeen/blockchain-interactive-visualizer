"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { Block, Node, Propagation, Transaction } from '../types';
import { createTransaction, generateAutoTransaction } from '../utils/blockchain';

interface UseBlockchainReturn {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  propagations: Propagation[];
  setPropagations: React.Dispatch<React.SetStateAction<Propagation[]>>;
  blockCounter: number;
  setBlockCounter: React.Dispatch<React.SetStateAction<number>>;
  selectedNode: string;
  setSelectedNode: React.Dispatch<React.SetStateAction<string>>;
  transactionPool: Transaction[];
  setTransactionPool: React.Dispatch<React.SetStateAction<Transaction[]>>;
  networkActivity: boolean;
  setNetworkActivity: React.Dispatch<React.SetStateAction<boolean>>;
  autoTransactions: boolean;
  setAutoTransactions: React.Dispatch<React.SetStateAction<boolean>>;
  addTransactionToPool: (from: string, to: string, amount: number, currency: string) => void;
}

function createInitialNodes(): Node[] {
  const positions = [
    { id: 'A', x: 150, y: 90 },   // top-left
    { id: 'B', x: 580, y: 90 },  // top-right slightly offset
    { id: 'C', x: 230, y: 340 },  // bottom-left
    { id: 'D', x: 480, y: 340 }, // bottom-right slightly offset
    { id: 'E', x: 360, y: 160 }, // center
  ];

  const genesisBlock: Block = {
    id: 0,
    hash: 'genesis',
    previousHash: 'none',
    timestamp: Date.now(),
    transactions: [],
    nonce: 0,
    merkleRoot: 'genesis',
  };

  return positions.map((p) => ({
    id: p.id,
    x: p.x,
    y: p.y,
    blocks: [genesisBlock],
    isActive: false,
    isMining: false,
    blocksMined: 0,
  }));
}

export function useBlockchain(): UseBlockchainReturn {
  const [nodes, setNodes] = useState<Node[]>(() => createInitialNodes());
  const [propagations, setPropagations] = useState<Propagation[]>([]);
  const [blockCounter, setBlockCounter] = useState<number>(0);
  const [selectedNode, setSelectedNode] = useState<string>('A');
  const [transactionPool, setTransactionPool] = useState<Transaction[]>([]);
  const [networkActivity, setNetworkActivity] = useState<boolean>(true);
  const [autoTransactions, setAutoTransactions] = useState<boolean>(false);

  const autoTxTimerRef = useRef<NodeJS.Timeout | null>(null);

  const addTransactionToPool = (from: string, to: string, amount: number, currency: string) => {
    const tx = createTransaction(from, to, amount, currency);
    setTransactionPool((prev) => [...prev, tx]);
  };

  useEffect(() => {
    if (!autoTransactions) {
      if (autoTxTimerRef.current) {
        clearInterval(autoTxTimerRef.current as unknown as number);
        autoTxTimerRef.current = null;
      }
      return;
    }

    autoTxTimerRef.current = setInterval(() => {
      setTransactionPool((prev) => [...prev, generateAutoTransaction()]);
    }, 3000);

    return () => {
      if (autoTxTimerRef.current) {
        clearInterval(autoTxTimerRef.current as unknown as number);
        autoTxTimerRef.current = null;
      }
    };
  }, [autoTransactions]);

  const value = useMemo<UseBlockchainReturn>(() => ({
    nodes,
    setNodes,
    propagations,
    setPropagations,
    blockCounter,
    setBlockCounter,
    selectedNode,
    setSelectedNode,
    transactionPool,
    setTransactionPool,
    networkActivity,
    setNetworkActivity,
    autoTransactions,
    setAutoTransactions,
    addTransactionToPool,
  }), [
    nodes,
    propagations,
    blockCounter,
    selectedNode,
    transactionPool,
    networkActivity,
    autoTransactions,
  ]);

  return value;
}

export default useBlockchain;
