
import { GoogleGenAI } from "@google/genai";
import { ANALYSIS_SCHEMA, PAYSLIP_ANALYSIS_PROMPT } from "../constants";
import { AnalysisResult } from "../types";

export const analyzePayslipWithGemini = async (pdfText: string): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key mancante.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Serializziamo lo schema per passarlo nel testo, dato che con i Tools attivi 
  // non possiamo usare responseSchema nella config (limitazione API).
  const schemaDescription = JSON.stringify(ANALYSIS_SCHEMA, null, 2);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
            role: 'user',
            parts: [
                { text: PAYSLIP_ANALYSIS_PROMPT },
                { text: `Ecco lo SCHEMA JSON che DEVI rispettare rigorosamente nel tuo output:\n\n${schemaDescription}` },
                { text: `Ecco il contenuto estratto dal PDF della busta paga:\n\n${pdfText}` }
            ]
        }
      ],
      config: {
        // ATTENZIONE: Quando si usa googleSearch, responseMimeType e responseSchema DEVONO essere rimossi.
        // L'output JSON è garantito dal prompt.
        temperature: 0.1,
        tools: [{ googleSearch: {} }] // Abilita ricerca web per Welfare aggiornato
      },
    });

    let textResponse = response.text;
    if (!textResponse) {
        throw new Error("Risposta vuota dall'AI.");
    }

    // --- ROBUST JSON PARSING STRATEGY ---
    let cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '');
    
    const firstBrace = cleanJson.indexOf('{');
    const lastBrace = cleanJson.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
        cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
    }

    try {
        const jsonResponse = JSON.parse(cleanJson) as AnalysisResult;
        return jsonResponse;
    } catch (parseError) {
        console.error("JSON Parse Error. Raw text:", textResponse);
        throw new Error("L'analisi ha prodotto un risultato non valido. Riprova, il documento potrebbe essere poco leggibile.");
    }

  } catch (error: any) {
    console.error("Gemini Analysis Critical Error:", error);
    throw new Error(error.message || "Errore durante l'elaborazione intelligente del documento.");
  }
};
