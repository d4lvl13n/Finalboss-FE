'use client';

import React, { useState } from 'react';
import { t } from '../../lib/i18n';
import { trackCompleteRegistration } from '../../lib/fbq';
import SignupForm from '../SignupForm';

interface InlineContentUpgradeProps {
  title: string;
  description: string;
  bonusContent: string;
  articleTopic?: string;
}

const InlineContentUpgrade: React.FC<InlineContentUpgradeProps> = ({
  title,
  description,
  bonusContent,
  articleTopic = 'this article',
}) => {
  const [done, setDone] = useState(false);
  const source = `Inline Content Upgrade - ${articleTopic}`;

  if (done) {
    return (
      <div className="fb-offer fb-offer-done" role="status">
        <h3>{t('leadCapture.inline.successTitle')}</h3>
        <p>{t('leadCapture.inline.successMessage', { bonus: bonusContent.toLowerCase() })}</p>
      </div>
    );
  }

  return (
    <div className="fb-offer">
      <h3>{title}</h3>
      <p>{description}</p>
      <p className="fb-offer-bonus">
        <strong>{t('leadCapture.inline.bonusLabel')}</strong> {bonusContent}
      </p>
      <SignupForm
        source={source}
        placeholder={t('leadCapture.inline.emailPlaceholder')}
        buttonLabel={t('leadCapture.inline.submit')}
        onSuccess={() => {
          trackCompleteRegistration(source);
          setDone(true);
        }}
      />
      <small>{t('leadCapture.inline.privacyNote')}</small>
    </div>
  );
};

export default InlineContentUpgrade;
