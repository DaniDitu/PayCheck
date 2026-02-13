import React from 'react';
import { AnalysisResult } from '../types';
import { TrendingUp, TrendingDown, Wallet, Lightbulb } from 'lucide-react';

interface Props {
  result: AnalysisResult;
}

const SummaryCard: React.FC<Props> = ({ result }) => {
  const { finalSummary, calculations } = result;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Net Pay - Highlighted */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white shadow-lg md:col-span-1 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wallet className="w-24 h-24" />
        </div>
        <div>
            <p className="text-green-100 text-sm font-medium mb-1">Netto in Busta</p>
            <h3 className="text-4xl font-bold tracking-tight">{finalSummary.netTotal}</h3>
        </div>
        <div className="mt-4 pt-4 border-t border-green-500/30">
            <p className="text-xs text-green-100">
                Paga oraria netta stimata: <span className="font-bold">{calculations.netHourlyRateEstimated}</span>
            </p>
        </div>
      </div>

      {/* Gross & Deductions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 md:col-span-2 flex flex-col justify-between">
        <div className="grid grid-cols-2 gap-4 mb-4">
             <div>
                <p className="text-slate-500 text-sm mb-1">Lordo Totale</p>
                <div className="flex items-center gap-2 text-slate-800">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <span className="text-2xl font-bold">{finalSummary.grossTotal}</span>
                </div>
             </div>
             <div>
                <p className="text-slate-500 text-sm mb-1">Trattenute ({calculations.deductionPercentage})</p>
                 <div className="flex items-center gap-2 text-slate-800">
                    <TrendingDown className="w-5 h-5 text-red-500" />
                    <span className="text-2xl font-bold">{calculations.totalDeductions}</span>
                </div>
             </div>
        </div>

        <div className="bg-amber-50 rounded-lg p-3 border border-amber-100 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
                <p className="text-xs font-bold text-amber-700 mb-1">Cosa incide di più?</p>
                <p className="text-sm text-amber-800 leading-relaxed">
                    {finalSummary.topImpactItems.join(', ')}.
                </p>
                 <p className="text-xs text-amber-600 mt-2 italic">
                    Tip: {finalSummary.improvementTips}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;