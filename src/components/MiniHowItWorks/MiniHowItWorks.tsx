'use client';

import React, { useState, useEffect } from 'react';
import { HandCoins, ChevronLeft, ChevronRight } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description?: string;
}
interface MiniHowItWorksProps {
  steps?: Step[];
  className?: string;
}

const defaultSteps: Step[] = [
  {
    id: 1,
    title: 'First session is Fit-or-Free',
    description: `If it doesn't feel right, you don't pay, no superbill needed.`,
  },
  {
    id: 2,
    title: `If it's a fit, sessions are $150`,
    description: 'Paid sessions are eligible for a superbill.',
  },
  {
    id: 3,
    title: 'We send your superbill',
    description: 'You can receive one after each session or monthly.',
  },
  {
    id: 4,
    title: `You submit to your insurer's portal`,
    description: 'Most plans have an out-of-network submission process.',
  },
  {
    id: 5,
    title: 'Reimbursement (varies by plan)',
    description: 'Coverage depends on your out-of-network benefits.',
  },
];


const MiniHowItWorks: React.FC<MiniHowItWorksProps> = ({
  steps = defaultSteps,
  className = '',
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // Check if desktop and set up auto-progression for desktop only
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768); // md breakpoint
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);

    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Auto-progress only on desktop
  useEffect(() => {
    if (!isDesktop) return;

    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2000); // Change every 2 seconds

    return () => clearInterval(timer);
  }, [steps.length, isDesktop]);

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % steps.length);
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length);
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
      nextStep();
    } else if (isRightSwipe) {
      prevStep();
    }
  };

  const ArrowIcon = ({ className = '' }) => (
    <svg
      className={`w-6 h-6 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 5l7 7-7 7"
      />
    </svg>
  );

  return (
    <section className={className}>
      <div className=" md:bg-white md:border-2 md:border-black md:shadow-brutalist md:rounded-lg pt-8 mx-4 md:p-6 md:p-8">
        <div className="text-center mb-10">
          <div
            className={`max-w-18 inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black bg-tst-yellow shadow-brutalist mb-4 mx-auto`}
          >
            <span className="flex items-center justify-center gap-2 text-sm md:text-base font-medium">
              <HandCoins />
              <span>Insurance reimbursements</span>
            </span>
          </div>
          <h2 className="text-2xl md:text-5xl font-extrabold">
            How Superbills Work
          </h2>
          <p className="text-md md:text-xl">We make superbills easy</p>
        </div>

        {/* Desktop horizontal layout */}
        <div className="hidden md:block w-full">
          <div className="flex items-start justify-center gap-8 px-8">
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div className="w-48 text-center flex-shrink-0 flex flex-col items-center">
                  <div className={`flex items-center justify-center w-20 h-20 rounded-full border-4 border-black mb-4 md:mb-6 text-3xl font-bold shadow-brutalist ${idx === currentStep ? 'bg-tst-yellow' : 'bg-white'}`}>
                    {step.id}
                  </div>
                  <div className="min-h-32 flex flex-col items-center justify-start">
                    <h3 className="text-lg md:text-xl leading-snug font-bold text-black mb-2 text-center">
                      {step.title}
                    </h3>
                    {step.description && (
                      <p className="text-sm leading-snug text-gray-700 text-center">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>

                {idx < steps.length - 1 && (
                  <div className="flex-shrink-0 text-gray-600 self-start mt-10" aria-hidden="true">
                    <ArrowIcon />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden max-w-sm mx-auto px-4">
          <div className="relative">
            {/* Carousel content */}
            <div
              className="text-center py-8"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-black mb-6 text-2xl font-bold shadow-brutalist bg-tst-yellow">
                {steps[currentStep].id}
              </div>
              <h3 className="text-xl leading-snug font-bold text-black mb-4">
                {steps[currentStep].title}
              </h3>
              {steps[currentStep].description && (
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  {steps[currentStep].description}
                </p>
              )}

              {/* Step indicator dots */}
              <div className="flex justify-center gap-2 mb-6">
                {steps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStep(idx)}
                    className={`w-3 h-3 rounded-full border-2 border-black transition-colors ${
                      idx === currentStep ? 'bg-black' : 'bg-white'
                    }`}
                    aria-label={`Go to step ${idx + 1}`}
                  />
                ))}
              </div>

              <p className="text-sm text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>

            {/* Navigation arrows */}
            <button
              onClick={prevStep}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 p-2 rounded-full border-2 border-black bg-white shadow-brutalist hover:bg-gray-50 transition-colors"
              aria-label="Previous step"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={nextStep}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 p-2 rounded-full border-2 border-black bg-white shadow-brutalist hover:bg-gray-50 transition-colors"
              aria-label="Next step"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MiniHowItWorks;
