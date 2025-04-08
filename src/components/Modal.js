import { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import { detailData } from "../data/detail-data"; // DATA customize

export default function ImageModal({ item, onClose }) {
  const [timelineIndex, setTimelineIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const modalRef = useRef(null);
  const contentRef = useRef(null);

  // Find the index of the current item in the timeline data
  useEffect(() => {

    if (item) {
      const index = detailData.findIndex((dataItem) => dataItem.id === item.id);
      setTimelineIndex(index >= 0 ? index : 0);
      setImageIndex(0); // Reset to first image when changing timeline items
    }
  }, [item]);

  // Get the current item from the timeline data
  const currentItem = detailData[timelineIndex];
  
  // Get the current image from the current item
  const currentImage = currentItem?.images?.[imageIndex];

  useEffect(() => {
    // Lock scroll when modal is open
    if (item) {
      document.body.style.overflow = "hidden";
    }

    // Handle click outside
    const handleClickOutside = (e) => {
      if (contentRef.current && !contentRef.current.contains(e.target)) {
        onClose();
      }
    };

    // Handle escape key
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        navigatePrev();
      } else if (e.key === "ArrowRight") {
        navigateNext();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [item, onClose, timelineIndex, imageIndex]);

  const navigateNext = () => {
    const currentItemImages = currentItem?.images || [];
    
   
    if (imageIndex < currentItemImages.length - 1) 
      
      setImageIndex(imageIndex + 1);

    // If there are multiple images for this item, first cycle through those

    // } else {
    //   // Move to next timeline item
    //   setTimelineIndex((prevIndex) => (prevIndex < detailData.length - 1 ? prevIndex + 1 : 0));
    //   setImageIndex(0); // Reset to first image
    // }

  };

  const navigatePrev = () => {
    // If we're not on the first image of the current item, go to previous image
    if (imageIndex > 0) {
      setImageIndex(imageIndex - 1);
    } else {
      // Move to previous timeline item
      const prevTimelineIndex = timelineIndex > 0 ? timelineIndex - 1 : detailData.length - 1;
      setTimelineIndex(prevTimelineIndex);
      
      // Set to last image of that item
      const prevItemImages = detailData[prevTimelineIndex]?.images || [];
      setImageIndex(prevItemImages.length - 1);
    }
  };

  const handleThumbnailClick = (index) => {
    setImageIndex(index);
  };

  if (!item || !currentItem || !currentImage) return null;

  // Total number of images across all items (for counter display)
  const totalImagesInCurrentItem = currentItem.images.length;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <div
        ref={contentRef}
        className="modal-content relative max-w-5xl w-[90%] max-h-[90vh] white rounded-lg overflow-hidden"
        style={{
          animation: "modalFadeIn 0.3s ease-out forwards",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <div className="relative aspect-video w-full">
          <img
            src={currentImage.src || "/placeholder.svg"}
            alt={currentImage.alt}
            className="object-contain w-full h-full"
            style={{
              transition: "opacity 0.3s ease-in-out",
            }}
          />

          {/* Carousel Navigation */}
          <button
            onClick={navigatePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={navigateNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>

          {/* Current Item Indicator */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {currentItem.images.map((_, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  imageIndex === index ? "bg-white w-4" : "bg-white/50"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Image thumbnails if multiple images exist */}
        {totalImagesInCurrentItem > 1 && (
          <div className="px-6 pt-4 overflow-x-auto">
            <div className="flex gap-2">
              {currentItem.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => handleThumbnailClick(idx)}
                  className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden ${
                    imageIndex === idx ? "ring-2 ring-white" : "opacity-70"
                  }`}
                >
                  <img
                    src={img.src}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-6">
          <div className="flex items-baseline gap-4 mb-2">
            <span className="text-3xl font-bold text-gray-300">{currentItem.year}</span>
            <h2 className="text-2xl font-bold">{currentItem.title}</h2>
          </div>
          <p className="text-gray-300">{currentItem.description}</p>

          <div className="mt-4 text-sm text-gray-400">
            <p>
              {/* Item {timelineIndex + 1} of {detailData.length} |  */}
              Image {imageIndex + 1} of {totalImagesInCurrentItem}
            </p>
            <p className="mt-1">Use arrow keys or buttons to navigate</p>
          </div>
        </div>
      </div>
    </div>
  );
}