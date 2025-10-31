import React, { useState } from 'react';
import { TransactionFormData } from '../types';

interface TransactionFormProps {
  onSubmit: (from: string, to: string, amount: number, currency: string) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    from: '',
    to: '',
    amount: '',
    currency: 'BTC'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.from && formData.to && formData.amount && parseFloat(formData.amount) > 0) {
      onSubmit(formData.from, formData.to, parseFloat(formData.amount), formData.currency);
    }
  };

  const fillExample = () => {
    setFormData({
      from: 'Flavio',
      to: 'Laura',
      amount: '1.00',
      currency: 'BTC'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">From (Sender):</label>
        <input
          type="text"
          value={formData.from}
          onChange={(e) => setFormData({...formData, from: e.target.value})}
          placeholder="e.g., Flavio"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-[#4e4e4e] focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">To (Recipient):</label>
        <input
          type="text"
          value={formData.to}
          onChange={(e) => setFormData({...formData, to: e.target.value})}
          placeholder="e.g., Laura"
          className="w-full px-3 py-2 border text-[#4e4e4e] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex space-x-2">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount:</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            placeholder="1.00"
            className="w-full px-3 py-2 border border-gray-300 text-[#4e4e4e] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="w-24">
          <label className="block text-sm font-medium text-gray-700 mb-1">Currency:</label>
          <select
            value={formData.currency}
            onChange={(e) => setFormData({...formData, currency: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 text-[#4e4e4e] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
            <option value="ADA">ADA</option>
            <option value="SOL">SOL</option>
          </select>
        </div>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-sm text-blue-700"><strong>Example:</strong> {formData.from || 'Flavio'} sends {formData.amount || '1.00'} {formData.currency} to {formData.to || 'Laura'}</p>
      </div>

      <div className="flex space-x-3">
        <button
          type="submit"
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Create Transaction
        </button>
        <button
          type="button"
          onClick={fillExample}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Example
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;

