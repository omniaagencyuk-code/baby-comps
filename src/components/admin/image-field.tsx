'use client';

import { useEffect, useRef, useState } from 'react';

interface MediaItem {
  id: string;
  url: string;
  alt: string | null;
  filename: string | null;
  folder: string;
}

export function ImageField({
  name,
  label,
  defaultValue = '',
  folder = 'general',
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  folder?: string;
  hint?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', folder);
      const res = await fetch('/api/admin/media', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setValue(data.media.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <div className="flex items-start gap-3">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-black/10 bg-slate-50">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-ink/30">None</div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input
            id={name}
            name={name}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="https://… or upload / choose"
            className="input"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="btn-secondary px-3 py-1.5 text-xs"
            >
              {uploading ? 'Uploading…' : '⬆ Upload'}
            </button>
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="btn-secondary px-3 py-1.5 text-xs"
            >
              🖼 Library
            </button>
            {value && (
              <button
                type="button"
                onClick={() => setValue('')}
                className="btn-ghost px-3 py-1.5 text-xs text-red-500"
              >
                Remove
              </button>
            )}
          </div>
          {hint && <p className="text-xs text-ink/50">{hint}</p>}
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
          e.target.value = '';
        }}
      />

      {pickerOpen && (
        <MediaPicker
          onClose={() => setPickerOpen(false)}
          onSelect={(url) => {
            setValue(url);
            setPickerOpen(false);
          }}
        />
      )}
    </div>
  );
}

function MediaPicker({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (url: string) => void;
}) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/media')
      .then((r) => r.json())
      .then((d) => setMedia(d.media || []))
      .catch(() => setMedia([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Media library</h3>
          <button type="button" onClick={onClose} className="text-ink/50 hover:text-ink">
            ✕
          </button>
        </div>
        {loading ? (
          <p className="py-8 text-center text-sm text-ink/50">Loading…</p>
        ) : media.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink/50">
            No media yet. Use the Upload button to add images.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {media.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onSelect(m.url)}
                className="group overflow-hidden rounded-xl border border-black/10 hover:ring-2 hover:ring-brand-400"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.url} alt={m.alt ?? ''} className="aspect-square w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
