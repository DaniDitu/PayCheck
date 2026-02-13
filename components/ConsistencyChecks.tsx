import React from 'react';
import { ConsistencyCheck } from '../types';
import { AlertTriangle, Info, BookOpen, MessageCircleQuestion } from 'lucide-react';

interface Props {
  checks: ConsistencyCheck[];
}

const ConsistencyChecks: React.FC<Props> = ({ checks }) => {
  if (!checks || checks.length === 0) return null;

  const hasIssues = checks.some(c => !c.isConsistent);

  if (!hasIssues) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Verifiche & Anomalie
        </h2>
        <div className="space-y-6">
            {checks.map((check, idx) => {
                if (check.isConsistent && check.severity === 'info') return null;
                
                return (
                    <div key={idx} className={`p-5 rounded-xl border ${
                        check.severity === 'error' ? 'bg-red-50/50 border-red-100' :
                        check.severity === 'warning' ? 'bg-amber-50/50 border-amber-100' :
                        'bg-blue-50/50 border-blue-100'
                    }`}>
                        {/* Header Messaggio */}
                        <div className="flex items-start gap-3 mb-3">
                            {check.severity === 'error' && <AlertTriangle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />}
                            {check.severity === 'warning' && <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />}
                            {check.severity === 'info' && <Info className="w-5 h-5 shrink-0 text-blue-600 mt-0.5" />}
                            
                            <div>
                                <p className={`font-bold text-sm mb-1 uppercase tracking-wide ${
                                    check.severity === 'error' ? 'text-red-700' :
                                    check.severity === 'warning' ? 'text-amber-700' :
                                    'text-blue-700'
                                }`}>
                                    {check.isConsistent ? 'Info Utile' : 'Attenzione'}
                                </p>
                                <p className="text-slate-800 font-medium leading-relaxed">{check.message}</p>
                            </div>
                        </div>

                        {/* Sezione Dettagli: Spiegazione + Azione */}
                        <div className="pl-8 space-y-3">
                            
                            {/* Spiegazione Tecnica */}
                            {check.scientificExplanation && (
                                <div className="text-sm bg-white/60 p-3 rounded-lg border border-slate-100">
                                    <div className="flex items-center gap-2 mb-1 text-slate-500">
                                        <BookOpen className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase">Analisi Tecnica</span>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed text-sm pl-6 border-l-2 border-slate-200">
                                        {check.scientificExplanation}
                                    </p>
                                </div>
                            )}

                            {/* Azione Suggerita (Domanda da porre) */}
                            {check.suggestedAction && (
                                <div className="text-sm bg-white p-4 rounded-lg border border-indigo-100 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2 text-indigo-600">
                                        <MessageCircleQuestion className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase">Cosa fare ora?</span>
                                    </div>
                                    <p className="text-slate-700 italic mb-2">
                                        Puoi chiedere al tuo datore di lavoro o sindacato:
                                    </p>
                                    <div className="bg-indigo-50 text-indigo-900 p-3 rounded font-medium border-l-4 border-indigo-400">
                                        "{check.suggestedAction}"
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    </div>
  );
};

export default ConsistencyChecks;