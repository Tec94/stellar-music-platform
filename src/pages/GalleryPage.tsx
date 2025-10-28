import { useState } from 'react';
import { useAppState } from '../context/AppStateContext';

export function GalleryPage() {
  const { media } = useAppState();
  const [filter, setFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredMedia =
    filter === 'all'
      ? media
      : media.filter((item) => (filter === 'images' ? item.type === 'image' : item.type === 'video'));

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = () => {
    if (lightboxIndex !== null && lightboxIndex < filteredMedia.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    }
  };

  return (
    <section className="page" aria-labelledby="gallery-heading">
      <h2 id="gallery-heading">Gallery</h2>
      <div className="gallery__filter">
        <label htmlFor="gallery-filter">Filter:</label>
        <select id="gallery-filter" value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="all">All</option>
          <option value="images">Images only</option>
          <option value="videos">Videos only</option>
        </select>
      </div>

      <div className="gallery__grid">
        {filteredMedia.map((item, index) => (
          <article
            key={item.id}
            aria-label={item.type === 'video' ? `video-${index}` : `image-${index}`}
            onClick={() => openLightbox(index)}
          >
            {item.type === 'image' ? (
              <img src={item.src} alt={item.name} width={200} height={200} />
            ) : (
              <video width={200} height={150}>
                <source src={item.src} />
                {item.name}
              </video>
            )}
          </article>
        ))}
      </div>

      {lightboxIndex !== null && filteredMedia[lightboxIndex] && (
        <div role="dialog" className="lightbox" onClick={closeLightbox} aria-modal="true">
          <img
            data-testid="lightbox-image"
            src={filteredMedia[lightboxIndex].src}
            alt={filteredMedia[lightboxIndex].name}
            onClick={(event) => event.stopPropagation()}
          />
          <button type="button" onClick={nextImage}>
            Next
          </button>
        </div>
      )}
    </section>
  );
}
