'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Section from '@/components/Section/Section';
import FAQ from '@/components/FAQ/FAQ';
import {
  generalBookingFaqs,
  affirmingBookingFaqs,
  neurodivergentBookingFaqs,
  traumaBookingFaqs,
} from '@/data/bookingFaqData';
import {
  stepSection,
  meetYourTherapistBook,
  meetYourTherapistTrauma,
  meetYourTherapistND,
} from '@/data/bookData';
import {howItWorksSteps} from '@/data/pageData';
import HowItWorksSteps from '@/components/HowItWorksSteps/HowItWorksSteps';
import ProfileImage from '@/components/ProfileImage/ProfileImage';
import FallingPillsBookingPage from '@/components/FallingPills/FallingPillsBookingPage';
import TestimonialCardBooking from '@/components/TestimonialCardBooking/TestimonialCardBooking';
import { testimonials } from '@/data/bookData';
import Button from '@/components/Button/Button';
import Image from 'next/image';
import CountUp from '@/components/CountUp/CountUp';
import MiniHowItWorks from '@/components/MiniHowItWorks/MiniHowItWorks';
import { MoonStar } from 'lucide-react';
import BelowTheFold from '@/components/BelowTheFold/BelowTheFold';
import ContactForm from '@/components/Contact/ContactForm';

interface AdditionalContentProps {
  variant?: 'trauma' | 'affirming' | 'nd';
  pageUrl?: string;
}

