'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#756657] text-white rounded-full shadow-lg hover:bg-[#756657]/90 transition-all duration-300 flex items-center justify-center"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="bg-[#756657] text-white p-4 rounded-t-2xl">
            <h3 className="font-semibold">Chat dengan AI Terapis</h3>
            <p className="text-xs opacity-90">Online 24/7</p>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 mb-4">
              <p className="text-sm">Halo! Saya AI Terapis Jiwo. Bagaimana perasaan Anda hari ini?</p>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <input
              type="text"
              placeholder="Ketik pesan..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#756657] dark:bg-gray-800"
            />
          </div>
        </div>
      )}
    </>
  );
}
