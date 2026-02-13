import React from 'react';
import { FileSearch } from 'lucide-react';
import { APP_NAME } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <FileSearch className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">{APP_NAME}</h1>
            <p className="text-xs text-slate-500">Analisi Buste Paga Italiane</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;