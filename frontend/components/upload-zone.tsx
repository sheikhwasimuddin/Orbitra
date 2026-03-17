"use client";

import { useState, useCallback } from "react";
import { Upload, X, FileImage, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "./glass-card";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  label?: string;
  description?: string;
  className?: string;
}

export function UploadZone({ onFileSelect, accept = "image/*", label = "Upload Image", description = "Drop your satellite snapshot here", className }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    }
  }, []);

  const handleFile = (file: File) => {
    onFileSelect(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={cn("w-full", className)}>
      <GlassCard 
        className={cn(
          "relative border-dashed border-2 transition-all duration-300 group cursor-pointer",
          isDragging ? "border-cyan-500 bg-cyan-500/5" : "border-white/10 hover:border-white/20",
          preview ? "p-4" : "p-12"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          className="absolute inset-0 opacity-0 cursor-pointer" 
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          accept={accept}
        />
        
        {preview ? (
          <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10">
            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <Upload className="text-white" size={32} />
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setPreview(null); }}
              className="absolute top-2 right-2 p-1 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 text-slate-400 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition-all">
              <Upload size={32} />
            </div>
            <div>
              <p className="text-lg font-bold text-white">{label}</p>
              <p className="text-sm text-slate-500 mt-1">{description}</p>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
