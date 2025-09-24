'use client';

import React from 'react';
import { useInView } from 'framer-motion';
import Image from 'next/image';
import styles from './HowItWorksSteps.module.css';
import clsx from 'clsx';

interface HowItWorksStepsProps {
  step: {
    number: string;
    title: string;
    description: string;
    imageUrl: string;
    imageAlt: string;
    isLastStep: boolean;
  };
  index: number;
  isLastStep: boolean;
  nextStepInView?: boolean;
}

const HowItWorksSteps: React.FC<HowItWorksStepsProps> = ({
  step,
  index,
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const isEven = index % 2 === 0;

  const Card = () => (
    <div
      className={clsx(
        styles.content_item,
        isInView && styles.content_item_visible,
        styles.card_wrapper
      )}
      id={`step-${step.number}`} // Add step-specific ID
    >
      <div className={styles.card_shadow} />
      <div className={styles.card}>
        <div className={styles.number}>{step.number}</div>
        <h3 className="text-2xl font-bold mt-2 mb-4">{step.title}</h3>

        {/* Updated to handle array of descriptions */}
        <ul className="space-y-2">

              <span className="leading-relaxed">{step.description}</span>

        </ul>
      </div>
    </div>
  );

  const Img = () => (
    <div
      className={clsx(
        styles.content_item,
        isInView && styles.content_item_visible
      )}
    >
      <div className={styles.image_wrapper}>
        <Image
          src={step.imageUrl}
          alt={step.imageAlt}
          width={300}
          height={300}
          sizes="(max-width: 768px) 300px, 350px"
          style={{
            objectFit: 'contain',
            width: '100%',
            height: 'auto',
            maxHeight: '300px',
          }}
          priority={index === 0}
        />
      </div>
    </div>
  );

  return (
    <div ref={ref} className={styles.step_wrapper}>
      <div className="md:hidden flex flex-col items-center gap-8">
        <Img />
        <Card />
      </div>

      <div className="hidden md:flex">
        <div className="flex-1 flex items-center justify-center gap-8">
          {isEven ? <Img /> : <Card />}
        </div>

        <div className={styles.timeline}>
          {!step.isLastStep && (
            <div className={styles.timeline_line} />
          )}
          <div
            className={clsx(
              styles.timeline_dot,
              isInView && styles.timeline_dot_visible
            )}
          />
        </div>

        <div className="flex-1 flex items-center justify-center">
          {isEven ? <Card /> : <Img />}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSteps;
