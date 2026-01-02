

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SubscribeModal from '../SubscribeModal';

// Mock fetch
global.fetch = jest.fn();

// Mock toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock framer-motion to avoid animation/runtime issues in jsdom
jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    __esModule: true,
    AnimatePresence: ({ children }: any) => <>{children}</>,
    motion: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
  };
});

// Mock LottiePlayer
jest.mock('@/components/LottiePlayer/LottiePlayer', () => ({
  LottiePlayer: () => <div data-testid="lottie" />,
}));

describe('SubscribeModal', () => {
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    onClose.mockClear();
  });

  it('does not render when closed', () => {
    render(<SubscribeModal isOpen={false} onClose={onClose} />);
    expect(screen.queryByText(/toasty\s*tidbits/i)).not.toBeInTheDocument();
  });

  it('renders when open', () => {
    render(<SubscribeModal isOpen={true} onClose={onClose} />);
    expect(screen.getByText(/toasty\s*tidbits/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your email/i)).toBeInTheDocument();
  });

  it('submits with honeypot empty by default', async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true }),
    });

    render(<SubscribeModal isOpen={true} onClose={onClose} />);

    await user.type(screen.getByPlaceholderText(/your email/i), 'test@example.com');
    await user.click(screen.getByRole('button', { name: /subscribe/i }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe('/api/newsletter/subscribe');
    expect(options).toEqual(
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const payload = JSON.parse(options.body);
    expect(payload).toEqual(
      expect.objectContaining({
        email: 'test@example.com',
        name: 'Newsletter Subscriber',
        honeypot: '',
      })
    );
  });

  it('includes honeypot value when filled (trap triggered)', async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true }),
    });

    const { container } = render(<SubscribeModal isOpen={true} onClose={onClose} />);

    await user.type(screen.getByPlaceholderText(/your email/i), 'test@example.com');

    // Honeypot field should exist (even if visually hidden)
    const honeypotInput = container.querySelector('input[name="company"]') as HTMLInputElement | null;
    expect(honeypotInput).toBeTruthy();

    await user.type(honeypotInput as HTMLInputElement, 'filled');

    await user.click(screen.getByRole('button', { name: /subscribe/i }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    const [, options] = (global.fetch as jest.Mock).mock.calls[0];
    const payload = JSON.parse(options.body);

    expect(payload.honeypot).toBe('filled');
  });

  it('shows toast error if email is missing', async () => {
    const user = userEvent.setup();
    const toast = require('react-hot-toast').default as any;

    render(<SubscribeModal isOpen={true} onClose={onClose} />);

    const form = screen.getByRole('button', { name: /subscribe/i }).closest('form');
    expect(form).toBeTruthy();
    fireEvent.submit(form as HTMLFormElement);

    expect(global.fetch).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('Please enter a valid email.');
  });
});
