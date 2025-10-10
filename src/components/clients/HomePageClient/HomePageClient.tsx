'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Section from '@/components/Section/Section';
import TestimonialCard from '@/components/TestimonialCard/TestimonialCard';
import Image from 'next/image';
import Button from '@/components/Button/Button';
import CircleIcon from '@/components/CircleIcon/CircleIcon';
import BelowTheFold from '@/components/BelowTheFold/BelowTheFold';
import ProfileImage from '@/components/ProfileImage/ProfileImage';
import HoverLink from '@/components/HoverLink/HoverLink';
import { MapPinCheckInside, Video, Heart } from 'lucide-react';
import CTACard from '@/components/CTA/CTA';
import {
  socialProofIcons,
  testimonials,
  meetYourTherapist,
  howItWorksSteps,
} from '@/data/pageData';
import IconCircle from '@/components/IconCircle/IconCircle';

const TherapyCard = dynamic(
  () => import('@/components/TherapyCard/TherapyCard'),
  {
    loading: () => (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-200 rounded-lg h-64 border-2 border-black"
          ></div>
        ))}
      </div>
    ),
  }
);



const HowItWorksStep = dynamic(
  () => import('@/components/HowItWorksSteps/HowItWorksSteps'),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 rounded-lg h-48 border-2 border-black"></div>
    ),
  }
);

const LeadMagnet = dynamic(() => import('@/components/LeadMagnet/LeadMagnet'), {
  loading: () => (
    <div className="animate-pulse bg-gray-200 rounded-lg h-96 border-2 border-black"></div>
  ),
});

// Animation variants
const heroContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const heroItemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4 },
  },
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

