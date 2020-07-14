import React, { FC, useState } from 'react';
import styled from '@emotion/styled';
import { FiClipboard } from 'react-icons/fi';
import { Tooltip } from 'antd';
import copy from 'copy-to-clipboard';

// Hooks
import { useRaffle } from 'lib/hooks/useRaffle';

// Components
import { Search } from 'ui/styled/antd/Input';
import { Form, Item } from 'ui/styled/antd/Form';

// Helpers
import { createRaffleLink } from 'lib/helpers/raffles';
import { isMobileOrTablet, objectToGetParams } from 'lib/helpers/utils';

// Assets
import Telegram from 'assets/img/share-telegram.svg';
import Twitter from 'assets/img/share-twitter.svg';
import Whatsapp from 'assets/img/share-whatsapp.svg';

// Types
type ShareProps = {
  id: number;
  hideModal: () => void;
};

// Styled component
const ShareModal = styled.div`
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
  .social-icons {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    padding-top: 20px;
    .icon {
      padding: 5px;
      img {
        width: 60px;
        &:hover {
          transform: scale(1.2);
        }
      }
    }
  }
  .copy {
    padding-top: 20px;
    .ant-form-item {
      margin: 0 !important;
    }
  }
`;

const RaffleShareContent: FC<ShareProps> = ({ id }) => {
  const originalCopy = 'Copy to clipboard';
  const [copyText, setCopyText] = useState<string>(originalCopy);
  // query hooks
  const { data: raffle } = useRaffle({ id });

  if (!raffle) return <div />;
  const link: string = createRaffleLink(raffle, false);
  const message = `Hey there! Checkout this raffle`;

  const telegramShare = (): string => {
    return (
      'https://telegram.me/share/' +
      objectToGetParams({
        url: link,
        text: message,
      })
    );
  };
  const twitterShare = (): string => {
    return (
      'https://twitter.com/share' +
      objectToGetParams({
        url: link,
        text: message,
        via: 'poapxyz',
      })
    );
  };
  const whatsAppShare = (): string => {
    return (
      'https://' +
      (isMobileOrTablet() ? 'api' : 'web') +
      '.whatsapp.com/send' +
      objectToGetParams({
        text: message + ` ${link}`,
      })
    );
  };

  const onCopy = (value: string) => {
    copy(link);
    setCopyText('Copied!');
    setTimeout(() => {
      setCopyText(originalCopy);
    }, 3000);
  };

  return (
    <ShareModal>
      <h3>{raffle.name}</h3>
      <div className={'subtitle'}>Spread the word!</div>
      <div className={'social-icons'}>
        <div className={'icon'}>
          <a href={telegramShare()} target={'_blank'} rel="noopener noreferrer">
            <img src={Telegram} alt={'Share by telegram'} />
          </a>
        </div>
        <div className={'icon'}>
          <a href={twitterShare()} target={'_blank'} rel="noopener noreferrer">
            <img src={Twitter} alt={'Tweet about it'} />
          </a>
        </div>
        <div className={'icon'}>
          <a href={whatsAppShare()} target={'_blank'} rel="noopener noreferrer">
            <img src={Whatsapp} alt={'Tweet about it'} />
          </a>
        </div>
      </div>
      <div className={'copy'}>
        <Form>
          <Item className={''} label={'Link to Raffle'}>
            <Search
              name={'raffle'}
              placeholder={''}
              value={link}
              onChange={() => {}}
              onSearch={onCopy}
              enterButton={
                <Tooltip title={copyText}>
                  <FiClipboard />
                </Tooltip>
              }
            />
          </Item>
        </Form>
      </div>
    </ShareModal>
  );
};

export default RaffleShareContent;
