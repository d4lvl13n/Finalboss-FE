'use client';

import { useState } from 'react';
import { t } from '../lib/i18n';

interface SignupFormProps {
  /** Reported to the newsletter backend so signups can be attributed */
  source: string;
  placeholder?: string;
  buttonLabel?: string;
  onSuccess?: () => void;
}

/** Email signup. Shared by the footer, the home page and the in-article offer. */
export default function SignupForm({ source, placeholder, buttonLabel, onSuccess }: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      setEmail('');
      onSuccess?.();
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <p className="fb-signup-done" role="status">
        {t('newsletter.successMessage')}
      </p>
    );
  }

  return (
    <form className="fb-signup" onSubmit={handleSubmit}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder || t('footer.emailPlaceholder')}
        aria-label={placeholder || t('footer.emailPlaceholder')}
      />
      <button type="submit" className="fb-btn" disabled={status === 'submitting'}>
        {buttonLabel || t('footer.join')}
      </button>
      {status === 'error' && (
        <p className="fb-signup-error" role="alert">
          {t('newsletter.errorMessage') === 'newsletter.errorMessage' ? 'That did not go through. Try again.' : t('newsletter.errorMessage')}
        </p>
      )}
    </form>
  );
}
