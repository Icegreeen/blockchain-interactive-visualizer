'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Node, Block, Transaction } from '../types';
import { useBlockchain } from '../hooks/useBlockchain';

import { generateTransactions, createNewBlock } from '../utils/blockchain';
import NodeComponent from './NodeComponent';
import Connection from './Connection';
import TransactionForm from './TransactionForm';
import ConceptsModal from './ConceptsModal';

const BlockchainNetwork: React.FC = () => {
  const {
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
    addTransactionToPool
  } = useBlockchain();

  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [hoveredBlock, setHoveredBlock] = useState<Block | null>(null);
  const [propagationSpeed, setPropagationSpeed] = useState(1);
  const [showConceptsModal, setShowConceptsModal] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const getCurrencyStyles = (currency: string) => {
    switch (currency) {
      case 'BTC':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ETH':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'ADA':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SOL':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const createNewBlockHandler = useCallback(() => {
    const originNodeId = selectedNode || 'A';
    const newBlockId = blockCounter + 1;

    let transactions: Transaction[];
    if (transactionPool.length > 0) {
      const maxTransactions = Math.min(3, transactionPool.length);
      transactions = transactionPool.slice(0, maxTransactions);
      setTransactionPool(prev => prev.slice(maxTransactions));
    } else {
      transactions = generateTransactions(newBlockId);
    }
    
    const previousHash = (() => {
      const originNode = nodes.find(n => n.id === originNodeId);
      const lastBlock = originNode?.blocks[originNode.blocks.length - 1];
      return lastBlock?.hash || 'genesis';
    })();
    
    const newBlock = createNewBlock(newBlockId, transactions, previousHash);

    // Iniciar animação de mineração no nó de origem
    setNodes(prevNodes => 
      prevNodes.map(node => ({
        ...node,
        isMining: node.id === originNodeId,
        isActive: node.id === originNodeId
      }))
    );

    // Simular processo de mineração (2 segundos)
    setTimeout(() => {
      // Finalizar mineração e adicionar bloco
      setNodes(prevNodes => 
        prevNodes.map(node => ({
          ...node,
          blocks: node.id === originNodeId ? [...node.blocks, newBlock] : node.blocks,
          isMining: false,
          blocksMined: node.id === originNodeId ? node.blocksMined + 1 : node.blocksMined,
          isActive: false
        }))
      );

      setBlockCounter(newBlockId);

      // Simular propagação para outros nós
      const otherNodes = nodes.filter(node => node.id !== originNodeId);
      otherNodes.forEach((node, index) => {
        const propagation = {
          id: `prop_${newBlockId}_${node.id}`,
          fromNode: originNodeId,
          toNode: node.id,
          blockId: newBlockId,
          progress: 0,
        };

        setPropagations(prev => [...prev, propagation]);

        // Animar propagação com velocidade ajustável
        setTimeout(() => {
          setPropagations(prev => 
            prev.map(p => 
              p.id === propagation.id 
                ? { ...p, progress: 1 }
                : p
            )
          );

          // Ativar nó após propagação
          setTimeout(() => {
            setNodes(prevNodes =>
              prevNodes.map(n =>
                n.id === node.id ? { ...n, isActive: true, blocks: [...n.blocks, newBlock] } : n
              )
            );

            // Remover propagação após completar
            setTimeout(() => {
              setPropagations(prev => prev.filter(p => p.id !== propagation.id));
              setNodes(prevNodes =>
                prevNodes.map(n => ({ ...n, isActive: false }))
              );
            }, 1000 / propagationSpeed);
          }, 500 / propagationSpeed);
        }, (index * 200) / propagationSpeed);
      });
    }, 2000); 
  }, [nodes, blockCounter, selectedNode, propagationSpeed, transactionPool, setNodes, setBlockCounter, setTransactionPool, setPropagations]);

  return (
    <div className="w-full h-screen bg-gray-50 flex">
      <div className="w-[350px] bg-white border-r border-gray-200 p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Blockchain Network</h1>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => setShowTransactionForm(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
            >
              💰 Create Transaction
            </button>

            <button
              onClick={createNewBlockHandler}
              disabled={transactionPool.length === 0 || !!nodes.find(n => n.id === selectedNode)?.isMining}
              title={transactionPool.length === 0 ? 'Add transactions to the pool to mine a new block' : ''}
              className={`w-full py-2.5 px-4 rounded-lg font-semibold transition-colors ${
                transactionPool.length === 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } ${nodes.find(n => n.id === selectedNode)?.isMining ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              ⛏️ Create New Block{transactionPool.length > 0 ? ` (${Math.min(transactionPool.length, 3)} TX)` : ''}
            </button>

            <button
              onClick={() => setShowConceptsModal(true)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              📚 Core Concepts
            </button>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <h3 className="font-medium text-gray-700">Origin Node:</h3>
            <div className="grid grid-cols-5 gap-2">
              {['A', 'B', 'C', 'D', 'E'].map(nodeId => (
                <button
                  key={nodeId}
                  onClick={() => setSelectedNode(nodeId)}
                  className={`w-8 h-8 rounded-full text-sm font-bold transition-all ${
                    selectedNode === nodeId 
                      ? 'bg-yellow-400 text-yellow-900 ring-2 ring-yellow-500' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {nodeId}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Settings</h3>
            <div className="text-sm font-medium text-gray-700">Propagation Speed:</div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">1x</span>
              <input
                type="range"
                min="1"
                max="5"
                value={propagationSpeed}
                onChange={(e) => setPropagationSpeed(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-gray-500">5x</span>
            </div>
            <div className="text-xs text-gray-500 text-center">{propagationSpeed}x speed</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">Network Activity:</div>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={networkActivity}
                  onChange={(e) => setNetworkActivity(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-[#4e4e4e]">🌐 Network Pulse</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={autoTransactions}
                  onChange={(e) => setAutoTransactions(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-[#4e4e4e]">💰 Automatic Transactions</span>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-base">🔗</span>
                <h3 className="text-sm font-semibold text-blue-800">Block Counter</h3>
              </div>
              <span className="text-xs text-blue-700 bg-blue-100 border border-blue-200 rounded px-1.5 py-0.5">{nodes.reduce((total, node) => total + node.blocksMined, 0)} mined</span>
            </div>
            <div className="text-center">
              <div className="text-2xl text-center font-extrabold text-blue-600 leading-none">{blockCounter} <div className="text-xs text-gray-600 mt-1">Total blocks in the network</div></div>
            </div>
          </div>

          <div className="bg-green-50 p-3 rounded-md border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-base">💰</span>
                <h3 className="text-sm font-semibold text-green-800">Transaction Pool</h3>
              </div>
              <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full border border-green-200">{transactionPool.length} pending</span>
            </div>
            
            {transactionPool.length === 0 ? (
              <div className="text-center py-3">
                <div className="text-sm text-gray-500">No pending transactions</div>
                <div className="text-xs text-gray-400">Create a transaction to see the full flow</div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-xs text-green-700">💡 Next step: Click "Create New Block"</div>
                <div className="flex flex-wrap gap-2">
                  {transactionPool.slice(0, 3).map((tx) => (
                    <div
                      key={tx.id}
                      className={`inline-flex items-center gap-1.5 border rounded-full px-2.5 py-1 text-[11px] leading-none ${getCurrencyStyles(tx.currency)}`}
                    >
                      <span className="font-mono text-[10px] bg-white/50 rounded px-1 py-0.5 border border-white/60">{tx.id.split('_')[1]}</span>
                      <span className="font-medium">{tx.from}</span>
                      <span className="text-gray-400">→</span>
                      <span className="font-medium">{tx.to}</span>
                      <span className="ml-0.5 font-semibold">{tx.amount} {tx.currency}</span>
                    </div>
                  ))}
                  {transactionPool.length > 3 && (
                    <div className="inline-flex items-center px-2 py-1 text-[11px] rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                      +{transactionPool.length - 3}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="font-bold text-gray-800">Legend</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
              <span className="text-[#4e4e4e]">Network node</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
              <span className="text-[#4e4e4e]">Selected node</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-[#4e4e4e]">Active node (communicating)</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-blue-500 rounded"></div>
              <span className="text-[#4e4e4e]">Chain block</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-green-500 rounded"></div>
              <span className="text-[#4e4e4e]">New block</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-gray-400"></div>
              <span className="text-[#4e4e4e]">Connection between nodes</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-blue-400"></div>
              <span className="text-[#4e4e4e]">Active connection</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-green-400 border-dashed border-t-2"></div>
              <span className="text-[#4e4e4e]">Active propagation</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-400 rounded-full flex items-center justify-center">
                <span className="text-xs">⚙</span>
              </div>
              <span className="text-[#4e4e4e]">Active mining</span>
            </div>
          </div>
        </div>
      </div>

      
      <div className="flex-1 relative overflow-hidden">
        <svg
          ref={svgRef}
          className="w-full h-full"
          viewBox="0 0 800 460"
          preserveAspectRatio="xMidYMid meet"
        >
          {nodes.map((node, index) => {
            const connections = nodes.slice(index + 1).map(otherNode => (
              <Connection
                key={`${node.id}-${otherNode.id}`}
                from={{ x: node.x, y: node.y }}
                to={{ x: otherNode.x, y: otherNode.y }}
                isPropagating={propagations.some(p => 
                  (p.fromNode === node.id && p.toNode === otherNode.id) ||
                  (p.fromNode === otherNode.id && p.toNode === node.id)
                )}
                isActive={node.isActive || otherNode.isActive}
                isPulsing={networkActivity}
              />
            ));
            return connections;
          })}

          {nodes.map(node => (
            <NodeComponent
              key={node.id}
              node={node}
              onNodeHover={setHoveredNode}
              onBlockHover={setHoveredBlock}
              onNodeClick={setSelectedNode}
              isSelected={selectedNode === node.id}
            />
          ))}
        </svg>
      </div>

      <div className="w-96 bg-white border-l border-gray-200 p-6 flex flex-col">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Detailed Information</h2>
        
        {hoveredNode && (
          <div className="bg-white p-4 rounded-lg mb-4 border border-emerald-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-emerald-800 text-lg">Node {hoveredNode.id}</h3>
              <div className="flex gap-2">
                <span className={`px-2 py-1 text-xs rounded-full border ${
                  hoveredNode.isMining 
                    ? 'bg-orange-50 text-orange-700 border-orange-200' 
                    : hoveredNode.isActive
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}>
                  {hoveredNode.isMining ? 'Active mining' : hoveredNode.isActive ? 'Communicating' : 'Inactive'}
                </span>
                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">
                  {hoveredNode.blocks.length} Blocks
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
              <div>
                <div className="text-gray-600 text-xs">Status</div>
                <div className="font-medium text-gray-900">
                  {hoveredNode.isMining ? 'Mineração Ativa' : hoveredNode.isActive ? 'Comunicando com a rede' : 'Inativo'}
                </div>
              </div>
              <div>
                <div className="text-gray-600 text-xs">Blocks in chain</div>
                <div className="font-semibold text-blue-700">{hoveredNode.blocks.length}</div>
              </div>
              <div>
                <div className="text-gray-600 text-xs">Blocks mined</div>
                <div className="font-semibold text-emerald-700">{hoveredNode.blocksMined}</div>
              </div>
              <div>
                <div className="text-gray-600 text-xs">Role</div>
                <div className="text-gray-900">Maintains a distributed copy of the blockchain</div>
              </div>
              {hoveredNode.blocks.length > 0 && (
                <div className="col-span-2">
                  <div className="text-gray-600 text-xs">Last block</div>
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded border border-gray-200 text-gray-800 text-xs">
                    Block #{hoveredNode.blocks[hoveredNode.blocks.length - 1].id}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {hoveredBlock && (
          <div className="bg-white p-4 rounded-lg mb-4 border border-purple-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-purple-800 text-lg">Block #{hoveredBlock.id}</h3>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-200">Confirmado</span>
                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">{hoveredBlock.transactions.length} TX</span>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-gray-600 text-xs">Hash</div>
                  <div className="font-mono text-[11px] bg-gray-100 p-2 text-[#303030] rounded border border-gray-200 break-all">{hoveredBlock.hash}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-xs">Previous Hash</div>
                  <div className="font-mono text-[11px] bg-gray-100 p-2 text-[#303030] rounded border border-gray-200 break-all">{hoveredBlock.previousHash}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-gray-600 text-xs">Nonce</div>
                  <div className="font-mono text-xs bg-yellow-50 p-2 text-[#303030] rounded border border-yellow-200">{hoveredBlock.nonce}</div>
                </div>
                <div>
                  <div className="text-gray-600 text-xs">Merkle Root</div>
                  <div className="font-mono text-[11px] bg-purple-50 p-2 text-[#303030] rounded border border-purple-200 break-all">{hoveredBlock.merkleRoot}</div>
                </div>
              </div>

              <div>
                <div className="text-gray-600 text-xs">Timestamp</div>
                <div className="text-sm font-medium text-gray-900">{new Date(hoveredBlock.timestamp).toLocaleString('pt-BR')}</div>
              </div>

              <div>
                <div className="text-gray-600 text-xs">Transactions ({hoveredBlock.transactions.length})</div>
                <div className="space-y-2 mt-2">
                  {hoveredBlock.transactions.map((tx, index) => (
                    <div key={tx.id} className="bg-gray-50 p-3 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-gray-600">TX #{tx.id.split('_')[1]}</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Confirmed
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">From:</span>
                          <div className="font-medium text-gray-800">{tx.from}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">To:</span>
                          <div className="font-medium text-gray-800">{tx.to}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Amount:</span>
                        <div className="flex items-center gap-1">
                          <span className="text-lg">₿</span>
                          <span className="font-bold text-green-600">{tx.amount} {tx.currency}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Fee:</span>
                        <div className="flex items-center gap-1">
                          <span className="text-sm">₿</span>
                          <span className="text-sm text-orange-600">{tx.fee} {tx.currency}</span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-400 font-mono">
                        ID: {tx.id.substring(0, 20)}...
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-3 p-2 bg-blue-50 rounded">
              <p className="text-xs text-blue-700 font-medium">💡 How it works:</p>
              <p className="text-xs text-blue-600">The block hash uses previous hash, merkle root, nonce and block ID. The nonce is adjusted until it meets difficulty criteria.</p>
            </div>
          </div>
        )}

        {hoveredBlock && (
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 shadow-sm">
            <h3 className="font-bold text-indigo-800 text-sm mb-3 flex items-center gap-2">
              <span>🔗</span>
              <span>Fundamentals of blocks</span>
            </h3>
            <div className="space-y-2.5 text-xs text-indigo-900">
              <div className="flex items-start gap-2">
                <span className="text-indigo-600 mt-0.5">•</span>
                <div>
                  <span className="font-semibold">Immutable & Permanent:</span> Once a block is added to the chain, it cannot be modified or removed. This ensures data integrity and security.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-indigo-600 mt-0.5">•</span>
                <div>
                  <span className="font-semibold">Distributed Consensus:</span> All nodes validate and store the same chain. When a new block is created, it propagates to every node in the network.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-indigo-600 mt-0.5">•</span>
                <div>
                  <span className="font-semibold">No Block Limit:</span> The blockchain grows indefinitely. Each new block is permanently added, creating an ever-expanding ledger.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-indigo-600 mt-0.5">•</span>
                <div>
                  <span className="font-semibold">One-Way Growth:</span> The chain only increases - blocks are never deleted. This creates an immutable historical record.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-indigo-600 mt-0.5">•</span>
                <div>
                  <span className="font-semibold">Cryptographic Linking:</span> Each block references the previous block's hash, creating a secure chain where tampering invalidates subsequent blocks.
                </div>
              </div>
            </div>
          </div>
        )}

        {!hoveredNode && !hoveredBlock && (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-gray-500 text-sm">Hover a node or block to see details</p>
          </div>
        )}
      </div>

      {showTransactionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">💰 Create New Transaction</h2>
              <button
                onClick={() => setShowTransactionForm(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>

            <TransactionForm 
              onSubmit={(from, to, amount, currency) => {
                addTransactionToPool(from, to, amount, currency);
                setShowTransactionForm(false);
              }}
            />
          </motion.div>
        </div>
      )}

      <ConceptsModal 
        isOpen={showConceptsModal}
        onClose={() => setShowConceptsModal(false)}
      />
    </div>
  );
};

export default BlockchainNetwork;