
import React from 'react';
import { GeneralData } from '../types';
import { Building2, User, Calendar, Briefcase, ScrollText, Award } from 'lucide-react';

interface Props {
  data: GeneralData;
}

const GeneralInfoCard: React.FC<Props> = ({ data }) => {
  const items = [
    { icon: Building2, label: "Azienda", value: data.employer },
    { icon: User, label: "Dipendente", value: data.employee },
    { icon: Calendar, label: "Periodo", value: data.payPeriod },
    { icon: Briefcase, label: "Contratto", value: data.contractType },
    { icon: ScrollText, label: "CCNL", value: data.ccnl },
    { icon: Award, label: "Livello", value: data.level },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
      <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Dati Generali</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-6 gap-x-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex flex-col items-start gap-2 min-w-0">
            <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-slate-100 rounded-md text-slate-500 shrink-0">
                  <item.icon className="w-4 h-4" />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
            </div>
            
            <p className="text-sm font-semibold text-slate-900 break-words leading-tight pl-1">
              {item.value || "N/D"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneralInfoCard;