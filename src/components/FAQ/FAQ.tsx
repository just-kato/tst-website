'use client';

import React, { useState } from 'react';
import Script from 'next/script';
import { faqData } from '@/data/faqData';
import AccordionItem from './AccordionItem';

interface FAQProps {
  pageUrl?: string;
  customFaqs?: Array<{ question: string; answer: string }>;
  className?: string;
}

const FAQ = ({ pageUrl = '', customFaqs, className = '' }: FAQProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Use custom FAQs if provided, otherwise use default faqData
  const faqs = customFaqs || faqData;

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Generate FAQ Schema for better SEO
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `https://toastedsesametherapy.com${pageUrl}#faq`,
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, '') // Strip HTML for schema
      }
    }))
  };

  return (
    <>
      {/* FAQ Schema for SEO */}
      <Script
        id={`faq-schema${pageUrl.replace(/\//g, '-')}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <div className={`w-full max-w-4xl mx-auto ${className}`} id="faq">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8">
          Answers to common questions
        </h2>
        <div className="flex flex-col gap-4">
          {faqs.map((item, index) => (
            <AccordionItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default FAQ;
