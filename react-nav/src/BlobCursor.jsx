import { useEffect, useRef } from 'react';

export default function BlobCursor() {
  const blobRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let x = mouseX;
    let y = mouseY;
    let rafId;

    const onMove = e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      x += (mouseX - x) * 0.08;
      y += (mouseY - y) * 0.08;
      if (blobRef.current) {
        blobRef.current.style.transform = `translate(${x - 210}px, ${y - 210}px)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <div ref={blobRef} className="blur-shape follow" aria-hidden="true" />;
}
