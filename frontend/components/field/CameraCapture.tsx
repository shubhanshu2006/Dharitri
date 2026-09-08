"use client";

import { useState, useRef } from "react";
import { Card, CardContent, Button, Alert } from "@/components/ui";
import { Camera, X, Check, RotateCcw } from "lucide-react";
import { compressImage, validateImageFile } from "@/lib/offline/photo";
import { cn } from "@/lib/utils";

interface CameraCaptureProps {
  onCapture: (blob: Blob, preview: string) => void;
  onCancel?: () => void;
  className?: string;
}

export function CameraCapture({
  onCapture,
  onCancel,
  className,
}: CameraCaptureProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || "Invalid image");
      return;
    }

    try {
      setError("");
      
      // Compress image
      const compressedBlob = await compressImage(file);
      
      // Create preview
      const previewUrl = URL.createObjectURL(compressedBlob);
      
      setBlob(compressedBlob);
      setPreview(previewUrl);
    } catch (err) {
      setError("Failed to process image");
      console.error(err);
    }
  };

  const handleConfirm = () => {
    if (blob && preview) {
      onCapture(blob, preview);
      handleReset();
    }
  };

  const handleReset = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setBlob(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCancel = () => {
    handleReset();
    onCancel?.();
  };

  return (
    <Card className={className}>
      <CardContent className="p-4">
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        {!preview ? (
          // Camera/File Input - Large Touch Target
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
              id="camera-input"
            />
            <label htmlFor="camera-input" className="block">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-colors active:scale-[0.98]">
                <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Take Photo
                </p>
                <p className="text-sm text-gray-500">
                  Tap to open camera or select from gallery
                </p>
              </div>
            </label>

            {onCancel && (
              <Button
                variant="outline"
                onClick={handleCancel}
                className="w-full mt-4"
                style={{ minHeight: "48px" }}
              >
                Cancel
              </Button>
            )}
          </div>
        ) : (
          // Preview - Large Action Buttons
          <div>
            <div className="relative rounded-lg overflow-hidden mb-4">
              <img
                src={preview}
                alt="Captured"
                className="w-full h-auto"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Retake - Large Button */}
              <Button
                variant="outline"
                onClick={handleReset}
                className="h-14 flex flex-col items-center justify-center"
              >
                <RotateCcw className="h-6 w-6 mb-1" />
                <span className="text-xs">Retake</span>
              </Button>

              {/* Cancel - Large Button */}
              <Button
                variant="outline"
                onClick={handleCancel}
                className="h-14 flex flex-col items-center justify-center text-red-600 hover:text-red-700"
              >
                <X className="h-6 w-6 mb-1" />
                <span className="text-xs">Cancel</span>
              </Button>

              {/* Confirm - Large Button */}
              <Button
                onClick={handleConfirm}
                className="h-14 flex flex-col items-center justify-center bg-emerald-600 hover:bg-emerald-700"
              >
                <Check className="h-6 w-6 mb-1" />
                <span className="text-xs">Use Photo</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
