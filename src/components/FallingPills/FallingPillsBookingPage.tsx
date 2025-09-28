import React from 'react';
import styles from './FallingPillsBookingPage.module.css';
import { helpWithKeywords } from '@/data/servicesPageData';

const FallingPillsBookingPage = () => {
  // Keywords that should have yellow background
  const yellowKeywords = [
    'Trauma & CPTSD',
    'Neurodivergence Support',
    'LGBTQIA+ Affirming',
    'BIPOC Affirming',
    'Racial Stress & Trauma',
    'Autism Spectrum',
    'ADHD',
    'Identity Exploration',
    'Cultural Identity',
    'Anxiety & Overwhelm'
  ];

  const isYellowPill = (keyword: string) => {
    return yellowKeywords.includes(keyword);
  };

  return (
    <div className={styles.container}>
      <div className={styles.pills_wrapper}>
        {helpWithKeywords.map((keyword, index) => (
          <div
            key={keyword}
            className={styles.pill_wrapper}
            style={{ animationDelay: `${index * 0.07}s` }}
          >
            <div className={styles.shadow}></div>
            <div
              className={`${styles.pill} ${isYellowPill(keyword) ? styles.pillYellow : ''}`}
            >
              {keyword}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FallingPillsBookingPage;
