// components/CTA/CTACard.tsx
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button/Button';

export default function CTACard() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-brutalistLg border-2 border-black">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
        Fill out Form → Quick intake → Free consult.
      </h2>
      <h3 className="text-lg mb-8 text-center">
        First full session guaranteed, no charge if you choose not to move forward.
      </h3>
      <div className="text-center">
        <Button
          onClick={() => router.push('/book/trauma')}
          className="bg-tst-purple w-full sm:w-auto"
        >
          Book Your Free 15-min Consult
        </Button>
      </div>
    </div>
  );
}
