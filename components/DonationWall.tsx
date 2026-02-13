import React, { useState } from 'react';
import { Heart, ShieldCheck, Zap, ExternalLink, Check, Lock, Unlock, Search, Calculator, FileCheck } from 'lucide-react';

interface Props {
  onDonationSuccess: () => void;
}

const DonationWall: React.FC<Props> = ({ onDonationSuccess }) => {
  const [code, setCode] = useState('');
  
  // Link diretto per donazione (cmd=_donations)
  const donationUrl = "https://www.paypal.com/donate/?cmd=_donations&business=danieleditu@gmail.com&item_name=Supporto+lettura+Busta+paga+%22BUSTAPAGA%22&currency_code=EUR&amount=1";
  
  // Codice segreto da verificare (case-insensitive)
  const REQUIRED_CODE = "BUSTAPAGA";
  const isUnlocked = code.trim().toUpperCase() === REQUIRED_CODE;

  return (
    <div className="max-w-3xl mx-auto mt-12">
      <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center text-white">
          <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
            <Heart className="w-8 h-8 text-white fill-current" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Supporta il Progetto</h2>
          <p className="text-blue-100 max-w-md mx-auto">
            Aiutaci a mantenere attivo il servizio e a coprire i costi di gestione App.
          </p>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 text-lg">Perché una donazione?</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <Zap className="w-5 h-5 text-amber-500 shrink-0" />
                  <span>Copertura costi API (Intelligenza Artificiale)</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
                  <span>Mantenimento server sicuro</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-600">
                  <Heart className="w-5 h-5 text-red-500 shrink-0" />
                  <span>Sviluppo nuove funzionalità gratuite</span>
                </li>
              </ul>
              
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mt-4">
                <p className="text-xs text-slate-500 italic">
                  "Nessun abbonamento nascosto. Nessun dato della tua carta viene salvato sui nostri server."
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center bg-slate-50 rounded-xl p-6 border border-slate-200">
              <div className="text-center mb-6">
                <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">Contributo richiesto</p>
                <p className="text-4xl font-bold text-slate-900">1,00 €</p>
                <p className="text-xs text-slate-400 mt-1">Una tantum / Sessione</p>
              </div>

              <div className="w-full relative z-0 flex flex-col justify-center gap-4">
                
                {/* 1. Pulsante Donazione */}
                <a 
                    href={donationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#FFC439] hover:bg-[#F4BB30] text-slate-900 font-bold py-3 px-4 rounded-full shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 group border border-amber-300"
                >
                    <span>Dona con</span>
                    <span className="font-bold italic text-[#003087]">PayPal</span>
                    <ExternalLink className="w-4 h-4 ml-1 opacity-60 group-hover:opacity-100" />
                </a>

                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase">Poi</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                </div>

                {/* 2. Input Codice */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                        Inserisci codice causale per Sbloccare
                    </label>
                    <div className="relative">
                        <input 
                            type="text" 
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder='Es. "CAUSALE"'
                            className={`w-full px-4 py-2 pl-10 border rounded-lg text-sm focus:outline-none transition-all uppercase placeholder:normal-case ${
                                isUnlocked 
                                ? 'border-green-500 bg-green-50 text-green-700 focus:ring-2 focus:ring-green-200' 
                                : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                            }`}
                        />
                        <div className="absolute left-3 top-2.5">
                            {isUnlocked ? (
                                <Unlock className="w-4 h-4 text-green-600" />
                            ) : (
                                <Lock className="w-4 h-4 text-slate-400" />
                            )}
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1.5 leading-tight">
                        Trovi il codice nell'oggetto del pagamento PayPal.
                    </p>
                </div>

                {/* 3. Pulsante Conferma (Visibile solo se sbloccato) */}
                {isUnlocked && (
                     <button
                        onClick={onDonationSuccess}
                        className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md animate-in fade-in slide-in-from-top-2"
                     >
                        <Check className="w-5 h-5" />
                        Codice corretto! Avvia Analisi
                     </button>
                )}

              </div>
            </div>
          </div>

          {/* NUOVA SEZIONE: Spiegazione App (Cosa Ottieni) */}
          <div className="border-t border-slate-100 pt-8 mt-2">
            <h3 className="text-center font-bold text-slate-800 mb-6 text-lg">Cosa ottieni sbloccando l'analisi?</h3>
            <div className="grid md:grid-cols-3 gap-6">
                
                {/* Feature 1 */}
                <div className="text-center">
                    <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 text-blue-600">
                        <Search className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Spiegazioni Semplici</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Analizza ogni voce e te la spiega in italiano corrente. Basta codici incomprensibili.
                    </p>
                </div>

                {/* Feature 2 */}
                <div className="text-center">
                    <div className="bg-teal-50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 text-teal-600">
                        <FileCheck className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Controllo Ferie & ROL</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Verifica matematica dei contatori. Controlliamo se maturato, goduto e residuo tornano.
                    </p>
                </div>

                {/* Feature 3 */}
                <div className="text-center">
                    <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 text-indigo-600">
                        <Calculator className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Verifica Calcoli</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Controllo incrociato tra Lordo, Netto e Trattenute per scovare eventuali anomalie contabili.
                    </p>
                </div>

            </div>
          </div>

        </div>
        
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
                Pagamenti processati in sicurezza da PayPal. Destinatario: danieleditu@gmail.com
            </p>
        </div>
      </div>
    </div>
  );
};

export default DonationWall;