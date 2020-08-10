import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Col, Row } from 'antd';

// Components
import { Container } from 'ui/styled/Container';

// Constants
import { BREAKPOINTS } from 'lib/constants/theme';

// Assets
import faq1 from 'assets/img/faq1.svg';
import faq2 from 'assets/img/faq2.svg';
import faq3 from 'assets/img/faq3.svg';
import faq4 from 'assets/img/faq4.svg';
import faq5 from 'assets/img/faq5.svg';

const Wrap = styled.div`
  width: 100%;
  padding: 25px 15px;

  .ant-row {
    align-items: center;
    padding-bottom: 50px;
    .ant-col {
      width: 100%;
    }
  }
  .odd-row {
    @media (max-width: ${BREAKPOINTS.sm}) {
      flex-direction: column-reverse;
    }
  }
  .title {
    text-align: center;
    padding: 100px 24px 60px;
  }
  .faq-title {
    font-family: var(--alt-font);
  }
  .faq-image {
    text-align: center;
    padding: 20px;
    img {
      width: 100%;
      max-width: 300px;
    }
  }
  .faq-text {
    padding: 20px;
    p {
      width: 100%;
      max-width: 500px;
      display: block;
      @media (max-width: ${BREAKPOINTS.sm}) {
        max-width: 100%;
      }
      .bold-p {
        font-weight: bold;
        font-size: 22px;
      }
    }
  }
`;

const FrecuentlyAskedQuestions: FC = () => (
  <Container>
    <Wrap>
      <div className={'title'}>
        <h1>FAQ</h1>
      </div>
      <div>
        <Row gutter={24}>
          <Col xs={{ offset: 0, span: 24 }} md={{ offset: 0, span: 12 }}>
            <div className={'faq-image'}>
              <img src={faq1} alt={'FAQs'} />
            </div>
          </Col>
          <Col xs={{ offset: 0, span: 24 }} md={{ offset: 0, span: 12 }}>
            <div className={'faq-text'}>
              <h2 className={'faq-title'}>What is POAP again?</h2>
              <p>
                It's a system that event organizers can easily use to distribute attendance crypto-badges to people that
                show up, a tool for attendees to display and share the badges they have obtained and an open standard
                for Dapp developers to build on top of.
              </p>

              <p>
                If you have 5 whole minutes, you can watch{' '}
                <a href={'https://twitter.com/gomox_ar'} target={'_blank'} rel="noopener noreferrer">
                  @gomox_ar
                </a>{' '}
                <a href={'https://www.youtube.com/watch?v=VZlmQjhz3ko'} target={'_blank'} rel="noopener noreferrer">
                  explain POAP at an EthCC Lightning Talk in March 2019
                </a>
              </p>
            </div>
          </Col>
        </Row>
        <Row gutter={24} className={'odd-row'}>
          <Col xs={{ offset: 0, span: 24 }} md={{ offset: 0, span: 12 }}>
            <div className={'faq-text'}>
              <h2 className={'faq-title'}>Why would I want to get badges?</h2>
              <p>Here are some things that could happen when you obtain POAP badges:</p>
              <ul>
                <li>&bull; Collect cool badges</li>
                <li>&bull; Impress your crypto buddies(*)</li>
                <li>&bull; Enter a Lambo giveaway(*)</li>
              </ul>
              <p>
                <small>
                  (*) Results not guaranteed. Any expectations of recognition, prizes, privileges or earnings are your
                  own.
                </small>
              </p>
            </div>
          </Col>
          <Col xs={{ offset: 0, span: 24 }} md={{ offset: 0, span: 12 }}>
            <div className={'faq-image'}>
              <img src={faq2} alt={'FAQs'} />
            </div>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={{ offset: 0, span: 24 }} md={{ offset: 0, span: 12 }}>
            <div className={'faq-image'}>
              <img src={faq3} alt={'FAQs'} />
            </div>
          </Col>
          <Col xs={{ offset: 0, span: 24 }} md={{ offset: 0, span: 12 }}>
            <div className={'faq-text'}>
              <h2 className={'faq-title'}>How are POAP badges implemented?</h2>
              <p>
                POAP badges are ERC-721 tokens. Once minted, they can be viewed on{' '}
                <a href={'https://app.poap.xyz/'} target={'_blank'} rel="noopener noreferrer">
                  POAP scan
                </a>{' '}
                or any NFT-enabled interface (
                <a href={'https://etherscan.io/'} target={'_blank'} rel="noopener noreferrer">
                  Etherscan
                </a>
                ,{' '}
                <a href={'https://opensea.io/'} target={'_blank'} rel="noopener noreferrer">
                  OpenSea
                </a>
                ) and most mobile wallets.
              </p>
            </div>
          </Col>
        </Row>
        <Row gutter={24} className={'odd-row'}>
          <Col xs={{ offset: 0, span: 24 }} md={{ offset: 0, span: 12 }}>
            <div className={'faq-text'}>
              <h2 className={'faq-title'}>How do I get badges?</h2>
              <p>
                How you actually get the badges depends on the alternative(s) chosen by the event organizer to attest
                your presence.
              </p>
              <p>Current options include:</p>
              <p>
                <span className={'bold-p'}>Batch delivery of badges</span>
                <br />
                (if you gave a wallet address when you signed up, an organizer can airdrop you a badge)
              </p>
              <p>
                <span className={'bold-p'}>Manual sending</span>
                <br />
                (an organizer can scan your wallet address and send you a badge on the spot)
              </p>
              <p>
                <span className={'bold-p'}>Self service claim</span>
                <br />
                (an intranet-only Dapp that is available within the event's WiFi will give you your badge)
              </p>
            </div>
          </Col>
          <Col xs={{ offset: 0, span: 24 }} md={{ offset: 0, span: 12 }}>
            <div className={'faq-image'}>
              <img src={faq4} alt={'FAQs'} />
            </div>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <div className={'faq-image'}>
              <img src={faq5} alt={'FAQs'} />
            </div>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={{ offset: 0, span: 24 }} md={{ offset: 0, span: 12 }}>
            <div className={'faq-text'}>
              <h2 className={'faq-title'}>How can I use POAP for my event?</h2>
              <p>
                If you want to use POAP to distribute attendance badges at your event,{' '}
                <a href={'https://www.poap.xyz/#contact'} target={'_blank'} rel="noopener noreferrer">
                  contact us
                </a>{' '}
                so we can hook you up. All you need to provide is a badge design and some event metadata (event name,
                location, date).
              </p>
            </div>
          </Col>
          <Col xs={{ offset: 0, span: 24 }} md={{ offset: 0, span: 12 }}>
            <div className={'faq-text'}>
              <h2 className={'faq-title'}>How much does POAP cost?</h2>
              <p>POAP is free! It's an open source community initiative.</p>
            </div>
          </Col>
        </Row>
      </div>
    </Wrap>
  </Container>
);

export default FrecuentlyAskedQuestions;
