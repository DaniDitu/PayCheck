import React from 'react';
import { LeaveAnalysis, LeaveDetails } from '../types';
import { Plane, Clock, AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react';

interface Props {
  data: LeaveAnalysis;
}

const StatBox = ({ label, value, subValue, isNegative }: { label: string, value: string, subValue?: string, isNegative?: boolean }) => (
  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col justify-between h-full">
    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-wide">{label}</p>
    <div>
        <p className={`text-lg font-bold leading-none ${isNegative ? 'text-orange-600' : 'text-slate-800'}`}>{value}</p>
        {subValue && <p className="text-xs text-slate-400 mt-1">{subValue}</p>}
    </div>
  </div>
);

const LeaveSection = ({ title, icon: Icon, details, colorClass, bgClass }: { title: string, icon: any, details: LeaveDetails, colorClass: string, bgClass: string }) => {
  const isConsistent = details.isConsistent;
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${bgClass} ${colorClass}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm md:text-base">{title}</h3>
            <p className="text-xs text-slate-400 font-medium">Unità: {details.unit}</p>
          </div>
        </div>
        {!isConsistent && (
           <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded text-[10px] font-bold border border-amber-200 uppercase tracking-wider">
             <AlertTriangle className="w-3 h-3" />
             <span>Check</span>
           </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 flex-1">
        <StatBox label="Residuo Prec." value={details.previousBalance} />
        <StatBox label="Maturato Mese" value={details.accrued} />
        <StatBox 
            label="Goduto Mese" 
            value={details.taken} 
            isNegative={parseFloat(details.taken.replace(',', '.')) > 0} 
        />
        <div className={`p-3 rounded-lg border flex flex-col justify-between h-full ${isConsistent ? 'bg-white border-slate-200' : 'bg-red-50 border-red-200'}`}>
            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-wide">Saldo Finale</p>
            <p className="text-xl font-extrabold text-slate-900 leading-none">{details.balance}</p>
        </div>
      </div>

      {details.note && details.note !== 'N/D' && (
        <div className={`text-xs p-3 rounded-lg flex gap-2 mt-auto ${isConsistent ? 'bg-slate-50 text-slate-600' : 'bg-red-50 text-red-700'}`}>
            {isConsistent ? <CheckCircle2 className="w-4 h-4 shrink-0 opacity-50" /> : <HelpCircle className="w-4 h-4 shrink-0" />}
            <p className="leading-snug">{details.note}</p>
        </div>
      )}
    </div>
  );
};

const LeaveStatusCard: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
      <h2 className="text-lg font-bold text-slate-800 mb-6 border-b pb-2">Situazione Ferie & Permessi</h2>
      
      {/* Changed from flex to grid for strict 2-column layout on md+ screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative">
        <LeaveSection 
            title="Ferie" 
            icon={Plane} 
            details={data.vacation} 
            colorClass="text-teal-700"
            bgClass="bg-teal-50"
        />
        
        {/* Vertical Divider for MD+ screens */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-100 -ml-[0.5px]"></div>
        
        {/* Horizontal Divider for mobile */}
        <div className="md:hidden w-full h-px bg-slate-100 my-2"></div>

        <LeaveSection 
            title="R.O.L. / Permessi" 
            icon={Clock} 
            details={data.rol} 
            colorClass="text-indigo-700"
            bgClass="bg-indigo-50"
        />
      </div>

      {data.humanExplanation && (
        <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50/50 p-4 rounded-lg -mx-2">
            <p className="text-sm text-slate-600 leading-relaxed">
                <span className="font-bold text-slate-800 block mb-1">L'esperto dice: </span>
                "{data.humanExplanation}"
            </p>
        </div>
      )}
    </div>
  );
};

export default LeaveStatusCard;