import React, { useState } from 'react';

export function CloudinaryUpload({ onUpload, label = "Product Image" }: { onUpload: (url: string) => void, label?: string }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'paradox');

      const response = await fetch('https://api.cloudinary.com/v1_1/df3pf5rhm/image/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Cloudinary upload failed');
      }

      const data = await response.json();
      onUpload(data.secure_url);
      setUploading(false);
    } catch (err: any) {
      setError(err.message || 'Error uploading file');
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium uppercase tracking-widest text-brand-white/60 mb-2">{label}</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-brand-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-none file:border file:border-brand-white/20 file:text-xs file:uppercase file:bg-transparent file:text-brand-white hover:file:bg-brand-black hover:file:text-white transition-all cursor-pointer"
      />
      {uploading && <p className="text-xs text-brand-gold mt-1">Processing...</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
