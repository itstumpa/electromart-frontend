'use client';

import { Tag, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TopBar() {
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-amber-600 text-white overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-between text-sm">
            {/* Left spacer */}
            <div className="w-6 hidden sm:block" />

            {/* Center message */}
            <div className="flex items-center gap-2 font-medium tracking-wide flex-1 justify-center">
              <Tag size={14} className="shrink-0" />
              <span className="text-amber-50 text-xs sm:text-sm">
                Free shipping on orders over{' '}
                <span className="font-bold text-white">$99</span>
                &nbsp;·&nbsp; Use code{' '}
                <span className="font-bold bg-white/20 px-2 py-0.5 rounded text-white tracking-widest">
                  ELECTRO20
                </span>{' '}
                for 20% off your first order
              </span>
            </div>

            {/* Close */}
            <button
              onClick={() => setVisible(false)}
              className="text-amber-200 hover:text-white transition-colors shrink-0 p-1 rounded"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}