import { useState } from "react";
import { Images, X } from "lucide-react";

function TourGallery({ images = [] }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (images.length === 0) return null;

  return (
    <section className="td-section" id="tour-gallery">
      <h2>
        <Images size={23} />
        Hình ảnh các điểm đến nổi bật
      </h2>

      <div className="td-gallery-grid">
        {images.map((image) => (
          <figure className="td-gallery-item" key={image.id}>
            <button
              type="button"
              onClick={() => setSelectedImage(image)}
              aria-label={`Xem ảnh: ${
                image.alt_text || image.caption || "Tour"
              }`}
            >
              <img
                src={image.image_url}
                alt={
                  image.alt_text ||
                  image.caption ||
                  "Hình ảnh điểm đến"
                }
                loading="lazy"
              />
            </button>

            {image.caption && (
              <figcaption>{image.caption}</figcaption>
            )}
          </figure>
        ))}
      </div>

      {selectedImage && (
        <div
          className="td-lightbox"
          role="presentation"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="td-lightbox-content"
            role="dialog"
            aria-modal="true"
            aria-label="Xem hình ảnh Tour"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="td-lightbox-close"
              onClick={() => setSelectedImage(null)}
              aria-label="Đóng ảnh"
            >
              <X />
            </button>

            <img
              src={selectedImage.image_url}
              alt={
                selectedImage.alt_text ||
                selectedImage.caption ||
                "Hình ảnh Tour"
              }
            />

            {selectedImage.caption && (
              <p>{selectedImage.caption}</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default TourGallery;