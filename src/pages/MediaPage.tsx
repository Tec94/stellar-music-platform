import { useRef, useState } from 'react';
import { createMediaItemFromFile, useAppState } from '../context/AppStateContext';

export function MediaPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { media, addMedia, setMedia } = useAppState();
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    setStatus('Uploading...');

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const item = createMediaItemFromFile(file, dataUrl);
      addMedia(item);
      setStatus('Upload complete');
      event.target.value = '';
    };
    reader.onerror = () => {
      setError('Upload failed');
      setStatus('');
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setMedia([]);
    setStatus('Gallery cleared');
  };

  return (
    <section className="page" aria-labelledby="media-heading">
      <h2 id="media-heading">Media Uploads</h2>
      <div className="media__actions">
        <button type="button" onClick={handleUploadClick}>
          Upload Media
        </button>
        <button type="button" className="button--ghost" onClick={handleClear}>
          Clear Gallery
        </button>
        <input ref={fileInputRef} type="file" accept="image/*,video/*" hidden onChange={handleFiles} />
      </div>
      {status && <div role="status">{status}</div>}
      {error && <div role="alert">{error}</div>}

      <div className="media__grid">
        {media.map((item) => (
          <figure key={item.id}>
            {item.type === 'image' ? (
              <img src={item.src} alt={item.name.split('.')[0]} width={200} height={200} />
            ) : (
              <video controls width={240} height={160}>
                <source src={item.src} type="video/mp4" />
                {item.name}
              </video>
            )}
            <figcaption>{item.name}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
