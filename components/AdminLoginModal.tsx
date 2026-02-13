import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
}

const AdminLoginModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
        setError(true);
        return;
    }
    onSubmit(email);
    setEmail('');
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 scale-100">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-800 p-2 rounded-lg">
                <Lock className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Accesso Admin</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Amministratore
            </label>
            <input
              type="email"
              autoFocus
              value={email}
              onChange={(e) => {
                  setEmail(e.target.value);
                  setError(false);
              }}
              placeholder="admin@example.com"
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
                error 
                ? 'border-red-300 focus:ring-red-200 bg-red-50' 
                : 'border-slate-300 focus:ring-blue-200 focus:border-blue-500'
              }`}
            />
            {error && <p className="text-xs text-red-500 mt-2">Inserisci un'email valida.</p>}
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
            >
              Accedi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;