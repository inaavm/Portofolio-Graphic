import { useEffect, useRef, useState } from "react";

export default function Timeline({ item, index, scrollPosition, onImageClick }) {
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            // Only hide if we've scrolled back up past this item
            if (entry.boundingClientRect.top > 0) {
              setIsVisible(false);
            }
          }
        });
      },
      {
        threshold: 0.2, // 20% of the item must be visible
        rootMargin: "-10% 0px", // Trigger a bit before the item enters the viewport
      }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => {
      if (itemRef.current) {
        observer.unobserve(itemRef.current);
      }
    };
  }, []);

  // Calculate parallax effect based on scroll position
  const translateX = isVisible ? 0 : index % 2 === 0 ? -100 : 100;
  const opacity = isVisible ? 1 : 0;

  // Calculate a progress value for this item (0-1)
  // This creates a staggered effect where items appear at different scroll positions
  const itemProgress = Math.max(0, Math.min(1, (scrollPosition - index * 5) / 20));

  return (
    <div
      ref={itemRef}
      className="timeline-item min-h-screen flex items-center justify-center"
      style={{
        position: "relative",
        zIndex: index,
      }}
    >
      <div
        className="timeline-content max-w-5xl mx-auto p-6 flex flex-col md:flex-row items-center gap-8"
        style={{
          transform: `translateX(${isVisible ? 0 : translateX}px)`,
          opacity: opacity,
          transition: "transform 0.8s ease-out, opacity 0.8s ease-out",
        }}
      >
        <div
          className={`image-container w-full md:w-1/2 ${index % 2 === 0 ? "md:order-1" : "md:order-2"}`}
          style={{
            transform: `scale(${0.8 + itemProgress * 0.2})`,
            transition: "transform 0.5s ease-out",
          }}
        >
          <div
            className="relative aspect-video overflow-hidden rounded-lg cursor-pointer"
            onClick={() => onImageClick(item)}
            style={{
              transition: "transform 0.3s ease",
              transform: `scale(1)`,
              ":hover": {
                transform: `scale(1.02)`,
              },
            }}
          >
            <img
              src={item.src || "/placeholder.svg"}
              alt={item.alt}
              className="object-cover w-full h-full"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors flex items-center justify-center">
              <div className="bg-black/60 text-white px-4 py-2 rounded-full text-sm opacity-0 hover:opacity-100 transition-opacity">
                Click to expand
              </div>
            </div>
          </div>
        </div>

        <div
          className={`content w-full md:w-1/2 ${index % 2 === 0 ? "md:order-2" : "md:order-1"}`}
          style={{
            transform: `translateY(${isVisible ? 0 : 50}px)`,
            opacity: opacity,
            transition: "transform 0.8s ease-out 0.2s, opacity 0.8s ease-out 0.2s",
          }}
        >
          <div className="year text-5xl font-bold mb-4 text-gray-300">{item.year}</div>
          <h2 className="text-3xl font-bold mb-4">{item.title}</h2>
          <p className="text-lg text-gray-300">{item.description}</p>
        </div>
      </div>
    </div>
  );
}