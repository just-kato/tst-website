'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './BelowTheFold.module.css';
import { symptomCards, heroContent } from '@/data/belowTheFoldData';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Animation variants for a staggered reveal effect
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

/**
 * This component renders the symptom cards section
 * using the same styling as therapy cards but with symptom-focused content
 */
const BelowTheFold = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % symptomCards.length);
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + symptomCards.length) % symptomCards.length);
  };

  // Minimum swipe distance for a valid swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextCard();
    } else if (isRightSwipe) {
      prevCard();
    }
  };

  return (
    <>
      <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-center pb-8">
        {heroContent.headline.title}
      </h2>

      {/* Desktop: Grid layout */}
      <motion.div
        className="hidden lg:grid lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {symptomCards.map(card => (
          <motion.div key={card.title} variants={itemVariants}>
            <div className={styles.wrapper}>
              <div className={styles.shadow}></div>
              <div className={`${styles.card}`} id={card.id}>
                <div className="p-6 flex flex-col h-full">
                  {/* Header section with emoji and title */}
                  <div className="mb-6 flex flex-col items-center">
                    <h3 className="text-2xl md:text-3xl font-bold text-center pb-4">
                      {card.title}
                    </h3>
                    <Image
                      src={card.imageLink}
                      alt={card.imageAlt}
                      width={100}
                      height={100}
                    />
                  </div>

                  {/* Tags for this specific card */}
                  <div className="flex flex-wrap gap-2 mb-6 justify-center">
                    {card.tags.map((tag, index) => (
                      <div
                        key={index}
                        className={`${card.tagBgColor || 'bg-tst-cream'} text-sm font-medium px-3 py-1 rounded-full border-2 border-black shadow-brutalist`}
                      >
                        {tag}
                      </div>
                    ))}
                  </div>

                  {/* Symptoms list - takes remaining space */}
                  <ul className="flex-grow space-y-3">
                    {card.symptoms.map((symptom, index) => (
                      <li
                        key={index}
                        className="text-lg opacity-90 flex items-start"
                      >
                        <span className="text-tst-purple mr-3 mt-1 flex-shrink-0">
                          →
                        </span>
                        <span className="leading-relaxed">{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Mobile: Carousel */}
      <div className="lg:hidden max-w-sm mx-auto px-4">
        <div className="relative">
          {/* Current card */}
          <motion.div
            key={currentCard}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className={styles.wrapper}>
              <div className={styles.shadow}></div>
              <div className={`${styles.card}`} id={symptomCards[currentCard].id}>
                <div className="p-6 flex flex-col h-full">
                  {/* Header section with emoji and title */}
                  <div className="mb-6 flex flex-col items-center">
                    <h3 className="text-2xl font-bold text-center pb-4">
                      {symptomCards[currentCard].title}
                    </h3>
                    <Image
                      src={symptomCards[currentCard].imageLink}
                      alt={symptomCards[currentCard].imageAlt}
                      width={80}
                      height={80}
                    />
                  </div>

                  {/* Tags for this specific card */}
                  <div className="flex flex-wrap gap-2 mb-6 justify-center">
                    {symptomCards[currentCard].tags.map((tag, index) => (
                      <div
                        key={index}
                        className={`${symptomCards[currentCard].tagBgColor || 'bg-tst-cream'} text-sm font-medium px-3 py-1 rounded-full border-2 border-black shadow-brutalist`}
                      >
                        {tag}
                      </div>
                    ))}
                  </div>

                  {/* Symptoms list - takes remaining space */}
                  <ul className="flex-grow space-y-3">
                    {symptomCards[currentCard].symptoms.map((symptom, index) => (
                      <li
                        key={index}
                        className="text-base opacity-90 flex items-start"
                      >
                        <span className="text-tst-purple mr-3 mt-1 flex-shrink-0">
                          →
                        </span>
                        <span className="leading-relaxed">{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation arrows container */}
          <div className="pt-8">
            <button
              onClick={prevCard}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 p-2 rounded-full border-2 border-black bg-white shadow-brutalist hover:bg-gray-50 transition-colors z-10"
              aria-label="Previous card"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={nextCard}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 p-2 rounded-full border-2 border-black bg-white shadow-brutalist hover:bg-gray-50 transition-colors z-10"
              aria-label="Next card"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {symptomCards.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentCard(idx)}
                className={`w-3 h-3 rounded-full border-2 border-black transition-colors ${
                  idx === currentCard ? 'bg-black' : 'bg-white'
                }`}
                aria-label={`Go to card ${idx + 1}`}
              />
            ))}
          </div>

          {/* Card counter */}
          <p className="text-center text-sm text-gray-500 mt-4">
            {currentCard + 1} of {symptomCards.length}
          </p>
        </div>
      </div>
    </>
  );
};

export default BelowTheFold;
