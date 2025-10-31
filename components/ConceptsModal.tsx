import React from 'react';
import { motion } from 'framer-motion';

interface ConceptsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConceptsModal: React.FC<ConceptsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        className="bg-white rounded-lg p-8 max-w-4xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">📚 Core Blockchain Concepts</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
            <h3 className="text-xl font-bold text-blue-800 mb-3">🔗 What is a Block?</h3>
            <p className="text-blue-700 mb-3">A block is the fundamental unit of a blockchain, a container that stores and organizes transactions chronologically and immutably.</p>
            <div className="bg-white p-4 rounded border">
              <h4 className="font-semibold text-blue-800 mb-2">Technical Structure:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li><strong>Header:</strong> Block metadata (previous hash, timestamp, nonce)</li>
                <li><strong>Merkle Root:</strong> Hash representing all block transactions</li>
                <li><strong>Body:</strong> List of validated transactions</li>
                <li><strong>Block Hash:</strong> Unique cryptographic identifier</li>
              </ul>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
            <h3 className="text-xl font-bold text-green-800 mb-3">🔐 Cryptography and Hash Functions</h3>
            <p className="text-green-700 mb-3">Cryptography is the heart of blockchain security. Hash functions map arbitrary data to a fixed-size output.</p>
            <div className="bg-white p-4 rounded border">
              <h4 className="font-semibold text-green-800 mb-2">Hash Function Properties:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li><strong>Deterministic:</strong> Same input yields same output</li>
                <li><strong>One-way:</strong> Infeasible to recover input from hash</li>
                <li><strong>Avalanche Effect:</strong> Small input change causes large output change</li>
                <li><strong>Uniformity:</strong> Even distribution of outputs</li>
              </ul>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
            <h3 className="text-xl font-bold text-purple-800 mb-3">⛏️ Mining and Proof of Work</h3>
            <p className="text-purple-700 mb-3">Mining validates transactions and creates new blocks via computational proof of work, securing and decentralizing the network.</p>
            <div className="bg-white p-4 rounded border">
              <h4 className="font-semibold text-purple-800 mb-2">Mining Process:</h4>
              <ol className="text-sm text-purple-700 space-y-1">
                <li><strong>1. Gather Transactions:</strong> Miner collects pending transactions</li>
                <li><strong>2. Build Block:</strong> Organizes transactions into a block</li>
                <li><strong>3. Find Nonce:</strong> Iterates values until a valid hash</li>
                <li><strong>4. Propagate:</strong> Broadcasts the valid block</li>
                <li><strong>5. Validate:</strong> Other nodes verify and add to the chain</li>
              </ol>
            </div>
          </div>

          <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500">
            <h3 className="text-xl font-bold text-orange-800 mb-3">🌐 Decentralized Architecture</h3>
            <p className="text-orange-700 mb-3">Blockchain runs on a peer-to-peer network where each node keeps a complete copy of the ledger, avoiding single points of failure and resisting censorship.</p>
            <div className="bg-white p-4 rounded border">
              <h4 className="font-semibold text-orange-800 mb-2">Advantages:</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                <li><strong>Failure Resistance:</strong> Works even with nodes offline</li>
                <li><strong>No Single Controller:</strong> No central authority</li>
                <li><strong>Transparency:</strong> Public, verifiable transactions</li>
                <li><strong>Censorship Resistance:</strong> Hard to block or modify transactions</li>
              </ul>
            </div>
          </div>

          <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
            <h3 className="text-xl font-bold text-red-800 mb-3">🛡️ Security and Consensus</h3>
            <p className="text-red-700 mb-3">Consensus mechanisms let the network agree on the valid ledger state, even with malicious participants.</p>
            <div className="bg-white p-4 rounded border">
              <h4 className="font-semibold text-red-800 mb-2">Consensus Types:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li><strong>Proof of Work (PoW):</strong> Bitcoin</li>
                <li><strong>Proof of Stake (PoS):</strong> Ethereum</li>
                <li><strong>Delegated Proof of Stake (DPoS):</strong> EOS</li>
                <li><strong>Practical Byzantine Fault Tolerance (PBFT):</strong> Hyperledger</li>
              </ul>
            </div>
          </div>

          <div className="bg-cyan-50 p-6 rounded-lg border-l-4 border-cyan-500">
            <h3 className="text-xl font-bold text-cyan-800 mb-3">💰 Transaction Flow</h3>
            <p className="text-cyan-700 mb-3">Transactions go through several steps before being permanently recorded on-chain.</p>
            <div className="bg-white p-4 rounded border">
              <h4 className="font-semibold text-cyan-800 mb-2">Complete Process:</h4>
              <ol className="text-sm text-cyan-700 space-y-1">
                <li><strong>1. Create:</strong> User creates a transaction</li>
                <li><strong>2. Mempool:</strong> Transaction waits to be included</li>
                <li><strong>3. Select:</strong> Miner picks transactions</li>
                <li><strong>4. Mine:</strong> Transactions included in a new block</li>
                <li><strong>5. Propagate:</strong> Block is broadcast to the network</li>
                <li><strong>6. Validate:</strong> Peers verify and append</li>
                <li><strong>7. Confirm:</strong> Transaction becomes final</li>
              </ol>
            </div>
          </div>

          <div className="bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-500">
            <h3 className="text-xl font-bold text-indigo-800 mb-3">🔒 Immutability</h3>
            <p className="text-indigo-700 mb-3">Immutability ensures data cannot be changed without invalidating subsequent blocks.</p>
            <div className="bg-white p-4 rounded border">
              <h4 className="font-semibold text-indigo-800 mb-2">How It’s Ensured:</h4>
              <ul className="text-sm text-indigo-700 space-y-1">
                <li><strong>Chaining:</strong> Each block references the previous hash</li>
                <li><strong>Recalculation Cost:</strong> Changing one block requires recomputing the rest</li>
                <li><strong>Distribution:</strong> Multiple copies prevent central tampering</li>
                <li><strong>Economic Cost:</strong> Mining makes edits infeasible</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Got it! Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConceptsModal;

