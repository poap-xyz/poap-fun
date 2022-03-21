import React from 'react';

// Hooks
import { useRaffle } from 'lib/hooks/useRaffle';

const ContactModal = ({ id }: { id: number }) => {
  const { data: raffle } = useRaffle({ id });

  return (
    <>
      <p>If you have won, please contact the raffle organizer at:</p>
      <p>
        <a href={`mailto:${raffle?.contact}`} target="_blank" rel="noopener noreferrer">
          {raffle?.contact}
        </a>
      </p>
      <p>
        If you want to send a proof that you're the address owner, you can sign a message{' '}
        <a href="https://mycrypto.com/sign-and-verify-message/sign" target="_blank" rel="noopener noreferrer">
          here
        </a>
      </p>
    </>
  );
};

export default ContactModal;
