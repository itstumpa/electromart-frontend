'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface Props {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open, title, description,
  confirmLabel = 'Confirm',
  danger = false,
  onConfirm, onCancel,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onCancel}
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10"
          >
            <button onClick={onCancel} className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
              <X size={15} />
            </button>

            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${danger ? 'bg-red-100' : 'bg-amber-100'}`}>
              <AlertTriangle size={22} className={danger ? 'text-red-600' : 'text-amber-700'} />
            </div>

            <h3 className="text-lg font-black text-slate-900 mb-1">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">{description}</p>

            <div className="flex gap-3">
              <button onClick={onCancel}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button onClick={onConfirm}
                className={`flex-1 py-2.5 font-bold text-sm rounded-xl text-white transition-colors ${
                  danger ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}