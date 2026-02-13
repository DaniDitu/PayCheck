

export interface GeneralData {
  employer: string;
  employee: string;
  payPeriod: string;
  contractType: string;
  ccnl: string;
  level: string;
}

export interface LineItemExplanation {
  whatIsIt: string;
  whyItExists: string;
  whoPays: string;
  impact: {
    gross: boolean;
    net: boolean;
    tfr: boolean;
  };
  impactExplanation: string;
  notes: string;
}

export interface LineItem {
  name: string;
  category: string;
  amount: string;
  explanation: LineItemExplanation;
}

export interface Calculations {
  grossHourlyRate: string;
  netHourlyRateEstimated: string;
  totalDeductions: string;
  deductionPercentage: string;
}

export interface ConsistencyCheck {
  isConsistent: boolean;
  message: string;
  severity: 'info' | 'warning' | 'error';
  scientificExplanation?: string;
  suggestedAction?: string;
}

export interface OptimizationSuggestion {
  title: string;
  description: string;
  potentialImpact: string;
}

export interface SimpleExplanation {
  summary: string;
  keyTakeaways: string[];
}

export interface LeaveDetails {
  unit: string;
  previousBalance: string;
  accrued: string;
  taken: string;
  balance: string;
  isConsistent: boolean;
  note: string;
}

export interface LeaveAnalysis {
  vacation: LeaveDetails;
  rol: LeaveDetails;
  humanExplanation: string;
}

// --- NUOVI TIPI PER PENSIONI E BONUS ---

export interface PensionData {
  retireDateEstimate: string; // Es. "2045 (Stima)"
  yearsToRetire: string; // Es. "circa 20 anni"
  pensionSystem: string; // "Misto" o "Contributivo puro"
  contributionBase: string; // Imponibile previdenziale mese
  supplementaryPension: boolean; // Se ha fondi pensione (es. Fonchim, Cometa)
  notes: string; // Spiegazione su come è calcolata la stima
}

export interface GovernmentBonus {
  name: string; // Es. "Esonero Contributivo IVS (Taglio Cuneo)"
  status: 'active' | 'potential' | 'missed'; // Attivo in busta / Potenziale diritto / Perso
  description: string; // Spiegazione normativa breve
  amount?: string; // Se presente in busta
  referenceLaw: string; // Riferimento normativo (es. "Legge di Bilancio 2025")
}

export interface AnalysisResult {
  generalData: GeneralData;
  lineItems: LineItem[];
  calculations: Calculations;
  leaveAnalysis: LeaveAnalysis;
  pensionData: PensionData; // Nuovo
  governmentBonuses: GovernmentBonus[]; // Nuovo
  consistencyChecks: ConsistencyCheck[];
  optimizationSuggestions: OptimizationSuggestion[];
  simpleExplanation: SimpleExplanation;
  finalSummary: {
    netTotal: string;
    grossTotal: string;
    topImpactItems: string[];
    improvementTips: string;
  };
}

export type AnalysisStatus = 'idle' | 'extracting' | 'analyzing' | 'success' | 'error';