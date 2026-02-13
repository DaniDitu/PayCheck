

import React, { useState } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import GeneralInfoCard from './components/GeneralInfoCard';
import SummaryCard from './components/SummaryCard';
import LeaveStatusCard from './components/LeaveStatusCard';
import LineItemsSection from './components/LineItemsSection';
import SimpleExplanation from './components/SimpleExplanation';
import ConsistencyChecks from './components/ConsistencyChecks';
import OptimizationSuggestions from './components/OptimizationSuggestions'; 
import PensionAndBonusCard from './components/PensionAndBonusCard'; // Import
import DonationWall from './components/DonationWall';
import AdminLoginModal from './components/AdminLoginModal';
import { extractTextFromPdf } from './services/pdfService';
import { analyzePayslipWithGemini } from './services/geminiService';
import { generateAnalysisPdf } from './services/pdfExportService';
import { AnalysisResult, AnalysisStatus } from './types';
import { Loader2, Printer, LockKeyhole } from 'lucide-react';

const ADMIN_EMAIL = "danieleditu@gmail.com";

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // State per Paywall e Admin
  const [accessGranted, setAccessGranted] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showAdminLogin, setShowAdminLogin] = useState<boolean>(false);

  const handleFileSelect = async (file: File) => {
    // Doppio controllo di sicurezza (lato client)
    if (!accessGranted && !isAdmin) return;

    setStatus('extracting');
    setError(null);
    setResult(null);

    try {
      // 1. Extract Text
      const text = await extractTextFromPdf(file);
      
      // 2. Analyze with AI
      setStatus('analyzing');
      const analysis = await analyzePayslipWithGemini(text);
      
      // 3. Show Results
      setResult(analysis);
      setStatus('success');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Si è verificato un errore imprevisto.");
      setStatus('error');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setResult(null);
    setError(null);
  };

  const handleDownloadPdf = () => {
    if (result) {
        generateAnalysisPdf(result);
    }
  };

  const handleDonationSuccess = () => {
    setAccessGranted(true);
  };

  const handleAdminSubmit = (email: string) => {
    if (email && email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        setIsAdmin(true);
        setAccessGranted(true);
        setShowAdminLogin(false);
    } else {
        alert("Email non autorizzata.");
    }
  };

  const showUpload = accessGranted || isAdmin;

  return (
    // FIX: added bg-slate-50 to ensure background color persists on scroll
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
      <div className="print:hidden">
        <Header />
      </div>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 pb-20 print:p-0 print:max-w-none">
        
        {/* PAYWALL CHECK - Hide in print */}
        {!showUpload ? (
           <div className="print:hidden">
             <DonationWall onDonationSuccess={handleDonationSuccess} />
           </div>
        ) : (
            <>
                {/* State: Idle or Loading */}
                {(status === 'idle' || status === 'extracting' || status === 'analyzing') && (
                <div className="max-w-xl mx-auto mt-12 animate-in fade-in zoom-in duration-300 print:hidden">
                    <FileUpload 
                    onFileSelect={handleFileSelect} 
                    isLoading={status === 'extracting' || status === 'analyzing'} 
                    />
                    
                    {(status === 'extracting' || status === 'analyzing') && (
                    <div className="mt-8 text-center space-y-3">
                        <div className="flex justify-center">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-800">
                          {status === 'extracting' ? 'Lettura sicura del documento...' : 'Il Consulente Virtuale sta analizzando la tua busta paga...'}
                        </h3>
                        <p className="text-slate-500 text-sm">
                          {status === 'extracting' ? 'Estrazione testo in corso' : 'Analisi voci, verifica CCNL, Bonus Governo e Pensioni in corso'}
                        </p>
                    </div>
                    )}

                    {error && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center animate-in fade-in slide-in-from-top-2">
                        <p className="text-red-700 font-medium mb-1">Ops! Analisi interrotta.</p>
                        <p className="text-red-600 text-sm mb-3">{error}</p>
                        <button 
                        onClick={handleReset}
                        className="text-sm bg-white border border-red-200 px-4 py-2 rounded-lg text-red-700 hover:bg-red-50 transition-colors"
                        >
                        Riprova
                        </button>
                    </div>
                    )}
                </div>
                )}

                {/* State: Success Results */}
                {status === 'success' && result && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                    
                    <div className="flex justify-between items-center mb-6 print:hidden">
                        <h2 className="text-2xl font-bold text-slate-800">Analisi Completata</h2>
                        <div className="flex gap-2">
                            <button 
                                onClick={handleDownloadPdf}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium shadow-sm"
                            >
                                <Printer className="w-4 h-4" />
                                Salva come PDF
                            </button>
                        </div>
                    </div>
                    
                    {/* Print Header only visible when printing */}
                    <div className="hidden print:block mb-8 border-b pb-4">
                        <h1 className="text-2xl font-bold text-slate-900">Busta Paga Expert - Report Analisi</h1>
                        <p className="text-sm text-slate-500">Generato il {new Date().toLocaleDateString('it-IT')}</p>
                    </div>

                    {/* LAYOUT: Stacked Vertical (Full Width Blocks) */}
                    <div className="space-y-6">
                        
                        {/* 0. Summary (Hero) */}
                        <div className="break-inside-avoid">
                            <SummaryCard result={result} />
                        </div>
                        
                        {/* 1. In parole semplici */}
                        <div className="break-inside-avoid">
                            <SimpleExplanation data={result.simpleExplanation} />
                        </div>
                        
                        {/* 2. Dati Generali */}
                        <div className="break-inside-avoid">
                            <GeneralInfoCard data={result.generalData} />
                        </div>

                        {/* 3. Dettaglio Voci */}
                        <div className="break-inside-avoid">
                            <LineItemsSection items={result.lineItems} />
                        </div>

                        {/* 4. Situazione Ferie & Permessi */}
                        <div className="break-inside-avoid">
                            <LeaveStatusCard data={result.leaveAnalysis} />
                        </div>
                        
                        {/* 5. NEW: Pension & Bonuses */}
                        <div className="break-inside-avoid">
                            <PensionAndBonusCard pension={result.pensionData} bonuses={result.governmentBonuses} />
                        </div>

                        {/* 6. Verifiche & Anomalie */}
                        <div className="break-inside-avoid">
                            <ConsistencyChecks checks={result.consistencyChecks} />
                        </div>

                        {/* 7. Ottimizzazione Fiscale & Welfare */}
                        {result.optimizationSuggestions && result.optimizationSuggestions.length > 0 && (
                            <div className="break-inside-avoid">
                                <OptimizationSuggestions suggestions={result.optimizationSuggestions} />
                            </div>
                        )}
                    </div>

                </div>
                )}
            </>
        )}

      </main>

      {/* Footer / Admin Link - Hide in print */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto print:hidden">
        <div className="max-w-5xl mx-auto px-4 text-center">
            <p className="text-slate-400 text-sm mb-2">
            Il servizio utilizza AI avanzata per scopo informativo. Per questioni legali, rivolgiti a un professionista.
            </p>
            <button 
                onClick={() => setShowAdminLogin(true)}
                className="text-xs text-slate-300 hover:text-slate-500 flex items-center gap-1 mx-auto transition-colors"
            >
                <LockKeyhole className="w-3 h-3" />
                Admin
            </button>
        </div>
      </footer>

      <div className="print:hidden">
        <AdminLoginModal 
            isOpen={showAdminLogin} 
            onClose={() => setShowAdminLogin(false)}
            onSubmit={handleAdminSubmit}
        />
      </div>

    </div>
  );
};

export default App;