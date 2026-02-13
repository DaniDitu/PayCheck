
import React from 'react';
import { PensionData, GovernmentBonus } from '../types';
import { Hourglass, Landmark, BadgeCheck, ShieldCheck, Gift, Info, TrendingUp, XCircle, AlertOctagon, Wallet } from 'lucide-react';

interface Props {
  pension: PensionData;
  bonuses: GovernmentBonus[];
}

const PensionAndBonusCard: React.FC<Props> = ({ pension, bonuses }) => {
  const isContributivo = pension.pensionSystem?.toLowerCase().includes('contributivo');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      
      {/* SEZIONE PENSIONE */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                    <Landmark className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Prospetto Pensionistico</h2>
                    <p className="text-xs text-slate-500">Sistema: <span className="font-semibold">{pension.pensionSystem}</span></p>
                </div>
            </div>
            {pension.supplementaryPension ? (
                <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full text-[10px] font-bold border border-emerald-200 uppercase tracking-wide shadow-sm animate-pulse">
                    <ShieldCheck className="w-3.5 h-3.5" /> 
                    Previdenza Attiva
                </div>
            ) : (
                <div className="flex items-center gap-1.5 bg-slate-100 text-slate-400 px-3 py-1.5 rounded-full text-[10px] font-bold border border-slate-200 uppercase tracking-wide">
                    <Wallet className="w-3.5 h-3.5" /> 
                    Solo INPS
                </div>
            )}
        </div>

        <div className="p-6 flex-1 flex flex-col justify-center">
            {/* BIG DATA IMPACT */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-purple-50 rounded-2xl border border-purple-100">
                    <p className="text-xs font-bold text-purple-400 uppercase mb-2">Data Prevista</p>
                    <p className="text-2xl md:text-3xl font-black text-purple-900 leading-none">
                        {pension.retireDateEstimate || "N/D"}
                    </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-2xl border border-purple-100">
                    <p className="text-xs font-bold text-purple-400 uppercase mb-2">Anni Mancanti</p>
                    <div className="flex items-center justify-center gap-2">
                         <Hourglass className="w-5 h-5 text-purple-600 animate-pulse" />
                         <p className="text-2xl md:text-3xl font-black text-purple-900 leading-none">
                            {pension.yearsToRetire?.replace(/\D+/g, '') || "-"}
                         </p>
                    </div>
                    <p className="text-[10px] text-purple-400 mt-1">Stima approssimativa</p>
                </div>
            </div>

            {/* Dettagli Tecnici */}
            <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-600 font-medium">Imponibile Previdenziale</span>
                    <span className="font-bold text-slate-900">{pension.contributionBase}</span>
                </div>
                
                {/* Contributivo Warning Enhanced */}
                {isContributivo && (
                    <div className="mt-4 flex gap-3 bg-indigo-50 p-4 rounded-xl border border-indigo-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                            <Info className="w-16 h-16 text-indigo-900" />
                        </div>
                        <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5 relative z-10" />
                        <div className="text-xs text-indigo-900 leading-relaxed relative z-10">
                            <span className="font-bold block mb-1 text-indigo-700 text-sm">Sistema Contributivo Puro</span>
                            Il tuo assegno pensionistico dipenderà <span className="font-semibold underline">esclusivamente</span> dai contributi versati effettivamente e non dalla media degli ultimi stipendi. 
                            <div className="mt-2 bg-white/60 p-2 rounded border border-indigo-100/50 italic text-indigo-800 font-medium">
                                Consiglio: Monitora costantemente l'estratto conto contributivo INPS e valuta versamenti volontari per colmare eventuali gap.
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
             <p className="text-[10px] text-slate-400 italic text-center mt-auto">
                {pension.notes}
             </p>
        </div>
      </div>

      {/* SEZIONE BONUS GOVERNATIVI */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
         <div className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-lg">
                <Gift className="w-6 h-6 text-amber-600" />
            </div>
            <div>
                <h2 className="text-lg font-bold text-slate-800">Bonus & Agevolazioni</h2>
                <p className="text-xs text-slate-500">Stato attuale rilevato</p>
            </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto max-h-[400px] custom-scrollbar space-y-3">
            {bonuses && bonuses.length > 0 ? (
                bonuses.map((bonus, idx) => {
                    let statusColor = "";
                    let statusIcon = null;
                    let statusText = "";

                    switch (bonus.status) {
                        case 'active':
                            statusColor = "bg-green-50 border-green-200";
                            statusIcon = <BadgeCheck className="w-5 h-5 text-green-600" />;
                            statusText = "ATTIVO";
                            break;
                        case 'potential':
                            statusColor = "bg-amber-50 border-amber-200";
                            statusIcon = <AlertOctagon className="w-5 h-5 text-amber-600" />;
                            statusText = "POTENZIALE";
                            break;
                        case 'missed':
                            statusColor = "bg-slate-50 border-slate-200 opacity-75";
                            statusIcon = <XCircle className="w-5 h-5 text-slate-400" />;
                            statusText = "NON SPETTANTE";
                            break;
                    }

                    return (
                        <div key={idx} className={`p-4 rounded-xl border ${statusColor} relative group transition-all hover:shadow-md`}>
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex-1 pr-2">
                                    <h3 className="font-bold text-slate-800 text-sm">{bonus.name}</h3>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border mt-1 inline-block ${
                                        bonus.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' :
                                        bonus.status === 'potential' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                        'bg-slate-200 text-slate-500 border-slate-300'
                                    }`}>
                                        {statusText}
                                    </span>
                                </div>
                                {statusIcon}
                            </div>
                            
                            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                                {bonus.description}
                            </p>
                            
                            <div className="flex justify-between items-end border-t border-black/5 pt-2 mt-2">
                                <span className="text-[10px] font-medium text-slate-400">
                                    Rif: {bonus.referenceLaw}
                                </span>
                                {bonus.amount && bonus.status === 'active' && (
                                    <span className="text-sm font-bold text-slate-900 bg-white px-2 py-0.5 rounded shadow-sm border border-slate-100">
                                        {bonus.amount}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 py-8">
                    <TrendingUp className="w-10 h-10 mb-2 opacity-20" />
                    <p className="text-sm">Nessun bonus particolare rilevato.</p>
                </div>
            )}
        </div>
      </div>

    </div>
  );
};

export default PensionAndBonusCard;
