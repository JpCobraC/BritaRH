"use client";

import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  vagaTitle: string;
  vagaArea: string;
  vagaWorkplace?: string;
  vagaLink: string;
}

export default function QRCodeModal({
  isOpen,
  onClose,
  vagaTitle,
  vagaArea,
  vagaWorkplace,
  vagaLink,
}: QRCodeModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(vagaLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar o link: ", err);
    }
  };

  const handleDownload = () => {
    const canvas = document.getElementById("qr-code-canvas") as HTMLCanvasElement;
    if (canvas) {
      // Configurações de borda e padding
      const padding = 24;
      const borderThickness = 6;
      const borderRadius = 20;
      
      const size = canvas.width;
      const totalSize = size + padding * 2;
      
      // Criar um canvas temporário maior para acomodar a borda e o padding
      const borderCanvas = document.createElement("canvas");
      borderCanvas.width = totalSize;
      borderCanvas.height = totalSize;
      
      const ctx = borderCanvas.getContext("2d");
      if (ctx) {
        // 1. Fundo Branco
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, totalSize, totalSize);
        
        // 2. Desenhar o QR Code centralizado
        ctx.drawImage(canvas, padding, padding);
        
        // 3. Desenhar a borda externa arredondada elegante (cor primária do BritaRH: #2f7f33)
        const offset = borderThickness / 2 + 6; // Pequeno recuo para a borda respirar
        const x = offset;
        const y = offset;
        const w = totalSize - offset * 2;
        const h = totalSize - offset * 2;
        const r = borderRadius;
        
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        
        ctx.strokeStyle = "#2f7f33"; // Verde BritaRH
        ctx.lineWidth = borderThickness;
        ctx.stroke();
      }
      
      const pngUrl = borderCanvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      const formattedTitle = vagaTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      downloadLink.download = `qrcode-${formattedTitle}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#1a251b] border border-slate-100 dark:border-[#253326] rounded-3xl p-6 shadow-2xl z-10 transform transition-all duration-300 scale-100 animate-zoom-in">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="inline-flex items-center gap-1 bg-primary/10 dark:bg-green-500/10 text-primary dark:text-green-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-xs">share</span>
              Divulgar Vaga
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
              {vagaTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              {vagaArea}{vagaWorkplace ? ` · ${vagaWorkplace}` : ""}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="size-8 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-[#253326] transition-all"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* QR Code Frame */}
        <div className="flex flex-col items-center justify-center py-6 bg-slate-50 dark:bg-[#152016] rounded-2xl border border-slate-100 dark:border-[#253326]/50 mb-6">
          <div className="p-4 bg-white rounded-2xl shadow-inner border border-slate-100 dark:border-[#253326]">
            <QRCodeCanvas
              id="qr-code-canvas"
              value={vagaLink}
              size={180}
              bgColor="#ffffff"
              fgColor="#141e15"
              level="H"
              includeMargin={false}
            />
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-3 font-medium text-center max-w-[200px]">
            Aponte a câmera para o QR Code para acessar o link de candidatura
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCopyLink}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border transition-all duration-200 ${
              copied
                ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-950/20 dark:border-green-800 dark:text-green-400"
                : "bg-white border-slate-200 text-slate-700 hover:border-slate-350 dark:bg-[#1a251b] dark:border-[#253326] dark:text-slate-300 dark:hover:border-green-500/30"
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              {copied ? "check" : "content_copy"}
            </span>
            {copied ? "Copiado!" : "Copiar Link"}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 py-3 bg-primary text-white hover:bg-primary/95 text-sm font-bold rounded-xl transition-all duration-200 shadow-md shadow-primary/20 hover:scale-[1.02]"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            Baixar PNG
          </button>
        </div>

        {/* Link preview */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#253326] flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
          <span className="truncate max-w-[320px] block font-mono font-medium">
            {vagaLink}
          </span>
        </div>
      </div>
    </div>
  );
}
