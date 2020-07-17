import React, { FC } from 'react';
import styled from '@emotion/styled';
import Blockies from 'react-blockies';

// Components

// Constants

// Styled Components
const UserWrapper = styled.div`
  cursor: pointer;
  border: 1px solid var(--system-gray);
  border-radius: 40px;
  display: flex;
  flex-direction: row;
  height: 40px;
  padding: 8px 0 8px 8px;
  align-items: center;
  .blockie {
    padding-top: 16px;
    canvas {
      border-radius: 24px;
    }
  }
  .address {
    color: var(--secondary-color);
    font-family: var(--alt-font);
    font-size: 16px;
    padding: 0 5px;
  }
  .poaps {
    background: var(--system-gray);
    border-radius: 40px;
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    position: relative;
    width: 85px;
    flex-direction: row;
    .badge {
      background: white;
      height: 22px;
      width: 22px;
      padding: 2px;
      border-radius: 20px;
      position: absolute;
      &:first-of-type {
        left: 10px;
      }
      &:nth-of-type(2) {
        left: 20px;
      }
      &:nth-of-type(3) {
        left: 30px;
      }
      img {
        width: 100%;
        vertical-align: top;
      }
    }
    .extra-badges {
      position: absolute;
      right: 10px;
      font-family: var(--alt-font);
      color: var(--secondary-color);
    }
  }
`;

const PoapUser: FC = () => (
  <UserWrapper>
    <div className={'blockie'}>
      <Blockies seed={'poap.eth'} size={6} />
    </div>
    <div className={'address'}>0x1234...</div>
    <div className={'poaps'}>
      <div className={'badge'}>
        <img
          src={'https://storage.googleapis.com/poapmedia/fridai-brunch-1-2020-logo-1590754673900.png'}
          alt={'Poap'}
        />
      </div>
      <div className={'badge'}>
        <img
          src={'https://storage.googleapis.com/poapmedia/fridai-brunch-1-2020-logo-1590754673900.png'}
          alt={'Poap'}
        />
      </div>
      <div className={'badge'}>
        <img
          src={'https://storage.googleapis.com/poapmedia/fridai-brunch-1-2020-logo-1590754673900.png'}
          alt={'Poap'}
        />
      </div>
      <div className={'extra-badges'}>+ 3</div>
    </div>
  </UserWrapper>
);

export default PoapUser;
