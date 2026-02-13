

import { Schema, Type } from "@google/genai";

export const APP_NAME = "Busta Paga Expert";

export const PAYSLIP_ANALYSIS_PROMPT = `
Agisci come un Esperto Consulente del Lavoro Senior e Previdenziale.
Il tuo compito è analizzare il testo grezzo di una busta paga e fornire un output STRETTAMENTE in formato JSON.

USA LA RICERCA GOOGLE (Google Search) per:
1. Verificare le normative fiscali e i BONUS GOVERNATIVI aggiornati ad OGGI (es. Taglio Cuneo Fiscale, Bonus Mamme, Fringe Benefit 2024/2025).
2. Stimare l'età pensionabile in base alle regole attuali (Legge Fornero e adeguamenti speranza di vita).
3. Trovare le opportunità di WELFARE previste specificamente dal CCNL rilevato (es. Metalmeccanici, Commercio, ecc.).

Segui queste linee guida operative:

1. **Analisi Voci (LineItems)**:
   - Spiega tecnicamente l'impatto fiscale e previdenziale.
   - Identifica chiaramente Anticipi Tredicesima o Bonus.

2. **Pensioni & Previdenza (PensionData)**:
   - Cerca la "Data Assunzione" o l'anzianità di servizio nel testo.
   - Stima la data di pensionamento (es. 67 anni età o 42 anni e 10 mesi contributi).
   - Verifica se ci sono trattenute per "Fondo Pensione Complementare" o "TFR a Fondo".
   - Specifica se il sistema è "Misto" (assunti pre-1996) o "Contributivo" (post-1996).

3. **Bonus Governativi (GovernmentBonuses)**:
   - Controlla se in busta ci sono voci relative al "Taglio Cuneo Fiscale" (es. Esonero IVS).
   - Controlla Bonus specifici (es. Bonus 100 euro / Ex-Renzi, Bonus Mamme).
   - Assegna lo status: 'active' (presente), 'potential' (spetterebbe ma manca), 'missed' (perso per reddito o altri motivi).

4. **Welfare & Ottimizzazione (OptimizationSuggestions)**:
   - Suggerisci piani welfare basati sul CCNL trovato (es. Metasalute, previdenza integrativa di categoria).
   - Proponi ottimizzazioni fiscali concrete (es. TFR in busta vs Fondo).

IMPORTANTE: Non rispondere con testo discorsivo fuori dal JSON. Restituisci SOLO il JSON valido.
`;

const leaveDetailsSchema = {
  type: Type.OBJECT,
  properties: {
    unit: { type: Type.STRING, description: "'Ore' o 'Giorni'" },
    previousBalance: { type: Type.STRING, description: "Residuo anno precedente" },
    accrued: { type: Type.STRING, description: "Maturato anno corrente" },
    taken: { type: Type.STRING, description: "Goduto" },
    balance: { type: Type.STRING, description: "Saldo finale" },
    isConsistent: { type: Type.BOOLEAN, description: "True se i conti tornano" },
    note: { type: Type.STRING, description: "Spiegazione amichevole" },
  },
  required: ["unit", "previousBalance", "accrued", "taken", "balance", "isConsistent", "note"],
};

export const ANALYSIS_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    generalData: {
      type: Type.OBJECT,
      properties: {
        employer: { type: Type.STRING },
        employee: { type: Type.STRING },
        payPeriod: { type: Type.STRING },
        contractType: { type: Type.STRING },
        ccnl: { type: Type.STRING },
        level: { type: Type.STRING },
      },
      required: ["employer", "employee", "payPeriod", "contractType", "ccnl", "level"],
    },
    leaveAnalysis: {
      type: Type.OBJECT,
      properties: {
        vacation: leaveDetailsSchema,
        rol: leaveDetailsSchema,
        humanExplanation: { type: Type.STRING },
      },
      required: ["vacation", "rol", "humanExplanation"],
    },
    lineItems: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          category: { type: Type.STRING },
          amount: { type: Type.STRING },
          explanation: {
            type: Type.OBJECT,
            properties: {
              whatIsIt: { type: Type.STRING },
              whyItExists: { type: Type.STRING },
              whoPays: { type: Type.STRING },
              impact: {
                type: Type.OBJECT,
                properties: {
                  gross: { type: Type.BOOLEAN },
                  net: { type: Type.BOOLEAN },
                  tfr: { type: Type.BOOLEAN },
                },
                required: ["gross", "net", "tfr"],
              },
              impactExplanation: { type: Type.STRING },
              notes: { type: Type.STRING },
            },
            required: ["whatIsIt", "whyItExists", "whoPays", "impact", "impactExplanation", "notes"],
          },
        },
        required: ["name", "category", "amount", "explanation"],
      },
    },
    pensionData: {
      type: Type.OBJECT,
      properties: {
        retireDateEstimate: { type: Type.STRING, description: "Stima anno pensione o 'N/D' se dati insuff." },
        yearsToRetire: { type: Type.STRING, description: "Anni mancanti stimati" },
        pensionSystem: { type: Type.STRING, description: "Es. 'Misto' o 'Contributivo'" },
        contributionBase: { type: Type.STRING, description: "Imponibile INPS del mese" },
        supplementaryPension: { type: Type.BOOLEAN, description: "True se rilevati fondi complementari" },
        notes: { type: Type.STRING, description: "Disclaimer sulla stima" }
      },
      required: ["retireDateEstimate", "yearsToRetire", "pensionSystem", "contributionBase", "supplementaryPension", "notes"]
    },
    governmentBonuses: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING },
            status: { type: Type.STRING, enum: ["active", "potential", "missed"] },
            description: { type: Type.STRING },
            amount: { type: Type.STRING },
            referenceLaw: { type: Type.STRING }
        },
        required: ["name", "status", "description", "referenceLaw"]
      }
    },
    calculations: {
      type: Type.OBJECT,
      properties: {
        grossHourlyRate: { type: Type.STRING },
        netHourlyRateEstimated: { type: Type.STRING },
        totalDeductions: { type: Type.STRING },
        deductionPercentage: { type: Type.STRING },
      },
      required: ["grossHourlyRate", "netHourlyRateEstimated", "totalDeductions", "deductionPercentage"],
    },
    consistencyChecks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          isConsistent: { type: Type.BOOLEAN },
          message: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ["info", "warning", "error"] },
          scientificExplanation: { type: Type.STRING },
          suggestedAction: { type: Type.STRING },
        },
        required: ["isConsistent", "message", "severity"],
      },
    },
    optimizationSuggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            potentialImpact: { type: Type.STRING }
        },
        required: ["title", "description", "potentialImpact"]
      }
    },
    simpleExplanation: {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING },
        keyTakeaways: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: ["summary", "keyTakeaways"],
    },
    finalSummary: {
      type: Type.OBJECT,
      properties: {
        netTotal: { type: Type.STRING },
        grossTotal: { type: Type.STRING },
        topImpactItems: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        improvementTips: { type: Type.STRING },
      },
      required: ["netTotal", "grossTotal", "topImpactItems", "improvementTips"],
    },
  },
  required: ["generalData", "leaveAnalysis", "lineItems", "pensionData", "governmentBonuses", "calculations", "consistencyChecks", "optimizationSuggestions", "simpleExplanation", "finalSummary"],
};