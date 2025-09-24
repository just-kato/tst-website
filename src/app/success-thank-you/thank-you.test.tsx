import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock components
jest.mock('@/components/Section/Section', () => {
  return ({ children, className }: any) => <div className={className}>{children}</div>;
});

jest.mock('@/components/Button/Button', () => {
  return ({ children, className }: any) => <button className={className}>{children}</button>;
});

import ThankYouPage from './page';

describe('ThankYouPage', () => {
  it('renders thank you message for consultation booking', () => {
    const { getByText } = render(<ThankYouPage />);
    
    expect(getByText('Consultation Booked!')).toBeInTheDocument();
    expect(getByText('You\'re all set. We\'re excited to meet you.')).toBeInTheDocument();
  });

  it('displays next steps information', () => {
    const { getByText } = render(<ThankYouPage />);
    
    expect(getByText('What Happens Next')).toBeInTheDocument();
    expect(getByText('Check Your Email')).toBeInTheDocument();
    expect(getByText('Quick Check-In')).toBeInTheDocument();
    expect(getByText('Meet Your Therapist')).toBeInTheDocument();
  });

  it('includes navigation buttons', () => {
    const { getByText } = render(<ThankYouPage />);
    
    expect(getByText('Return Home')).toBeInTheDocument();
    expect(getByText('Learn More About Our Services')).toBeInTheDocument();
  });

  it('displays important reminders', () => {
    const { getByText } = render(<ThankYouPage />);
    
    expect(getByText('Important Reminders')).toBeInTheDocument();
    expect(getByText(/consultation is completely free/)).toBeInTheDocument();
    expect(getByText(/secure video link/)).toBeInTheDocument();
  });
});