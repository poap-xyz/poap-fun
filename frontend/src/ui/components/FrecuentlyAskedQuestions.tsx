import React, { FC } from 'react';
import styled from '@emotion/styled';
import { Col, Row } from 'antd';

// Components
import { Container } from 'ui/styled/Container';

// Constants
import { ROUTES } from 'lib/routes';
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
              <h2 className={'faq-title'}>What is POAP fun?</h2>
              <p>
                POAP.fun it’s a website part of the POAP ecosystem that gives anyone the ability to easily create
                raffles between POAP token holders.
              </p>
            </div>
          </Col>
        </Row>
        <Row gutter={24} className={'odd-row'}>
          <Col xs={{ offset: 0, span: 24 }} md={{ offset: 0, span: 12 }}>
            <div className={'faq-text'}>
              <h2 className={'faq-title'}>How do I create a raffle?</h2>
              <p>
                Anyone can create a raffle starting at: <a href={ROUTES.faqs}>https://www.poap.fun/raffle/new</a>
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
              <h2 className={'faq-title'}>How do participants know the results are not rigged?</h2>
              <p>
                POAP.fun uses an elimination system based on the POAP token ID and the gas usage of ethereum blocks. The
                last number of the gas spent on the block the raffle starts is used to eliminate all the POAPs with an
                ID terminating on that digit. Results are fully auditable using easy to operate open source tools.
              </p>
            </div>
          </Col>
        </Row>
        <Row gutter={24} className={'odd-row'}>
          <Col xs={{ offset: 0, span: 24 }} md={{ offset: 0, span: 12 }}>
            <div className={'faq-text'}>
              <h2 className={'faq-title'}>Do I have to remain attentive to the raffle draw?</h2>
              <p>
                No! Once you signed up by signing a message, you are participating. You can visit the website during the
                raffle to see the elimination on real time, but it’s not a requirement.
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
          <Col xs={{ offset: 0, span: 24 }} md={{ offset: 0, span: 14 }}>
            <div className={'faq-text'}>
              <h2 className={'faq-title'}>Do the amounts of POAP increase my chances of winning?</h2>
              <p>
                The raffle creator can decide if participants can have a single chance with their whole collection of
                POAPs or if each tokens means one chance
              </p>
            </div>
          </Col>
          <Col xs={{ offset: 0, span: 24 }} md={{ offset: 0, span: 10 }}>
            <div className={'faq-text'}>
              <h2 className={'faq-title'}>How much does POAP.fun cost?</h2>
              <p>POAP.fun is free! It's an open source community initiative.</p>
            </div>
          </Col>
        </Row>
      </div>
    </Wrap>
  </Container>
);

export default FrecuentlyAskedQuestions;
