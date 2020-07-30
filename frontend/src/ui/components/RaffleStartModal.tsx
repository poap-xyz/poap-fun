import React, { FC, useState, useEffect } from 'react';
import moment from 'moment-timezone';
import styled from '@emotion/styled';

// Hooks
import { useRaffle } from 'lib/hooks/useRaffle';
import { useStateContext } from 'lib/hooks/useCustomState';

// Helpers
import { mergeRaffleDatetime } from 'lib/helpers/api';

// Components
import { Button } from 'ui/styled/antd/Button';
import { useEditRaffle } from 'lib/hooks/useEditRaffle';

// Types
type StartProps = {
  id: number;
  onSuccess: () => void;
  hideModal: () => void;
  alert: boolean;
};

// Styled component
const StartModal = styled.div`
  h3 {
    text-align: center;
    font-size: 26px;
    font-family: var(--main-font);
    padding: 10px 0 5px;
  }
  p {
    text-align: center;
  }
  .submit {
    text-align: center;
    button {
      width: 100px;
    }
  }
`;

const RaffleStartModal: FC<StartProps> = ({ id, onSuccess, alert, hideModal }) => {
  const [token, setToken] = useState<string | undefined>('');
  // query hooks
  const { rafflesInfo } = useStateContext();
  const { data: raffle } = useRaffle({ id });
  const [patchRaffle, { isLoading }] = useEditRaffle();

  useEffect(() => {
    if (rafflesInfo[id]?.token) {
      setToken(rafflesInfo[id].token);
    }
  }, [rafflesInfo]); //eslint-disable-line

  const handleSubmitClick = () => {
    if (raffle && token) {
      const draw_datetime = mergeRaffleDatetime(moment(), moment());
      patchRaffle({ id: raffle.id, token, draw_datetime }).then(onSuccess);
      hideModal();
    }
  };

  if (!raffle) return <div />;

  return (
    <StartModal>
      <h3>{raffle.name}</h3>
      <div>
        <p>
          Do you want to start the raffle right now?
          <br />
          {alert && <b>There are no participants on this Raffle!</b>}
        </p>
      </div>
      <div className={'submit'}>
        <Button type={'primary'} loading={isLoading} onClick={handleSubmitClick}>
          Yes, start!
        </Button>
      </div>
    </StartModal>
  );
};

export default RaffleStartModal;
