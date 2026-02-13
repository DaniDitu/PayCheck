import * as pdfjsLib from 'pdfjs-dist';

// Handle ESM default export interop for PDF.js
// When importing via esm.sh or similar CDNs, the actual library object is often on the 'default' property
// of the namespace import.
const pdfjs = (pdfjsLib as any).default || pdfjsLib;

// Define the worker source URL.
// We strictly use version 3.11.174 to match the import map.
// This version is more stable for direct browser usage without a bundler.
if (pdfjs.GlobalWorkerOptions) {
    pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
} else {
    console.error("GlobalWorkerOptions non trovato nell'oggetto PDF.js importato:", pdfjs);
}

export const extractTextFromPdf = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Zucchetti and other Italian payroll software often use custom font encodings.
    // We MUST provide cMapUrl and cMapPacked: true to correctly decode the text.
    // Without this, the extraction might result in empty squares or garbled text.
    const loadingTask = pdfjs.getDocument({ 
      data: arrayBuffer,
      cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
      cMapPacked: true,
    });

    const pdfDocument = await loadingTask.promise;
    
    let fullText = '';
    const numPages = pdfDocument.numPages;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Extract text items
      // Adding a space joins items naturally, but sometimes layout structure is lost.
      // This is usually fine for LLM analysis as long as the words are there.
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
        
      fullText += `--- Pagina ${pageNum} ---\n${pageText}\n\n`;
    }

    // Basic validation to ensure we actually got text, not just empty pages
    // (which happens if the PDF is an image scan or if CMaps failed).
    if (fullText.trim().length < 50) {
        throw new Error("Il testo estratto è troppo breve. Potrebbe essere una scansione (immagine) o un PDF protetto.");
    }

    return fullText;
  } catch (error: any) {
    console.error("Errore estrazione PDF:", error);
    
    if (error.name === 'MissingPDFException') {
        throw new Error("Il file PDF risulta mancante o corrotto.");
    }
    if (error.name === 'InvalidPDFException') {
        throw new Error("File non valido. Assicurati che sia un PDF corretto.");
    }
    if (error.name === 'PasswordException') {
        throw new Error("Il PDF è protetto da password. Rimuovi la password e riprova.");
    }
    if (error.message && error.message.includes("fake worker")) {
         throw new Error("Errore tecnico nel caricamento del motore PDF. Prova a ricaricare la pagina con CTRL+F5.");
    }

    throw new Error("Impossibile leggere il PDF. Assicurati che sia un documento digitale valido (non una scansione).");
  }
};