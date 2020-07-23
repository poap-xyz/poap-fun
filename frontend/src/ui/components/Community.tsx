import React, { FC } from 'react';
import styled from '@emotion/styled';

// Assets
import twitter from 'assets/img/twitter.svg';
import github from 'assets/img/github.svg';
import telegram from 'assets/img/telegram.svg';
import reddit from 'assets/img/reddit.svg';
import discord from 'assets/img/discord.svg';

const CommunityWrapper = styled.div`
  display: flex;
  flex-direction: column;

  .title {
    color: var(--primary-color);
  }

  .networks {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    max-width: 200px;
    margin: 0 auto;
    .network {
      margin: 0 5px;
      img {
        width: 24px;
      }
    }
  }
`;

const Community: FC = () => (
  <CommunityWrapper>
    <div className={'title'}>Join our community</div>
    <div className={'networks'}>
      <div className={'network'}>
        <a href={'https://twitter.com/poapxyz'} target={'_blank'} rel="noopener noreferrer">
          <img src={twitter} alt={'Twitter'} />
        </a>
      </div>
      <div className={'network'}>
        <a href={'https://github.com/poapxyz'} target={'_blank'} rel="noopener noreferrer">
          <img src={github} alt={'Github'} />
        </a>
      </div>
      <div className={'network'}>
        <a href={'https://t.me/poapxyz'} target={'_blank'} rel="noopener noreferrer">
          <img src={telegram} alt={'Telegram'} />
        </a>
      </div>
      <div className={'network'}>
        <a href={'https://discord.com/invite/9s8U8Bn'} target={'_blank'} rel="noopener noreferrer">
          <img src={discord} alt={'Discord'} />
        </a>
      </div>
      <div className={'network'}>
        <a href={'https://www.reddit.com/r/poap/'} target={'_blank'} rel="noopener noreferrer">
          <img src={reddit} alt={'Reddit'} />
        </a>
      </div>
    </div>
  </CommunityWrapper>
);

export default Community;
