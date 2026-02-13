
import React from 'react';
import { OptimizationSuggestion } from '../types';
import { PiggyBank, Sparkles, TrendingUp, ArrowRight, HeartHandshake, Briefcase } from 'lucide-react';

interface Props {
  suggestions: OptimizationSuggestion[];
}

const OptimizationSuggestions: React.FC<Props> = ({ suggestions }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-sm border border-emerald-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-lg">
                <HeartHandshake className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
                <h2 className="text-lg font-bold text-emerald-900">Piani Welfare & Ottimizzazione</h2>
                <p className="text-xs text-emerald-700">Opportunità basate sul tuo CCNL</p>
            </div>
        </div>
        <div className="hidden md:block bg-white/50 px-3 py-1 rounded-full text-xs font-semibold text-emerald-800 border border-emerald-100">
             Simulazione Consigliata
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {suggestions.map((item, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-emerald-100 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-default">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                         <div className="bg-emerald-50 p-1.5 rounded-md group-hover:bg-emerald-100 transition-colors">
                            <Briefcase className="w-4 h-4 text-emerald-600" />
                         </div>
                         <h3 className="font-bold text-slate-800 text-sm group-hover:text-emerald-700 transition-colors">{item.title}</h3>
                    </div>
                </div>
                
                <p className="text-slate-600 text-sm leading-relaxed mb-4 border-l-2 border-emerald-100 pl-3">
                    {item.description}
                </p>

                <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100/50 flex items-center justify-between mt-auto">
                    <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">Potenziale Impatto</p>
                        <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-sm">
                             <TrendingUp className="w-4 h-4" />
                             {item.potentialImpact}
                        </div>
                    </div>
                    <button className="text-xs bg-white border border-emerald-200 text-emerald-600 px-3 py-1.5 rounded-lg font-medium hover:bg-emerald-50 transition-colors shadow-sm">
                        Dettagli
                    </button>
                </div>
            </div>
        ))}
      </div>
      
      <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/60 p-3 rounded-lg border border-emerald-100">
         <div className="flex items-center gap-2 text-xs text-emerald-800">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>I piani welfare sono regolati dal CCNL e dagli accordi aziendali.</span>
         </div>
         <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            <ArrowRight className="w-3 h-3" />
            <span>Verifica fattibilità con HR</span>
         </div>
      </div>
    </div>
  );
};

export default OptimizationSuggestions;