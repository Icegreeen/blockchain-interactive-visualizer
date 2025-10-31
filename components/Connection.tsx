import React from 'react';
import { motion } from 'framer-motion';

interface ConnectionProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  isPropagating?: boolean;
  isActive?: boolean;
  isPulsing?: boolean;
}

const Connection: React.FC<ConnectionProps> = ({ 
  from, 
  to, 
  isPropagating = false, 
  isActive = false,
  isPulsing = false
}) => {
  return (
    <g>
      <line
        x1={from.x + 24}
        y1={from.y + 24}
        x2={to.x + 24}
        y2={to.y + 24}
        stroke="#9ca3af"
        strokeOpacity={0.35}
        strokeWidth={1}
      />

      {!isActive && !isPropagating && isPulsing && (
        <motion.line
          x1={from.x + 24}
          y1={from.y + 24}
          x2={to.x + 24}
          y2={to.y + 24}
          stroke="#6b7280"
          strokeOpacity={0.6}
          strokeWidth={1.5}
          strokeDasharray="4 8"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: [0, 12] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        />
      )}

      {isPropagating && (
        <motion.line
          x1={from.x + 24}
          y1={from.y + 24}
          x2={to.x + 24}
          y2={to.y + 24}
          stroke="#10b981"
          strokeWidth={3}
          strokeDasharray="6 6"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: [0, 12] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
      )}

      {isActive && !isPropagating && (
        <motion.line
          x1={from.x + 24}
          y1={from.y + 24}
          x2={to.x + 24}
          y2={to.y + 24}
          stroke="#3b82f6"
          strokeWidth={2}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {isActive && !isPropagating && (
        <>
          <motion.circle
            cx={(from.x + 24) + (to.x - from.x) * 0.25}
            cy={(from.y + 24) + (to.y - from.y) * 0.25}
            r="3"
            fill="#10b981"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.2, 0],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.circle
            cx={(from.x + 24) + (to.x - from.x) * 0.75}
            cy={(from.y + 24) + (to.y - from.y) * 0.75}
            r="2.5"
            fill="#3b82f6"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.4
            }}
          />
        </>
      )}
    </g>
  );
};

export default Connection;