const AdditionalContent: React.FC<AdditionalContentProps> = ({
  variant = 'trauma',
  pageUrl = '/book',
}) => {
  // Create individual refs for each step (copied exactly from HomePageClient)
  const step0Ref = useRef<HTMLDivElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);

  // Track which steps are in view using individual refs
  const step0InView = useInView(step0Ref, { once: true, amount: 0.5 });
  const step1InView = useInView(step1Ref, { once: true, amount: 0.5 });
  const step2InView = useInView(step2Ref, { once: true, amount: 0.5 });
  const step3InView = useInView(step3Ref, { once: true, amount: 0.5 });

  // Create array of step visibility states
  const stepInViewStates = [step0InView, step1InView, step2InView, step3InView];

  // Create array of refs for easy access in the map
  const stepRefs = [step0Ref, step1Ref, step2Ref, step3Ref];

  // Select FAQs based on variant
  const getFaqsForVariant = () => {
    const baseFaqs = generalBookingFaqs;
    switch (variant) {
      case 'affirming':
        return [...baseFaqs, ...affirmingBookingFaqs];
      case 'nd':
        return [...baseFaqs, ...neurodivergentBookingFaqs];
      case 'trauma':
      default:
        return [...baseFaqs, ...traumaBookingFaqs];
    }
  };

  // Select therapist intro based on variant
  const getTherapistIntroForVariant = () => {
    switch (variant) {
      case 'nd':
        return meetYourTherapistND;
      case 'trauma':
        return meetYourTherapistTrauma;
      case 'affirming':
      default:
        return meetYourTherapistBook;
    }
  };
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

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };
  return (
    <div className="lg:overflow-y-auto">
      <Section minHeight="400px">
        <motion.div
          className="grid md:grid-cols-2 gap-12 md:gap-16 items-center min-h-400"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.h2
            className="text-4xl md:hidden font-extrabold text-center leading-tight"
            variants={itemVariants}
          >
            {getTherapistIntroForVariant().title}
          </motion.h2>
          <div className="flex justify-center">
            <ProfileImage width={400} height={400} />
          </div>

          <motion.div
            className="flex flex-col gap-4"
            variants={containerVariants}
          >
            <motion.h2
              className="hidden md:block md:text-5xl font-extrabold leading-tight"
              variants={itemVariants}
            >
              {getTherapistIntroForVariant().title}
            </motion.h2>
            {getTherapistIntroForVariant().paragraphs.map((text, index) => (
              <motion.p
                key={index}
                className={`text-lg md:text-xl ${
                  index === 0
                    ? 'text-center md:text-left inline-block bg-tst-green px-4 py-2 rounded-full border-2 border-black shadow-brutalist font-bold w-fit max-w-17 mx-auto md:mx-0'
                    : 'text-center md:text-left'
                }`}
                variants={itemVariants}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            ))}
            {getTherapistIntroForVariant().quote && (
              <motion.blockquote
                className="text-lg md:text-xl font-medium italic text-gray-800 border-l-4 border-tst-teal pl-6 mt-6"
                variants={itemVariants}
              >
                "{getTherapistIntroForVariant().quote}"
              </motion.blockquote>
            )}
            <motion.div variants={itemVariants} className="relative">
              <div
                className="absolute left-0"
                style={{ marginLeft: '-22px' }}
              ></div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Focus Areas Banner */}
        <motion.div
          className="mt-16 mb-8 text-center"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            My areas of focus
          </h3>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            I specialize in creating affirming spaces for folks navigating these
            experiences
          </p>
        </motion.div>
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <FallingPillsBookingPage />
        </motion.div>
      </Section>
      <Section padding="none">
        <div className="mt-16">
          <CountUp />
        </div>
        {/* Testimonials */}
        <div className="flex flex-col sm:flex-row gap-6 mt-10">
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={itemVariants} className="flex-1">
              <TestimonialCardBooking
                quote={testimonial.quote}
                iconUrl={testimonial.iconUrl}
                bgColor={testimonial.bgColor}
                altText={testimonial.altText}
              />
            </motion.div>
          ))}
        </div>

        {/* Privacy note */}
        <div className="text-center mt-8">
          <p className="italic text-gray-600 text-sm md:text-base pb-10">
            Reflections paraphrased for privacy
          </p>
        </div>


        </Section>
         <div className="border-t-2 border-b-2 border-black">
        <Section className="bg-tst-yellow">
        <BelowTheFold />
      </Section>
      </div>
      <Section padding="none" paddingTop="large" paddingBottom="none" id="fit-free-works-section">
        <div className="text-center">
          <div className="max-w-4xl mx-auto px-4 mb-20">
            <h2
              className="text-3xl md:text-5xl font-extrabold mb-6 text-gray-900"
              dangerouslySetInnerHTML={{ __html: stepSection.title }}
            />
            
          </div>
          <div className="flex flex-col min-h-1000">
            {howItWorksSteps.map((step, index) => {
              const currentRef = stepRefs[index];
              const nextStepInView =
                index < howItWorksSteps.length - 1
                  ? stepInViewStates[index + 1]
                  : false;

              return (
                <div key={index} ref={currentRef}>
                  <HowItWorksSteps
                    step={step}
                    index={index}
                    isLastStep={step.isLastStep}
                    nextStepInView={nextStepInView}
                  />
                </div>
              );
            })}
          </div>
        </div>
        {/* Testimonials in horizontal row */}
      </Section>

      {/* Mini How It Works - Superbill Process */}
      <Section className="bg-tst-purple border-t-2 border-b-2 border-black">
        <MiniHowItWorks />

      </Section>
      <Section paddingBottom="large">
        <div className="h-120 mx-auto bg-white rounded-lg shadow-brutalistLg border-2 border-black p-8 overflow-hidden">
          <div className="grid md:grid-cols-2 md:gap-8 items-center h-full">
            <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left md:max-w-600 md:pl-4">
              <div className="flex flex-col items-center md:items-start mb-2 md:mb-10">
                <Image
                  src="https://pvbdrbaquwivhylsmagn.supabase.co/storage/v1/object/public/tst-assets/logo/tst-logo-long-baseline.svg"
                  alt="Tst Logo"
                  width={500}
                  height={500}
                  className="mb-4 md:mb-10"
                />

                <div>
                  <div className="max-w-12 bg-tst-teal text-xs font-medium px-3 py-1 rounded-full border-2 border-black shadow-brutalist">
                    <span className="flex items-center justify-center gap-2 text-sm md:text-base font-medium">
    <MoonStar />
    <span>Our mission</span>
  </span>
                  </div>

                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl md:text-5xl font-bold mt-4 leading-none">
                    A space where every <br />
                    part of you belongs
                  </h3>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    Everyone deserves care that feels grounded, affirming, and
                    free of judgment. In this space, your story is honored with
                    compassion and curiosity, so healing can unfold in ways that
                    truly fit your life.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Image
                src="https://pvbdrbaquwivhylsmagn.supabase.co/storage/v1/object/public/tst-assets/website%20assets/cho-cloud-hero-bean.webp"
                alt="Therapy illustration"
                width={600}
                height={600}
                className="w-full h-auto max-w-xl mx-auto"
                priority
              />
            </div>
          </div>
        </div>
      </Section>
      <Section className="bg-tst-green border-t-2 border-b-2 border-black">
        <motion.div
          className="max-w-6xl mx-auto"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Enhanced Header Section */}
          <motion.div
            className="text-center mb-12 md:mb-16"
            variants={itemVariants}
          >
            <div className="inline-block bg-tst-purple text-white px-6 py-3 rounded-full border-2 border-black shadow-brutalist mb-6">
              <span className="text-sm md:text-base font-bold uppercase tracking-wide">Take the first step</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Ready to start feeling better?
            </h2>
            <p className="text-lg md:text-xl text-gray-800 max-w-3xl mx-auto font-medium">
              Your healing journey begins with a single conversation. Let's connect and see how therapy can support you.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              className="flex flex-col items-center justify-center text-center space-y-8 h-full"
              variants={itemVariants}
            >
              <div className="relative w-full max-w-md mx-auto">
                <div className="relative bg-tst-yellow p-4 rounded-2xl border-2 border-black shadow-brutalist">
                  <Image
                    src="https://pvbdrbaquwivhylsmagn.supabase.co/storage/v1/object/public/tst-assets/website%20assets/Services%20Page%20Asset.svg"
                    alt="Services illustration"
                    width={400}
                    height={400}
                    className="w-full h-full max-w-xs mx-auto object-contain"
                  />
                </div>
              </div>

              {/* Trust indicators */}
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="bg-white p-4 rounded-xl border-2 border-black shadow-brutalist text-center">
                  <div className="text-2xl font-bold text-tst-purple">15 min</div>
                  <div className="text-sm font-medium">Free consultation</div>
                </div>
                <div className="bg-white p-4 rounded-xl border-2 border-black shadow-brutalist text-center">
                  <div className="text-2xl font-bold text-tst-teal">✓</div>
                  <div className="text-sm font-medium">Licensed therapist</div>
                </div>
              </div>
            </motion.div>

            {/* Right side - Enhanced Contact Form */}
            <motion.div
              className="flex flex-col justify-center"
              variants={itemVariants}
            >

                <ContactForm
                  variant={variant}
                  header="Let's connect"
                  subheader="Share your details and I'll reach out within 24 hours"
                />
            </motion.div>
          </div>
        </motion.div>
      </Section>
      <Section>
        <FAQ
          customFaqs={getFaqsForVariant()}
          pageUrl={pageUrl}
          className="py-8"
        />
      </Section>
    </div>
  );
};

export default AdditionalContent;
