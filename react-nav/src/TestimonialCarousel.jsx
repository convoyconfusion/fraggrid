import useReveal from './useReveal';

const testimonials = [
  { name: 'Alex Morgan', role: 'Product Designer', text: 'Absolutely transformed how our team collaborates. The workflow is seamless and intuitive.' },
  { name: 'Jamie Chen', role: 'Frontend Engineer', text: 'The DX is unmatched. I shipped features twice as fast after switching. No going back.' },
  { name: 'Priya Nair', role: 'Startup Founder', text: 'Went from zero to launch in three weeks. The tooling just gets out of your way.' },
  { name: 'Marcus Webb', role: 'Creative Director', text: 'Finally a product that respects both design and engineering. Rare combination.' },
  { name: 'Sofia Reyes', role: 'UX Researcher', text: 'Our user satisfaction scores jumped 40% in the first month. The results speak for themselves.' },
  { name: 'Dan Okafor', role: 'Tech Lead', text: 'Solid performance, great API, and the team ships updates constantly. Exactly what we needed.' },
];

function Card({ name, role, text }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="t-card reveal">
      <p className="t-text">"{text}"</p>
      <div className="t-author">
        <div className="t-avatar">{name[0]}</div>
        <div>
          <div className="t-name">{name}</div>
          <div className="t-role">{role}</div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialCarousel() {
  const items = [...testimonials, ...testimonials];

  return (
    <div className="t-marquee">
      <div className="t-track">
        {items.map((t, i) => (
          <Card key={i} {...t} />
        ))}
      </div>
    </div>
  );
}
