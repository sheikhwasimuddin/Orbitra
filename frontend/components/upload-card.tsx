"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";

import { Card } from "@/components/ui/card";

type UploadCardProps = {
  title: string;
  description?: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
};

export function UploadCard({ title, description, multiple = false, onFiles }: UploadCardProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFiles(acceptedFiles);
      }
    },
    [onFiles],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/tiff": [".tif", ".tiff"],
    },
    multiple,
  });

  return (
    <Card
      {...getRootProps()}
      className="cursor-pointer border-dashed p-8 text-center transition hover:border-cyan-300/50 hover:bg-cyan-400/5"
    >
      <input {...getInputProps()} />
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-400/15">
        <UploadCloud className="h-6 w-6 text-cyan-200" />
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-300">
        {isDragActive ? "Drop files here..." : description ?? "Drag and drop JPG/PNG/TIF or click to browse"}
      </p>
      <p className="mt-3 text-xs text-slate-400">Maximum reliability path: TIFF, PNG, JPG.</p>
    </Card>
  );
}
