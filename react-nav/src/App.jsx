import Nav from './Nav';
import TestimonialCarousel from './TestimonialCarousel';
import BlobCursor from './BlobCursor';
import useReveal from './useReveal';
import './Nav.css';
import './TestimonialCarousel.css';

export default function App() {
  const hintRef = useReveal();
  const carouselRef = useReveal();
  return (
    <div style={{ position: 'relative' }}>
      <BlobCursor />
      <Nav />
      <main style={{ padding: '48px 24px', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', background: '#eef1f5', minHeight: '100vh' }}>
        <p ref={hintRef} className="reveal" style={{ color: '#5b6169', fontSize: '13px' }}>Click <strong>Menu</strong> to see the stagger animation. Hover the carousel to pause.</p>
        <div ref={carouselRef} className="reveal">
          <TestimonialCarousel />
        </div>
      </main>
    </div>
  );
}
