

import React, { useState } from 'react';
import { LineItem } from '../types';
import { ChevronDown, ChevronUp, Check, X, Calculator, Info } from 'lucide-react';

interface Props {
  items: LineItem[];
}

const LineItemsSection: React.FC<Props> = ({ items }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">Dettaglio Voci</h2>
        <p className="text-sm text-slate-500 print:hidden">Clicca sulle voci per capire cosa sono, con esempi pratici.</p>
      </div>

      <div className="divide-y divide-slate-100">
        {items.map((item, idx) => (
          <div key={idx} className="group break-inside-avoid">
            <div 
              onClick={() => toggleExpand(idx)}
              className={`p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors ${expandedIndex === idx ? 'bg-blue-50/50' : ''}`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-2 h-2 rounded-full shrink-0 ${
                    item.category.toLowerCase().includes('trattenute') || item.category.toLowerCase().includes('imposte') 
                    ? 'bg-red-400' 
                    : item.category.toLowerCase().includes('retribuzione') 
                        ? 'bg-green-400' 
                        : 'bg-slate-300'
                }`} />
                <div className="flex-1">
                    <p className="font-medium text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.category}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="font-mono font-semibold text-slate-700">{item.amount}</span>
                <div className="print:hidden">
                    {expandedIndex === idx ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>
              </div>
            </div>

            <div className={`px-4 md:px-12 pb-6 pt-2 bg-slate-50/50 text-sm ${expandedIndex === idx ? 'block' : 'hidden'} print:block`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                      <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1 tracking-wider">Cos'è (con Esempio)</span>
                          <p className="text-slate-700 leading-relaxed font-medium">{item.explanation.whatIsIt}</p>
                      </div>
                      <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1 tracking-wider">Perché esiste</span>
                          <p className="text-slate-600 leading-relaxed">{item.explanation.whyItExists}</p>
                      </div>
                  </div>
                  
                  <div className="space-y-4">
                       <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1 tracking-wider">Chi paga</span>
                          <p className="text-slate-600 leading-relaxed">{item.explanation.whoPays}</p>
                      </div>
                      <div>
                           <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1 tracking-wider">Note utili</span>
                           <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-xs border border-blue-100 leading-relaxed">
                              {item.explanation.notes}
                           </div>
                      </div>
                  </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex flex-wrap items-center gap-6 mb-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Influenza su:</span>
                      <div className="flex gap-3">
                          <ImpactBadge label="Lordo" active={item.explanation.impact.gross} />
                          <ImpactBadge label="Netto" active={item.explanation.impact.net} />
                          <ImpactBadge label="TFR" active={item.explanation.impact.tfr} />
                      </div>
                  </div>
                  
                  {/* Spiegazione Tecnica Impatto */}
                  {item.explanation.impactExplanation && (
                      <div className="flex items-start gap-2 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                          <Calculator className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Meccanismo Contabile</span>
                            <p className="text-slate-600 text-xs leading-relaxed">
                                {item.explanation.impactExplanation}
                            </p>
                          </div>
                      </div>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ImpactBadge = ({ label, active }: { label: string; active: boolean }) => (
    <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${active ? 'bg-green-100 border-green-200 text-green-700' : 'bg-slate-100 border-slate-200 text-slate-400 opacity-60'}`}>
        {active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
        <span>{label}</span>
    </div>
);

export default LineItemsSection;