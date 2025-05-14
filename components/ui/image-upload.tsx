"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface ImageUploadProps {
  onUpload: (urls: string[]) => void;
  multiple?: boolean;
  value?: string[];
}

export default function ImageUpload({
  onUpload,
  multiple = false,
  value = [],
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploading(true);
      setError(null);

      try {
        const uploadPromises = acceptedFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append(
            "upload_preset",
            process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
          );

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) throw new Error("Upload failed");

          const data = await response.json();
          return data.secure_url;
        });

        const urls = await Promise.all(uploadPromises);
        onUpload(multiple ? [...value, ...urls] : [urls[0]]);
      } catch (err) {
        console.error("Upload error:", err);
        setError("Failed to upload image(s)");
      } finally {
        setUploading(false);
      }
    },
    [multiple, onUpload, value]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    multiple,
  });

  const removeImage = (indexToRemove: number) => {
    onUpload(value.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-purple-500 bg-purple-500/10"
            : "border-zinc-700 hover:border-purple-500/50 hover:bg-zinc-800/50"
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <svg
            className="w-10 h-10 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {uploading ? (
            <p className="text-gray-400">Uploading...</p>
          ) : (
            <>
              <p className="text-gray-400">
                Drag & drop {multiple ? "images" : "an image"} here, or click to
                select
              </p>
              <p className="text-gray-500 text-sm">
                PNG, JPG, GIF or WEBP (max 10MB)
              </p>
            </>
          )}
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {value.map((url, index) => (
            <div key={url} className="relative group">
              <img
                src={url}
                alt={`Uploaded image ${index + 1}`}
                className="w-full h-40 object-cover rounded-lg"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 rounded-full bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
