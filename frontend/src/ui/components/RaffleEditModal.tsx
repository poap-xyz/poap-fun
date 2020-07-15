import React, { FC, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import InputMask from 'react-input-mask';

// Hooks
import { useRaffle } from 'lib/hooks/useRaffle';
import { useStateContext } from 'lib/hooks/useCustomState';

// Components
import { Button } from 'ui/styled/antd/Button';
import { useEditRaffle } from 'lib/hooks/useEditRaffle';

// Types
type EditProps = {
  id: number;
  onSuccess: () => void;
};

// Styled component
const EditModal = styled.div`
  h3 {
    text-align: center;
    font-size: 26px;
    font-family: var(--main-font);
    padding: 10px 0 5px;
  }
  .subtitle {
    text-align: center;
    font-weight: normal;
  }
  .custom-input {
    text-align: center;
    padding: 20px 0;
    input {
      text-align: center;
      width: 275px;
      letter-spacing: 10px;
      font-size: 50px;
      border: 1px solid var(--system-placeholder);
      border-radius: 3px;
      color: var(--tertiary-color);
    }
  }
  .submit {
    text-align: center;
    button {
      width: 150px;
    }
  }
`;

const RaffleEditModal: FC<EditProps> = ({ id, onSuccess }) => {
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

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => setToken(event.target.value);
  const handleSubmitClick = () => {
    if (raffle && token) {
      patchRaffle({ id: raffle.id, token }).then(onSuccess);
    }
  };

  if (!raffle) return <div />;

  return (
    <EditModal>
      <h3>{raffle.name}</h3>
      <div className={'subtitle'}>Please, enter the 6 digit code that was given at the raffle's creation</div>
      <div className={'custom-input'}>
        <InputMask mask={'999999'} maskChar={'_'} value={token} alwaysShowMask onChange={handleInput} />
      </div>
      <div className={'submit'}>
        <Button type={'primary'} loading={isLoading} onClick={handleSubmitClick}>
          Submit
        </Button>
      </div>
    </EditModal>
  );
};

export default RaffleEditModal;
