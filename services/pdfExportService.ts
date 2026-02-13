

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { AnalysisResult } from "../types";
import { APP_NAME } from "../constants";

// Helper per aggiungere testo con word-wrap sicuro e calcolo altezza preciso
const addWrappedText = (doc: jsPDF, text: string, x: number, y: number, maxWidth: number, fontSize: number, fontStyle: string = "normal", color: [number, number, number] = [0,0,0]): number => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", fontStyle);
    doc.setTextColor(color[0], color[1], color[2]);
    
    const lines = doc.splitTextToSize(text, maxWidth);
    // Altezza riga approssimativa (FontSize in pt -> mm conversion factor ~0.3527 * line height 1.15)
    const lineHeight = fontSize * 0.45; 
    doc.text(lines, x, y);
    
    return lines.length * lineHeight;
};

// Helper check page break
const checkPageBreak = (doc: jsPDF, currentY: number, neededHeight: number, margin: number): number => {
    const pageHeight = doc.internal.pageSize.height;
    if (currentY + neededHeight > pageHeight - margin) {
        doc.addPage();
        return 20; // Margin top nuova pagina
    }
    return currentY;
};

export const generateAnalysisPdf = (data: AnalysisResult) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 14;
  const contentWidth = pageWidth - (margin * 2);
  let finalY = 0;

  // --- Colori ---
  const primaryColor: [number, number, number] = [37, 99, 235]; 
  const secondaryColor: [number, number, number] = [71, 85, 105]; 

  // --- HEADER ---
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(APP_NAME, margin, 13);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const dateStr = new Date().toLocaleDateString('it-IT');
  doc.text(`Report generato il ${dateStr}`, pageWidth - margin, 13, { align: 'right' });

  // --- SUMMARY BOXES ---
  const summaryTop = 30;
  
  // Netto
  doc.setFillColor(220, 252, 231); 
  doc.setDrawColor(22, 163, 74);
  doc.roundedRect(margin, summaryTop, 60, 25, 2, 2, 'FD');
  doc.setTextColor(21, 128, 61);
  doc.setFontSize(10); doc.text("NETTO IN BUSTA", margin + 5, summaryTop + 8);
  doc.setFontSize(16); doc.setFont("helvetica", "bold"); doc.text(data.finalSummary.netTotal, margin + 5, summaryTop + 18);

  // Lordo
  doc.setFillColor(239, 246, 255); doc.setDrawColor(37, 99, 235);
  doc.roundedRect(margin + 65, summaryTop, 55, 25, 2, 2, 'FD');
  doc.setTextColor(30, 64, 175);
  doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.text("LORDO TOTALE", margin + 70, summaryTop + 8);
  doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.text(data.finalSummary.grossTotal, margin + 70, summaryTop + 18);

  // Trattenute
  doc.setFillColor(254, 242, 242); doc.setDrawColor(220, 38, 38);
  doc.roundedRect(margin + 125, summaryTop, 55, 25, 2, 2, 'FD');
  doc.setTextColor(153, 27, 27);
  doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.text(`TRATTENUTE (${data.calculations.deductionPercentage})`, margin + 130, summaryTop + 8);
  doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.text(data.calculations.totalDeductions, margin + 130, summaryTop + 18);

  finalY = summaryTop + 35;

  // --- DATI GENERALI ---
  doc.setFontSize(12); doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]); doc.setFont("helvetica", "bold");
  doc.text("Dati Generali", margin, finalY);
  
  const generalBody = [
    ["AZIENDA", data.generalData.employer || "-", "DIPENDENTE", data.generalData.employee || "-"],
    ["CONTRATTO", data.generalData.contractType || "-", "CCNL", data.generalData.ccnl || "-"],
    ["PERIODO", data.generalData.payPeriod || "-", "LIVELLO", data.generalData.level || "-"]
  ];

  autoTable(doc, {
    startY: finalY + 3,
    body: generalBody,
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 3, lineColor: [226, 232, 240] },
    columnStyles: { 
        0: { fontStyle: 'bold', fillColor: [241, 245, 249], cellWidth: 30 },
        1: { fontStyle: 'bold', cellWidth: 60 },
        2: { fontStyle: 'bold', fillColor: [241, 245, 249], cellWidth: 30 }
    }
  });

  finalY = (doc as any).lastAutoTable.finalY + 10;

  // --- SPIEGAZIONE SEMPLICE ---
  finalY = checkPageBreak(doc, finalY, 40, margin);
  doc.setFontSize(12); doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]); doc.setFont("helvetica", "bold");
  doc.text("In parole semplici", margin, finalY);
  finalY += 6;
  
  const summaryHeight = addWrappedText(doc, data.simpleExplanation.summary, margin, finalY, contentWidth, 10, "normal", [0,0,0]);
  finalY += summaryHeight + 6;

  data.simpleExplanation.keyTakeaways.forEach(point => {
      finalY = checkPageBreak(doc, finalY, 15, margin);
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.circle(margin + 2, finalY - 1.5, 1, 'F');
      const h = addWrappedText(doc, point, margin + 5, finalY, contentWidth - 5, 10, "normal", [50,50,50]);
      finalY += h + 3;
  });

  finalY += 8;

  // --- DETTAGLIO VOCI ---
  finalY = checkPageBreak(doc, finalY, 30, margin);
  doc.setFontSize(12); doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]); doc.setFont("helvetica", "bold");
  doc.text("Dettaglio Voci", margin, finalY);

  const tableBody = data.lineItems.map(item => [
    item.name,
    item.category,
    item.amount,
    `COS'È: ${item.explanation.whatIsIt}\nNOTE: ${item.explanation.notes}`
  ]);

  autoTable(doc, {
    startY: finalY + 3,
    head: [['Voce', 'Categoria', 'Importo', 'Spiegazione']],
    body: tableBody,
    theme: 'grid',
    headStyles: { fillColor: primaryColor, textColor: 255 },
    styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 }, 2: { halign: 'right', fontStyle: 'bold' } }
  });

  finalY = (doc as any).lastAutoTable.finalY + 10;

  // --- FERIE & PERMESSI ---
  finalY = checkPageBreak(doc, finalY, 40, margin);
  doc.setFontSize(12); doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]); doc.setFont("helvetica", "bold");
  doc.text("Ferie & Permessi", margin, finalY);

  const leaveBody = [
    ["FERIE", data.leaveAnalysis.vacation.unit, data.leaveAnalysis.vacation.balance],
    ["R.O.L.", data.leaveAnalysis.rol.unit, data.leaveAnalysis.rol.balance]
  ];

  autoTable(doc, {
    startY: finalY + 3,
    head: [['Tipo', 'Unità', 'Saldo Finale']],
    body: leaveBody,
    theme: 'striped',
    styles: { fontSize: 9, halign: 'center' },
    headStyles: { fillColor: secondaryColor }
  });
  
  finalY = (doc as any).lastAutoTable.finalY + 5;
  if(data.leaveAnalysis.humanExplanation) {
      const h = addWrappedText(doc, "Nota: " + data.leaveAnalysis.humanExplanation, margin, finalY, contentWidth, 9, "italic", [100,100,100]);
      finalY += h + 10;
  }

  // --- PENSIONI (Nuova Sezione Completa) ---
  finalY = checkPageBreak(doc, finalY, 60, margin);
  doc.setFontSize(12); doc.setTextColor(147, 51, 234); doc.setFont("helvetica", "bold");
  doc.text("Pensioni & Previdenza", margin, finalY);
  finalY += 7;

  // Box dati pensione
  doc.setFillColor(250, 245, 255); // Purple-50
  doc.setDrawColor(216, 180, 254);
  doc.roundedRect(margin, finalY, contentWidth, 25, 2, 2, 'FD');
  
  doc.setFontSize(10); doc.setTextColor(107, 33, 168); doc.setFont("helvetica", "bold");
  doc.text("DATA STIMATA PENSIONE:", margin + 5, finalY + 7);
  doc.setFontSize(14); doc.setTextColor(0,0,0);
  doc.text(data.pensionData.retireDateEstimate || "N/D", margin + 60, finalY + 7);
  
  doc.setFontSize(10); doc.setTextColor(107, 33, 168);
  doc.text("ANNI MANCANTI:", margin + 5, finalY + 18);
  doc.setFontSize(14); doc.setTextColor(0,0,0);
  doc.text(data.pensionData.yearsToRetire || "-", margin + 60, finalY + 18);

  finalY += 32;
  
  const hPens = addWrappedText(doc, `Sistema: ${data.pensionData.pensionSystem} - Imponibile: ${data.pensionData.contributionBase}\n${data.pensionData.notes}`, margin, finalY, contentWidth, 9, "normal", [50,50,50]);
  finalY += hPens + 10;

  // --- BONUS (Tabella) ---
  if(data.governmentBonuses && data.governmentBonuses.length > 0) {
      finalY = checkPageBreak(doc, finalY, 40, margin);
      doc.setFontSize(12); doc.setTextColor(245, 158, 11); doc.setFont("helvetica", "bold");
      doc.text("Bonus Governativi & Agevolazioni", margin, finalY);
      
      const bonusRows = data.governmentBonuses.map(b => [
          b.name, 
          b.status === 'active' ? 'ATTIVO' : b.status === 'potential' ? 'POTENZIALE' : 'NO', 
          b.description
      ]);

      autoTable(doc, {
          startY: finalY + 3,
          head: [['Bonus', 'Stato', 'Dettagli']],
          body: bonusRows,
          theme: 'grid',
          headStyles: { fillColor: [245, 158, 11] },
          styles: { fontSize: 8, cellPadding: 2 },
          columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 }, 1: { cellWidth: 25 } }
      });
      finalY = (doc as any).lastAutoTable.finalY + 10;
  }

  // --- WELFARE & OTTIMIZZAZIONE (Importante: Includere TUTTO) ---
  if(data.optimizationSuggestions && data.optimizationSuggestions.length > 0) {
      finalY = checkPageBreak(doc, finalY, 40, margin);
      doc.setFontSize(12); doc.setTextColor(16, 185, 129); doc.setFont("helvetica", "bold");
      doc.text("Piani Welfare & Ottimizzazione (CCNL)", margin, finalY);
      finalY += 5;

      data.optimizationSuggestions.forEach(opt => {
          // 1. Calcolo Altezza Preciso usando il context 'doc'
          doc.setFontSize(11); doc.setFont("helvetica", "bold");
          const titleLines = doc.splitTextToSize(opt.title, contentWidth - 10);
          
          doc.setFontSize(9); doc.setFont("helvetica", "normal");
          const descLines = doc.splitTextToSize(opt.description, contentWidth - 10);

          const titleH = titleLines.length * 5; 
          const descH = descLines.length * 4;
          const padding = 15;
          const impactH = 8;
          
          const needed = titleH + descH + impactH + padding;

          // 2. Check Break
          finalY = checkPageBreak(doc, finalY, needed, margin);

          // 3. Render Box
          doc.setFillColor(236, 253, 245); doc.setDrawColor(167, 243, 208);
          doc.roundedRect(margin, finalY, contentWidth, needed - 5, 2, 2, 'FD');

          // 4. Render Content
          doc.setTextColor(6, 95, 70); doc.setFontSize(11); doc.setFont("helvetica", "bold");
          doc.text(titleLines, margin + 5, finalY + 7);
          
          const titleOffset = titleLines.length * 5;
          doc.setTextColor(55, 65, 81); doc.setFontSize(9); doc.setFont("helvetica", "normal");
          doc.text(descLines, margin + 5, finalY + 7 + titleOffset);

          doc.setTextColor(5, 150, 105); doc.setFont("helvetica", "bold");
          const bottomY = finalY + needed - 10;
          doc.text(`IMPATTO STIMATO: ${opt.potentialImpact}`, margin + 5, bottomY);

          finalY += needed;
      });
  }

  // --- CHECKS ---
  const checks = data.consistencyChecks.filter(c => c.severity !== 'info');
  if(checks.length > 0) {
      finalY = checkPageBreak(doc, finalY, 40, margin);
      doc.setFontSize(12); doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]); doc.setFont("helvetica", "bold");
      doc.text("Anomalie Rilevate", margin, finalY);
      finalY += 5;

      checks.forEach(c => {
          const h = addWrappedText(doc, `[${c.severity.toUpperCase()}] ${c.message}`, margin, finalY, contentWidth, 9, "normal", [153, 27, 27]);
          finalY += h + 3;
      });
  }

  doc.save(`${APP_NAME.replace(/\s+/g, '_')}_Report_Completo.pdf`);
};
