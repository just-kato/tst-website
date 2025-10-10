'use client';

import React from 'react';
import { CircleCheck, Video, Brain, Heart, Rainbow, ReceiptText } from 'lucide-react';
import IconCircle from '@/components/IconCircle/IconCircle';
import { motion, Variants } from 'framer-motion';
import Button from "@/components/Button/Button";

interface BookingPageHeaderProps {
  variant: 'nd' | 'affirming' | 'trauma';
}

const TRUST_INDICATORS = [
  { text: 'Superbill Provided', icon: ReceiptText },
  { text: 'HSA/FSA Eligible', icon: CircleCheck },
  { text: 'Secure Telehealth', icon: Video },
  { text: 'Affirming Care', icon: Heart },
] as const;

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const getVariantContent = (variant: BookingPageHeaderProps['variant']) => {
  switch (variant) {
    case 'nd':
      return {
        headline: 'Therapy that fits your brain',
        icon: <Brain className="w-6 h-6" />,
        color: 'bg-purple-100 border-black text-purple-800',
        tagText: 'Neurodivergent-Friendly',
        subHeadline: 'Care that honors how you think, feel, and move through the world.',
      };
    case 'affirming':
      return {
        headline: 'All of you is welcome here',
        icon: <Rainbow className="w-6 h-6" />,
        color: 'bg-pink-100 border-black text-pink-800',
        tagText: 'LGBTQIA-Affirming',
        subHeadline: 'All of you is welcome here',
      };
    case 'trauma':
      return {
        headline: (
          <>
            Somatic Trauma Therapy <br className="hidden sm:block"/>That Honors Body and Mind
          </>
        ),
        icon: <Heart className="w-6 h-6" />,
        color: 'bg-blue-100 border-black text-blue-800',
        tagText: 'Trauma-Informed',
        subHeadline: 'Care that help your body and mind reconnect after trauma.',
      };
  }
};

const BookingPageHeader: React.FC<BookingPageHeaderProps> = ({ variant }) => {
  const content = getVariantContent(variant);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
 <Button
          className={`font-small md:font-medium text-sm md:text-base px-4 py-2 md:px-6 md:py-3 rounded-full ${content.color}`}
          variant="rounded-full"
          onClick={() => {
            const element = document.getElementById('fit-free-works-section');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          >
            <span className="flex items-center gap-2">
              {content.icon}
              <span>See The Process</span>
            </span>
          </Button>



        <motion.h1
          className="text-2.35 md:text-5xl font-extrabold leading-tight px-4"
          variants={itemVariants}
        >
          {content.headline}
        </motion.h1>
        <motion.h3
          className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed"
          variants={itemVariants}
        >
                              <span className="font-bold">{content.subHeadline} </span>
 <br className="hidden sm:block" />
          Licensed virtual therapy for Georgia adults.
          <span> Start with a </span>
          <span className="font-bold">free 15-minute consult </span>
          and see how the process works.
          {/* <br className=" sm:block" /> */}


        </motion.h3>
      </div>

      {/* Trust Strip */}
      <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:gap-2 md:items-center md:justify-center">
        {TRUST_INDICATORS.map((indicator, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center gap-2 md:flex-row md:gap-3"
          >
            <IconCircle
              icon={<indicator.icon className="w-4 h-4 sm:w-5 sm:h-5" />}
              size="xs"
              bgColor="bg-green-500"
            />
            <span className="font-medium whitespace-nowrap">
              {indicator.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingPageHeader;
