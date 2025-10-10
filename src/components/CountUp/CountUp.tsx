import { useRef } from 'react';
import CountUp from 'react-countup';
import { useInView } from 'framer-motion';

export default function ClientsCounter() {
  const counterRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(counterRef, { once: true, amount: 0.3 });

  return (
    <div ref={counterRef} className="text-center space-y-2">
      <p className="text-4xl md:text-5xl font-extrabold text-center w-full">
        Over{' '}
        <span className="text-tst-purple">
          {isInView ? (
            <CountUp end={200} duration={2.5} />
          ) : (
            <span>200</span>
          )}
        </span>{' '}
        clients <br />
        supported since 2018
      </p>
    </div>
  );
}
