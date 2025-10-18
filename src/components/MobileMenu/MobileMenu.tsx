'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface MobileMenuProps {
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onClose }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleBookConsultationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    setTimeout(() => {
      if (pathname === '/') {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
          contactForm.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        router.push('/#contact-form');
      }
    }, 200);
  };

  return (
    <motion.div
      initial={{ y: '-100%', opacity: 0 }}
      animate={{ y: '0%', opacity: 1 }}
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="fixed inset-0 bg-tst-cream lg:hidden z-40"
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-tst-cream" />

      {/* Menu content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-8">
        <div className="relative w-full max-w-md">
          {/* Shadow */}
          <div className="absolute inset-0 bg-black rounded-lg transform translate-x-2 translate-y-2"></div>

          {/* Menu card */}
          <div className="relative bg-tst-purple border-2 border-black rounded-lg p-8 shadow-brutalistLg">
            <ul className="flex flex-col items-center gap-8 text-xl font-bold text-center ">
              <li>
                <Link
                  href="/therapy-services"
                  onClick={onClose}
                  className="text-white hover:text-tst-yellow transition-colors"
                >
                  Therapy Services
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  onClick={onClose}
                  className="text-white hover:text-tst-yellow transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/mental-health-healing-blog"
                  onClick={onClose}
                  className="text-white hover:text-tst-yellow transition-colors"
                >
                  Toasted Insights Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/guides"
                  onClick={onClose}
                  className="text-white hover:text-tst-yellow transition-colors"
                >
                  Free Guides
                </Link>
              </li>
              <li>
                <a
                  href="/book/trauma"
                  onClick={onClose}
                  className="text-white hover:text-tst-yellow transition-colors"
                >
                  Book a Free 15-min Consultation
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MobileMenu;
