import React, { FC } from 'react';
import styled from '@emotion/styled';

// Components
import { Card } from 'ui/styled/antd/Card';

// Assets
import badgesLeft from 'assets/img/badge-party-left.svg';
import badgesRight from 'assets/img/badge-party-right.svg';

const CardWrapper = styled.div`
  position: relative;
  .left-badges {
    position: absolute;
    left: -115px;
    top: 75px;
    img {
      width: 120px;
    }
  }
  .right-badges {
    position: absolute;
    right: -50px;
    top: 75px;
    img {
      width: 50px;
    }
  }
`;

const CardWithBadges: FC = ({ children }) => {
  return (
    <CardWrapper>
      <div className={'left-badges'}>
        <img src={badgesLeft} alt={'badges'} />
      </div>
      <Card>{children}</Card>
      <div className={'right-badges'}>
        <img src={badgesRight} alt={'badges'} />
      </div>
    </CardWrapper>
  );
};

export default CardWithBadges;
