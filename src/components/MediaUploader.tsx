import { useRef, useState } from 'react';
import { validateMediaFile } from '../utils/validation';

export interface MediaUploaderProps {
  onUpload: (file: File) => Promise<{ url: string }>;
}

export function MediaUploader({ onUpload }: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    setStatus('');

    const validationResult = validateMediaFile({ name: file.name, size: file.size, type: file.type });
    if (!validationResult.valid) {
      setError(validationResult.error || 'Invalid file');
      inputRef.current?.value = '';
      return;
    }

    setUploading(true);
    try {
      const result = await onUpload(file);
      setStatus(`Uploaded: ${result.url}`);
      inputRef.current?.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div data-testid="media-uploader">
      <h2>Upload Media</h2>
      {error && <div role="alert">{error}</div>}
      {status && <div role="status">{status}</div>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileSelect}
        disabled={uploading}
        data-testid="file-input"
      />
    </div>
  );
}
