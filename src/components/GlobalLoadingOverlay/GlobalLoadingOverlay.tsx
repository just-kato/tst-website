'use client';

import React from 'react';
import { LottiePlayer } from '@/components/LottiePlayer/LottiePlayer';
import { toastyTidbitsAnimation } from '@/data/animations';
import styles from './GlobalLoadingOverlay.module.css';

interface GlobalLoadingOverlayProps {
  isVisible: boolean;
}

const GlobalLoadingOverlay: React.FC<GlobalLoadingOverlayProps> = ({
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <div className={styles.animationContainer}>
          <LottiePlayer
            file={toastyTidbitsAnimation}
            width={200}
            height={200}
            alt=""
          />
        </div>
        <div className={styles.textContainer}>
          <span className={styles.loadingText}>Loading</span>
          <div className={styles.dots}>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoadingOverlay;