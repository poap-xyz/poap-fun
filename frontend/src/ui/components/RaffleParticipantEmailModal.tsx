import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import * as yup from 'yup';

// Components
import { Button } from 'ui/styled/antd/Button';

// Types
type ParticipantEmailProps = {
  onSuccess: (email: string) => void;
};

// Styled component
const ParticipantEmailModal = styled.div`
  h3 {
    text-align: center;
    font-size: 26px;
    font-family: var(--main-font);
    padding: 10px 0 5px;
  }
  .subtitle {
    text-align: center;
    font-weight: normal;
    padding: 20px;
  }
  .custom-input {
    text-align: center;
    padding-bottom: 20px;
    input {
      text-align: center;
      width: 275px;
      font-size: 16px;
      border: 1px solid var(--system-placeholder);
      border-radius: 3px;
      padding: 3px 10px;
    }
  }
  .submit {
    text-align: center;
    button {
      width: 150px;
    }
  }
  .error {
    text-align: center;
    color: var(--badge-error);
    margin: 0;
  }
`;

const RaffleParticipantEmailModal: FC<ParticipantEmailProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value);
  const handleSubmitClick = () => {
    if (email && yup.string().email().isValidSync(email)) {
      onSuccess(email);
    } else {
      setErrorMessage('Please enter a valid email address');
    }
  };

  return (
    <ParticipantEmailModal>
      <h3>Join the raffle</h3>
      <div className={'subtitle'}>Please enter an email to continue with the raffle registration</div>
      <div className={'submit'}>
        <div className={'custom-input'}>
          <input type={'email'} value={email} onChange={handleChange} />
          {errorMessage && <p className={'error'}>{errorMessage}</p>}
        </div>
        <Button type={'primary'} loading={false} onClick={handleSubmitClick}>
          Submit
        </Button>
      </div>
    </ParticipantEmailModal>
  );
};

export default RaffleParticipantEmailModal;
