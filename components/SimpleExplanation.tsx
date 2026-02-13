import React from 'react';
import { SimpleExplanation as SimpleExplanationType } from '../types';
import { BrainCircuit, CheckCircle2 } from 'lucide-react';

interface Props {
  data: SimpleExplanationType;
}

const SimpleExplanation: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-indigo-100 p-2 rounded-lg">
            <BrainCircuit className="w-6 h-6 text-indigo-600" />
        </div>
        <h2 className="text-lg font-bold text-indigo-900">In parole semplici</h2>
      </div>
      
      <p className="text-indigo-800 mb-6 leading-relaxed">
        {data.summary}
      </p>

      <div className="space-y-3">
        {data.keyTakeaways.map((point, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-indigo-100/50 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <span className="text-indigo-900 text-sm">{point}</span>
            </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleExplanation;