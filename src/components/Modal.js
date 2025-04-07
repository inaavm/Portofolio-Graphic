import { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import { detailData } from "../data/detail-data"; // DATA customize

export default function ImageModal({ item, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const modalRef = useRef(null);
  const contentRef = useRef(null);

  // Find the index of the current item in the timeline data
  useEffect(() => {
    if (item) {
      const index = detailData.findIndex((dataItem) => dataItem.id === item.id);
      setCurrentIndex(index >= 0 ? index : 0);
    }
  }, [item]);

  // Get the current item from the timeline data
  const currentItem = detailData[currentIndex];

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

    // Handle mouse wheel for navigation
    const handleWheel = (e) => {
      if (modalRef.current) {
        if (e.deltaY > 0) {
          // Scroll down/right - next image
          navigateNext();
        } else {
          // Scroll up/left - previous image
          navigatePrev();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    modalRef.current?.addEventListener("wheel", handleWheel);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      modalRef.current?.removeEventListener("wheel", handleWheel);
    };
  }, [item, onClose, currentIndex]);

  const navigateNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < detailData.length - 1 ? prevIndex + 1 : 0));
  };

  const navigatePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : detailData.length - 1));
  };

  if (!item || !currentItem) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <div
        ref={contentRef}
        className="modal-content relative max-w-5xl w-[90%] max-h-[90vh] bg-gray-900 rounded-lg overflow-hidden"
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
          {/* Use img tag with width/height instead of 'fill' */}
          <img
            src={currentItem.src || "/placeholder.svg"}
            alt={currentItem.alt}
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

          {/* Carousel Indicators */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {detailData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentIndex === index ? "bg-white w-4" : "bg-white/50"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-baseline gap-4 mb-2">
            <span className="text-3xl font-bold text-gray-300">{currentItem.year}</span>
            <h2 className="text-2xl font-bold">{currentItem.title}</h2>
          </div>
          <p className="text-gray-300">{currentItem.description}</p>

          <div className="mt-4 text-sm text-gray-400">
            <p>
              Image {currentIndex + 1} of {detailData.length}
            </p>
            <p className="mt-1">Use arrow keys, mouse wheel, or buttons to navigate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