export default function HomePageClient() {
  const howItWorksRef = useRef(null);

  // Create individual refs for each step
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

const TRUST_INDICATORS = [
  { text: 'Licensed in Georgia', icon: MapPinCheckInside },
  { text: 'Secure Telehealth', icon: Video },
  { text: 'Affirming Care', icon: Heart }
] as const;

  const router = useRouter();

  const handleBook = () => {
    router.push('/book/trauma');
  };

  const handleStepsScroll = (e: React.MouseEvent<HTMLButtonElement>) => {
     e.preventDefault();
    const contactForm = document.getElementById('how-it-works');
    if (contactForm) {
      contactForm.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <main>
      <Section className="pb-32" minHeight="100vh">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center min-h-500"
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="flex flex-col gap-4"
            variants={heroContainerVariants}
          >
            <motion.div variants={heroItemVariants} className="pb-4 md:pb-0">
              <Image
                src="https://pvbdrbaquwivhylsmagn.supabase.co/storage/v1/object/public/tst-assets/logo/tst-logo-long-baseline.svg"
                alt="Tst Logo"
                width={600}
                height={600}
              />
            </motion.div>
            <motion.h1
              className="text-4xl text-center md:text-left md:text-6xl font-extrabold leading-tight"
              variants={heroItemVariants}
            >
              Therapy that honors who you are
            </motion.h1>
            <motion.p className="text-md md:text-lg text-center md:text-left" variants={heroItemVariants}>
             Trauma‑informed, identity‑affirming virtual therapy for Georgia adults. Free 15‑minute consult. First full session is on us if it doesn’t feel right.
            </motion.p>

            <motion.div
              className="flex flex-col md:flex-row flex-wrap gap-4 pt-4 pb-4"
              variants={heroItemVariants}
            >
              <Button
                onClick={handleBook}
                className="bg-tst-yellow"
                id="book-a-call-btn"
              >
                Book Your Free 15-Minute Consult

              </Button>
              <Button
                onClick={handleStepsScroll}
                className="bg-white"
                id="download-free-guides-btn"
              >
                See How Getting Started Works
              </Button>
            </motion.div>
            <motion.div
              className="flex flex-row gap-4 flex-wrap justify-center md:justify-start"
              variants={heroItemVariants}
            >

              {TRUST_INDICATORS.map((indicator, index) => (
            <div key={index} className="flex items-center gap-3 ">
              <IconCircle
                icon={<indicator.icon className="w-4 h-4" />}
                size="xs"
                bgColor="bg-green-500"
              />
              <span className="font-medium ">{indicator.text}</span>
            </div>
          ))}
            </motion.div>
            <motion.div
              className="pt-6 flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-4"
              variants={heroItemVariants}
            >
              <div className="flex flex-shrink-0">
                {socialProofIcons.map((icon, index) => (
                  <CircleIcon
                    key={index}
                    size="sm"
                    bgColor={icon.bgColor}
                    iconUrl={icon.iconUrl}
                    altText={icon.altText}
                    wrapperClassName={icon.className}
                  />
                ))}
              </div>
              <p className="text-sm font-medium">
                <strong>Over 200 clients </strong> supported since 2018
                <br />
                You&apos;re not alone.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex items-center justify-center"
            variants={heroItemVariants}
          >
            <Image
              src="https://pvbdrbaquwivhylsmagn.supabase.co/storage/v1/object/public/tst-assets/website%20assets/cho-cloud-hero-bean.webp"
              alt="Therapy illustration"
              width={600}
              height={600}
              className="w-full h-auto max-w-xl mx-auto"
              priority
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-x-8 mt-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={itemVariants}>
              <TestimonialCard
                quote={testimonial.quote}
                iconUrl={testimonial.iconUrl}
                bgColor={testimonial.bgColor}
                altText={testimonial.altText}
              />
            </motion.div>
          ))}
        </motion.div>
        <motion.p
          className="text-center italic mt-16 max-w-2xl mx-auto"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          Reflections based on real client words, paraphrased with care for privacy.
        </motion.p>
      </Section>

      <div className="border-t-2 border-black">
        <Section className="bg-tst-yellow" minHeight="750px">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <BelowTheFold />
          </motion.div>
        </Section>
      </div>

      <div className="border-t-2 border-black">
        <LeadMagnet />
      </div>

      <div className="border-t-2 border-black">
        <Section className="bg-tst-purple" minHeight="1000px">
          <motion.div
            className="text-center mb-12"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold">
              Care that meets you where you are
            </h2>
          </motion.div>
          <TherapyCard />
        </Section>
      </div>

      <div>
        <Section minHeight="400px" className="border-t-2 border-black">
          <motion.div
            className="grid md:grid-cols-2 gap-12 md:gap-16 items-center min-h-400"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="flex justify-center">
              <ProfileImage />
            </div>

            <motion.div
              className="flex flex-col gap-4"
              variants={containerVariants}
            >
              <motion.h2
                className="text-5xl font-extrabold"
                variants={itemVariants}
              >
                {meetYourTherapist.title}
              </motion.h2>
              {meetYourTherapist.paragraphs.map((text, index) => (
                <motion.p
                  key={index}
                  className="text-lg"
                  variants={itemVariants}
                >
                  {text}
                </motion.p>
              ))}
              <motion.div variants={itemVariants} className="relative">
                <div
                  className="absolute left-0"
                  style={{ marginLeft: '-22px' }}
                >
                  <HoverLink
                    href="/about"
                    className="group gap-2 font-bold text-lg text-tst-purple"
                  >
                    <span>Read my full bio</span>
                  </HoverLink>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </Section>
      </div>

      <div ref={howItWorksRef} id="how-it-works">
        <Section minHeight="1000px">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold">
              What working together looks like
            </h2>
          </motion.div>
          <div className="flex flex-col min-h-1000">
            {howItWorksSteps.map((step, index) => {
              const currentRef = stepRefs[index];
              const nextStepInView =
                index < howItWorksSteps.length - 1
                  ? stepInViewStates[index + 1]
                  : false;

              return (
                <div key={index} ref={currentRef}>
                  <HowItWorksStep
                    step={step}
                    index={index}
                    isLastStep={step.isLastStep}
                    nextStepInView={nextStepInView}
                  />
                </div>
              );
            })}
          </div>
        </Section>
      </div>

      <Section>
        <CTACard />
      </Section>
    </main>
  );
}
