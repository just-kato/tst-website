import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '../ContactForm';

// Mock fetch
global.fetch = jest.fn();

// Mock window.scrollIntoView since it's not available in test environment
Element.prototype.scrollIntoView = jest.fn();

// Mock next/navigation router
const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

// Mock Botpoison
jest.mock('@botpoison/browser', () => {
  return jest.fn().mockImplementation(() => ({
    challenge: jest.fn().mockResolvedValue({ solution: 'bp-solution' }),
  }));
});

describe('ContactForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    pushMock.mockClear();
    process.env.NEXT_PUBLIC_BOTPOISON_SITE_KEY = 'test-site-key';
  });

  describe('Initial Render', () => {
    it('renders without crashing', () => {
      render(<ContactForm />);
      expect(document.body).toBeInTheDocument();
    });

    it('renders the form heading', () => {
      render(<ContactForm />);
      expect(screen.getByText(/let's connect/i)).toBeInTheDocument();
    });

    it('renders all required form fields', () => {
      render(<ContactForm />);

      expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Your email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Phone number')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('all form fields start empty', () => {
      render(<ContactForm />);

      expect(screen.getByPlaceholderText('Your name')).toHaveValue('');
      expect(screen.getByPlaceholderText('Your email')).toHaveValue('');
      expect(screen.getByPlaceholderText('Phone number')).toHaveValue('');
    });

    it('submit button is enabled initially', () => {
      render(<ContactForm />);
      expect(screen.getByRole('button', { name: /submit/i })).toBeEnabled();
    });
  });

  describe('Form Interaction', () => {
    it('allows user to type in all fields', async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const nameField = screen.getByPlaceholderText('Your name');
      const emailField = screen.getByPlaceholderText('Your email');
      const phoneField = screen.getByPlaceholderText('Phone number');

      await user.type(nameField, 'John Doe');
      await user.type(emailField, 'john@example.com');
      await user.type(phoneField, '555-123-4567');

      expect(nameField).toHaveValue('John Doe');
      expect(emailField).toHaveValue('john@example.com');
      expect(phoneField).toHaveValue('555-123-4567');
    });
  });

  describe('Form Submission - Payload + Honeypot', () => {
    it('submits form with valid data (honeypot empty by default)', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true }),
      });

      render(<ContactForm variant="contact" />);

      await user.type(screen.getByPlaceholderText('Your name'), 'Jane Smith');
      await user.type(screen.getByPlaceholderText('Your email'), 'jane@example.com');
      await user.type(screen.getByPlaceholderText('Phone number'), '555-987-6543');

      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

      const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
      expect(url).toBe('/api/contact');
      expect(options).toEqual(
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const payload = JSON.parse(options.body);

      expect(payload).toEqual(
        expect.objectContaining({
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '555-987-6543',
          variant: 'contact',
          honeypot: '',
          botpoison: 'bp-solution',
        })
      );

      expect(typeof payload.submissionTime).toBe('number');
      expect(payload.userAgent).toBeTruthy();

      expect(pushMock).toHaveBeenCalledWith('/thank-you');
    });

    it('includes honeypot value when the hidden field is filled', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true }),
      });

      const { container } = render(<ContactForm variant="contact" />);

      await user.type(screen.getByPlaceholderText('Your name'), 'Jane Smith');
      await user.type(screen.getByPlaceholderText('Your email'), 'jane@example.com');
      await user.type(screen.getByPlaceholderText('Phone number'), '555-987-6543');

      // Honeypot input (assumes you used name="company" in the form state)
      const honeypotInput = container.querySelector('input[name="company"]') as HTMLInputElement | null;
      expect(honeypotInput).toBeTruthy();

      await user.type(honeypotInput as HTMLInputElement, 'filled');

      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

      const [, options] = (global.fetch as jest.Mock).mock.calls[0];
      const payload = JSON.parse(options.body);

      expect(payload.honeypot).toBe('filled');
    });
  });

  describe('Form Submission - Error Cases', () => {
    it('shows error message on API failure', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue({ error: 'Something went wrong' }),
      });

      render(<ContactForm />);

      await user.type(screen.getByPlaceholderText('Your name'), 'Test User');
      await user.type(screen.getByPlaceholderText('Your email'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('Phone number'), '555-000-0000');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      });
    });

    it('handles network errors gracefully', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      render(<ContactForm />);

      await user.type(screen.getByPlaceholderText('Your name'), 'Test User');
      await user.type(screen.getByPlaceholderText('Your email'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('Phone number'), '555-000-0000');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('disables submit button while submitting', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: () => Promise.resolve({ success: true }),
                }),
              100
            )
          )
      );

      render(<ContactForm />);

      await user.type(screen.getByPlaceholderText('Your name'), 'Test User');
      await user.type(screen.getByPlaceholderText('Your email'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('Phone number'), '555-000-0000');

      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /processing/i });
        expect(button).toBeDisabled();
      });
    });

    it('shows \"Processing...\" text during submission', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: () => Promise.resolve({ success: true }),
                }),
              100
            )
          )
      );

      render(<ContactForm />);

      await user.type(screen.getByPlaceholderText('Your name'), 'Test User');
      await user.type(screen.getByPlaceholderText('Your email'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('Phone number'), '555-000-0000');

      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });
  });
});
