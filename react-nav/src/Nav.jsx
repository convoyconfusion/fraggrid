import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'Contact', href: '/contact' },
];

const overlay = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const list = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: 16, transition: { duration: 0.2, ease: 'easeIn' } },
};

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="nav">
      <button className="menu-toggle" onClick={() => setOpen(o => !o)}>
        {open ? 'Close' : 'Menu'}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="menu-overlay"
            variants={overlay}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.ul className="menu-links" variants={list} initial="hidden" animate="visible" exit="exit">
              {links.map(({ label, href }) => (
                <motion.li key={href} variants={item}>
                  <a href={href}>{label}</a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
