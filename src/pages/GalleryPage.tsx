import { useRef, useState } from 'react';
import { useAppState } from '../context/AppStateContext';
import { useFocusTrap } from '../hooks/useFocusTrap';

export function GalleryPage() {
  const { media } = useAppState();
  const [filter, setFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);

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

  const previousImage = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  };

  useFocusTrap(lightboxIndex !== null, lightboxRef, { onClose: closeLightbox });

  const formatMediaName = (name: string) =>
    name
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim() || name;

  const currentItem = lightboxIndex !== null ? filteredMedia[lightboxIndex] : null;
  const currentItemName = currentItem ? formatMediaName(currentItem.name) : '';
  const lightboxTitleId = currentItem ? `lightbox-title-${currentItem.id}` : undefined;
  const lightboxDescriptionId = currentItem ? `lightbox-description-${currentItem.id}` : undefined;
  const totalItems = filteredMedia.length;

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

      <ul className="gallery__grid" aria-label="Media gallery">
        {filteredMedia.map((item, index) => {
          const accessibleName = formatMediaName(item.name);
          return (
            <li key={item.id}>
              <button
                type="button"
                className="gallery__item"
                onClick={() => openLightbox(index)}
                aria-label={`View ${accessibleName} ${item.type}`}
              >
                {item.type === 'image' ? (
                  <img src={item.src} alt={accessibleName} width={200} height={200} className="gallery__media" />
                ) : (
                  <video
                    width={200}
                    height={150}
                    className="gallery__media"
                    aria-hidden="true"
                    tabIndex={-1}
                    muted
                    playsInline
                  >
                    <source src={item.src} />
                    {accessibleName}
                  </video>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {lightboxIndex !== null && currentItem && (
        <div role="presentation" className="lightbox" onClick={closeLightbox}>
          <div
            ref={lightboxRef}
            className="lightbox__content"
            role="dialog"
            aria-modal="true"
            aria-labelledby={lightboxTitleId}
            aria-describedby={lightboxDescriptionId}
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id={lightboxTitleId} className="visually-hidden">
              {currentItem.type === 'image' ? 'Image' : 'Video'} Viewer
            </h3>
            {currentItem.type === 'image' ? (
              <img
                data-testid="lightbox-image"
                src={currentItem.src}
                alt={currentItemName}
                className="lightbox__media"
              />
            ) : (
              <video
                data-testid="lightbox-media"
                className="lightbox__media"
                controls
                aria-label={`${currentItemName} video`}
              >
                <source src={currentItem.src} />
                {`Video of ${currentItemName}`}
              </video>
            )}
            <p id={lightboxDescriptionId} className="visually-hidden">
              Viewing {currentItem.type}: {currentItemName}. Item {lightboxIndex + 1} of {totalItems}.
            </p>
            <div className="lightbox__actions">
              <button
                type="button"
                onClick={previousImage}
                disabled={lightboxIndex === 0}
                aria-label="View previous item"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={nextImage}
                disabled={lightboxIndex === filteredMedia.length - 1}
                aria-label="View next item"
              >
                Next
              </button>
              <button type="button" onClick={closeLightbox} className="button--ghost" aria-label="Close lightbox">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
