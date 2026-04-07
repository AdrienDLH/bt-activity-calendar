"use client";

/**
 * IMAGE UPLOADER COMPONENT
 *
 * Drag-and-drop + click-to-browse image uploader.
 * Uploads directly to Supabase Storage in the `activity-images` bucket.
 *
 * REQUIREMENTS (enforced client-side before upload):
 * - Formats: JPG, PNG, WebP (GIF also accepted by file input)
 * - Max file size: 300KB (also enforced server-side by the Supabase bucket)
 * - Min dimensions: 500×500px (images don't have to be square — CSS handles the crop)
 *
 * PREVIEWS:
 * - Displayed as 1:1 square thumbnails via `aspect-square object-cover` CSS.
 *   The underlying file is stored and delivered uncropped at its original ratio.
 *
 * FEATURES:
 * - Drag-and-drop or click-to-browse
 * - Per-file validation with Sonner toast errors for rejected files
 * - Upload progress bar per file
 * - Image grid with hover-to-remove buttons
 * - Returns public URLs via the onChange callback
 *
 * STORAGE:
 * - Bucket: `activity-images`
 * - Path: `{hotelId}/{timestamp}-{random}.{ext}`
 */

import { useCallback, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";

// ── Validation constants ───────────────────────────────────────────────────────

/** 300KB in bytes — must match the Supabase bucket file_size_limit */
const MAX_FILE_BYTES = 300 * 1024;

/** Minimum width and height in pixels. Images don't have to be square. */
const MIN_DIMENSION_PX = 500;

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Reads the natural pixel dimensions of a File by loading it into a temporary
 * Image element. URL object is revoked immediately after load to free memory.
 */
function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image dimensions"));
    };
    img.src = url;
  });
}

/**
 * Validates a single file against all requirements.
 * Returns a human-readable error string, or null if the file is valid.
 */
async function validateFile(file: File): Promise<string | null> {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return `"${file.name}": unsupported format. Use JPG, PNG, or WebP.`;
  }

  if (file.size > MAX_FILE_BYTES) {
    const kb = (file.size / 1024).toFixed(0);
    return `"${file.name}": ${kb}KB exceeds the 300KB limit.`;
  }

  try {
    const { width, height } = await getImageDimensions(file);
    if (width < MIN_DIMENSION_PX || height < MIN_DIMENSION_PX) {
      return `"${file.name}": ${width}×${height}px — minimum is 500×500px.`;
    }
  } catch {
    return `"${file.name}": could not read image dimensions.`;
  }

  return null;
}

// ── Component ──────────────────────────────────────────────────────────────────

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  hotelId: string;
}

interface UploadingFile {
  name: string;
  progress: number; // 0–100, or -1 for upload error
}

export function ImageUploader({ value, onChange, hotelId }: ImageUploaderProps) {
  const supabase = createClient();
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState<UploadingFile[]>([]);

  // ── Upload Handler ─────────────────────────────────────────────────────────

  async function uploadFiles(files: File[]) {
    // Validate all files in parallel before starting any uploads.
    // Invalid files are rejected with a toast; valid ones proceed.
    const results = await Promise.all(
      files.map(async (file) => ({ file, error: await validateFile(file) }))
    );

    results
      .filter((r) => r.error)
      .forEach((r) => toast.error(r.error!));

    const validFiles = results.filter((r) => !r.error).map((r) => r.file);
    if (!validFiles.length) return;

    setUploading(validFiles.map((f) => ({ name: f.name, progress: 0 })));

    const newUrls: string[] = [];

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const ext = file.name.split(".").pop();
      const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const path = `${hotelId}/${uniqueName}`;

      setUploading((prev) =>
        prev.map((u, idx) => (idx === i ? { ...u, progress: 50 } : u))
      );

      const { data, error } = await supabase.storage
        .from("activity-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (error) {
        console.error("Upload error:", error.message);
        setUploading((prev) =>
          prev.map((u, idx) => (idx === i ? { ...u, progress: -1 } : u))
        );
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("activity-images")
        .getPublicUrl(data.path);

      newUrls.push(urlData.publicUrl);

      setUploading((prev) =>
        prev.map((u, idx) => (idx === i ? { ...u, progress: 100 } : u))
      );
    }

    onChange([...value, ...newUrls]);
    setTimeout(() => setUploading([]), 1500);
  }

  // ── Remove Image ───────────────────────────────────────────────────────────

  function removeImage(url: string) {
    onChange(value.filter((u) => u !== url));
  }

  // ── Drag & Drop Handlers ───────────────────────────────────────────────────

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      uploadFiles(Array.from(e.dataTransfer.files));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value, hotelId]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    uploadFiles(Array.from(e.target.files ?? []));
    e.target.value = ""; // Reset so the same file can be re-selected
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-3">

      {/* ── Drop Zone ──────────────────────────────────────────────── */}
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-2 p-8",
          "border-2 border-dashed cursor-pointer transition-colors duration-150",
          isDragging
            ? "border-luxury-gold bg-luxury-gold/5"
            : "border-border hover:border-luxury-gold/50 hover:bg-background/50"
        )}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={handleFileSelect}
          className="sr-only"
        />

        <div className="w-10 h-10 bg-luxury-gold/10 flex items-center justify-center">
          <Upload className="h-5 w-5 text-luxury-gold" />
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-[#153E35]">
            Drop images here or click to browse
          </p>
          {/* Requirements shown to the user — keep in sync with the constants above */}
          <p className="text-xs text-[#153E35] mt-1">
            JPG, PNG, WebP · min 500×500px · max 300KB
          </p>
        </div>
      </label>

      {/* ── Upload Progress ─────────────────────────────────────────── */}
      {uploading.length > 0 && (
        <div className="space-y-2">
          {uploading.map((u) => (
            <div key={u.name} className="flex items-center gap-3 text-sm">
              <Loader2 className="h-3 w-3 animate-spin text-luxury-gold shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-[#153E35] truncate">
                    {u.name}
                  </span>
                  <span className="text-xs text-[#153E35] ml-2">
                    {u.progress === -1 ? "Failed" : `${u.progress}%`}
                  </span>
                </div>
                <div className="h-0.5 bg-border">
                  <div
                    className={cn(
                      "h-full transition-all duration-300",
                      u.progress === -1 ? "bg-destructive" : "bg-luxury-gold"
                    )}
                    style={{ width: `${Math.max(0, u.progress)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Image Previews ──────────────────────────────────────────────
           Thumbnails are always displayed as 1:1 squares (aspect-square +
           object-cover). The original file is stored uncropped — only the
           preview is visually squared off. This keeps the grid uniform
           regardless of the source image's actual aspect ratio.
      ─────────────────────────────────────────────────────────────────── */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {value.map((url) => (
            <div key={url} className="relative group aspect-square bg-muted">
              <Image
                src={url}
                alt="Activity image"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              />

              {/* Remove button — appears on hover */}
              <button
                type="button"
                onClick={() => removeImage(url)}
                className={cn(
                  "absolute top-1.5 right-1.5",
                  "w-6 h-6 bg-black/70 text-white flex items-center justify-center",
                  "opacity-0 group-hover:opacity-100 transition-opacity duration-150",
                  "hover:bg-destructive"
                )}
                aria-label="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {/* Empty slot — click to add more */}
          <button
            type="button"
            onClick={() =>
              (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()
            }
            className="aspect-square border-2 border-dashed border-border hover:border-luxury-gold/50 flex items-center justify-center transition-colors"
          >
            <ImageIcon className="h-5 w-5 text-[#153E35]" />
          </button>
        </div>
      )}
    </div>
  );
}
