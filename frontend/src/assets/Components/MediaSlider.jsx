import React, { useEffect, useMemo, useRef, useState } from 'react';

const MediaSlider = ({ items = [], interval = 5000, heightClass, containerClassName }) => {
  const [index, setIndex] = useState(0);
  const containerRef = useRef(null);
  const videoRefs = useRef([]);

  const safeItems = useMemo(() => items.filter(Boolean), [items]);

  useEffect(() => {
    if (!safeItems.length) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % safeItems.length);
    }, interval);
    return () => clearInterval(id);
  }, [safeItems.length, interval]);

  useEffect(() => {
    const video = videoRefs.current[index];
    if (video && video.play) {
      const play = () => {
        video.muted = true;
        video.play().catch(() => {});
      };
      if (video.readyState >= 2) play();
      else video.addEventListener('canplay', play, { once: true });
    }
  }, [index]);

  useEffect(() => {
    const videos = videoRefs.current;
    videos.forEach((v) => {
      if (v) {
        v.muted = true;
        v.play().catch(() => {});
      }
    });
  }, []);

  const goTo = (i) => {
    if (!safeItems.length) return;
    setIndex(((i % safeItems.length) + safeItems.length) % safeItems.length);
  };

  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);

  return (
    <div className="w-full">
      <div className={containerClassName || "relative overflow-hidden rounded-2xl shadow-lg"}>
        <div
          ref={containerRef}
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {safeItems.map((item, i) => (
            <div
              key={i}
              className={`min-w-full ${
                heightClass || 'h-[280px] sm:h-[360px] md:h-[440px] lg:h-[520px]'
              } bg-black flex items-center justify-center`}
            >
              {item.type === 'video' ? (
                <video
                  ref={(el) => (videoRefs.current[i] = el)}
                  src={item.src}
                  className="w-full h-full object-cover"
                  muted
                  defaultMuted
                  playsInline
                  preload="metadata"
                  autoPlay
                  loop
                  controls={false}
                />
              ) : (
                <img src={item.src} alt={item.alt || ''} className="w-full h-full object-cover" />
              )}
            </div>
          ))}
        </div>

        {safeItems.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/70 hover:bg-white dark:hover:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-full w-10 h-10 grid place-items-center shadow-md"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/70 hover:bg-white dark:hover:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-full w-10 h-10 grid place-items-center shadow-md"
              aria-label="Next"
            >
              ›
            </button>

            <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-2">
              {safeItems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-2.5 rounded-full transition-all ${
                    i === index ? 'w-6 bg-white shadow' : 'w-2.5 bg-white/60'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MediaSlider;
