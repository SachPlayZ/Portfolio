"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

type ImageUploadProps = {
  value?: string[];
  multiple?: boolean;
  onChange: (images: string[]) => void;
  label?: string;
};

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function ImageUpload({
  value = [],
  multiple = false,
  onChange,
  label = "Upload image",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadToCloudinary = async (file: File) => {
    if (!cloudName || !uploadPreset) {
      throw new Error("Missing Cloudinary env configuration");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return data.secure_url as string;
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploading(true);
      setError(null);
      try {
        const uploads = await Promise.all(
          acceptedFiles.map((file) => uploadToCloudinary(file))
        );
        onChange(multiple ? [...value, ...uploads] : uploads.slice(0, 1));
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Failed to upload image(s)"
        );
      } finally {
        setUploading(false);
      }
    },
    [multiple, onChange, value]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: { "image/*": [] },
  });

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-zinc-200">{label}</p>
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition ${
          isDragActive
            ? "border-purple-500 bg-purple-500/10"
            : "border-zinc-700 hover:border-purple-500/50 hover:bg-zinc-900"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-sm text-zinc-400">
          {uploading
            ? "Uploading..."
            : `Drag & drop ${multiple ? "images" : "an image"} or click to select`}
        </p>
        <p className="text-xs text-zinc-500">
          Supported formats: png, jpg, webp (max 10MB)
        </p>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {value.map((url, index) => (
            <div key={url} className="group relative overflow-hidden rounded-lg">
              <img
                src={url}
                alt={`upload-${index}`}
                className="h-32 w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute right-3 top-3 rounded-full bg-red-600/80 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

