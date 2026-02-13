import React, { useCallback } from 'react';
import { UploadCloud, FileText, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (isLoading) return;
      
      const files = e.dataTransfer.files;
      if (files.length > 0 && files[0].type === 'application/pdf') {
        onFileSelect(files[0]);
      } else {
        alert("Per favore carica solo file PDF.");
      }
    },
    [isLoading, onFileSelect]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div 
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ${
        isLoading 
          ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed' 
          : 'border-blue-300 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-500 cursor-pointer'
      }`}
    >
      <input
        type="file"
        id="fileInput"
        accept="application/pdf"
        className="hidden"
        onChange={handleChange}
        disabled={isLoading}
      />
      <label htmlFor="fileInput" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
            {isLoading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            ) : (
                <UploadCloud className="w-8 h-8" />
            )}
        </div>
        
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          {isLoading ? "Analisi in corso..." : "Carica la tua Busta Paga"}
        </h3>
        <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
          Trascina qui il tuo PDF o clicca per selezionarlo. 
          Supportiamo file Zucchetti, ADP, TeamSystem, Inaz e altri (solo digitali, no scansioni).
        </p>
        
        {!isLoading && (
          <div className="bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>I tuoi dati vengono elaborati in tempo reale e non vengono salvati.</span>
          </div>
        )}
      </label>
    </div>
  );
};

export default FileUpload;