import React from 'react';
import { motion } from 'framer-motion';
import { Node, Block } from '../types';

interface NodeComponentProps {
  node: Node;
  onNodeHover?: (node: Node) => void;
  onBlockHover?: (block: Block) => void;
  onNodeClick?: (nodeId: string) => void;
  isSelected?: boolean;
}

const NodeComponent: React.FC<NodeComponentProps> = ({ 
  node, 
  onNodeHover, 
  onBlockHover, 
  onNodeClick, 
  isSelected 
}) => {
  return (
    <g>
      {node.isMining && (
        <motion.circle
          cx={node.x + 24}
          cy={node.y + 24}
          r="25"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="3"
          strokeDasharray="10,5"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      )}
      
      <motion.circle
        cx={node.x + 24}
        cy={node.y + 24}
        r="20"
        fill={node.isActive ? "#dbeafe" : isSelected ? "#fef3c7" : "#f3f4f6"}
        stroke={node.isActive ? "#3b82f6" : isSelected ? "#f59e0b" : "#9ca3af"}
        strokeWidth={isSelected ? "3" : "2"}
        initial={{ scale: 0 }}
        animate={{ 
          scale: node.isActive ? [1, 1.05, 1] : 1,
        }}
        transition={{ 
          duration: 0.5,
          scale: node.isActive ? { duration: 1, repeat: Infinity, ease: "easeInOut" } : { duration: 0.5 }
        }}
        onMouseEnter={() => onNodeHover?.(node)}
        onClick={() => onNodeClick?.(node.id)}
        style={{ cursor: 'pointer' }}
      />
      
      {node.isActive && (
        <>
          <motion.circle
            cx={node.x + 24}
            cy={node.y + 24}
            r="25"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            opacity="0.8"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.8, 0, 0.8]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.circle
            cx={node.x + 24}
            cy={node.y + 8}
            r="6"
            fill="#10b981"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1, 0.8, 1],
              opacity: [0, 1, 0.8, 1]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.text
            x={node.x + 24}
            y={node.y + 12}
            textAnchor="middle"
            fontSize="8"
            fill="white"
            fontWeight="bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.8, 1] }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            ⚡
          </motion.text>
        </>
      )}
      
      <motion.text
        x={node.x + 24}
        y={node.y + 30}
        textAnchor="middle"
        fontSize="12"
        fontWeight={isSelected ? "bold" : "normal"}
        fill={node.isActive ? "#1d4ed8" : isSelected ? "#92400e" : "#6b7280"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {node.id}
      </motion.text>
      
      {node.blocksMined > 0 && (
        <motion.text
          x={node.x + 24}
          y={node.y + 8}
          textAnchor="middle"
          fontSize="8"
          fill="#059669"
          fontWeight="bold"
          initial={{ opacity: 0, y: node.y + 4 }}
          animate={{ opacity: 1, y: node.y + 8 }}
          transition={{ duration: 0.3 }}
        >
          {node.blocksMined}
        </motion.text>
      )}
      
      {node.blocks.map((block, index) => {
        const isLast = index === node.blocks.length - 1;
        const centerX = node.x + 24;
        const centerY = node.y + 24;
        const blockSpacing = 22;
        const totalWidth = node.blocks.length * blockSpacing;
        const startX = centerX - (totalWidth / 2) + (blockSpacing / 2);
        const blockX = startX + (index * blockSpacing);
        const blockY = centerY + 32;
        const blockWidth = 20;
        const blockHeight = 16;
        const fillColor = isLast ? "#dcfce7" : index % 2 === 0 ? "#dbeafe" : "#f1f5f9";
        const strokeColor = isLast ? "#16a34a" : index % 2 === 0 ? "#3b82f6" : "#94a3b8";
        
        return (
          <g key={`${node.id}-${block.id}`}>
            {index > 0 && (
              <line
                x1={blockX - blockSpacing + blockWidth/2}
                y1={blockY + blockHeight/2}
                x2={blockX - blockWidth/2}
                y2={blockY + blockHeight/2}
                stroke={isLast ? "#10b981" : "#94a3b8"}
                strokeWidth="2"
                opacity="0.6"
              />
            )}
            
            <motion.g
              initial={isLast ? { scale: 0, opacity: 0 } : { opacity: 0 }}
              animate={isLast ? { scale: 1, opacity: 1 } : { opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: isLast ? 0.1 : 0 }}
              onMouseEnter={() => onBlockHover?.(block)}
              style={{ cursor: 'pointer' }}
              whileHover={{ scale: 1.15, transition: { duration: 0.2 } }}
            >
              <rect
                x={blockX - blockWidth/2}
                y={blockY}
                width={blockWidth}
                height={blockHeight}
                rx="3"
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={isLast ? "2.5" : "2"}
                style={{ 
                  filter: isLast 
                    ? 'drop-shadow(0 2px 4px rgba(22, 163, 74, 0.4))' 
                    : 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.1))'
                }}
              />
              
              <text
                x={blockX}
                y={blockY + 11}
                textAnchor="middle"
                fontSize="9"
                fill={isLast ? "#065f46" : index % 2 === 0 ? "#1e40af" : "#475569"}
                fontWeight="bold"
                fontFamily="system-ui, sans-serif"
              >
                {block.id}
              </text>
              
              {isLast && (
                <motion.circle
                  cx={blockX + blockWidth/2 - 3}
                  cy={blockY + 3}
                  r="3"
                  fill="#10b981"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                />
              )}
            </motion.g>
          </g>
        );
      })}
    </g>
  );
};

export default NodeComponent;
