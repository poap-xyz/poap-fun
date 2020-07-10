import React, { FC } from 'react';
import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

// Constants
import { ROUTES } from 'lib/routes';

// Types
type TitlePrimaryProps = {
  title: string;
  goBack?: boolean;
};

// Styled component
const Title = styled.div`
  width: 100%;
  padding: 60px 0 24px;
  position: relative;
  h1 {
    color: var(--primary-color);
    font-family: var(--main-font);
    font-weight: bold;
    font-size: 36px;
    line-height: 39px;
    margin: 0;
  }
  svg {
    position: absolute;
    left: -30px;
    top: 70px;
    transform: scale(2);
  }
`;

const TitlePrimary: FC<TitlePrimaryProps> = ({ title, goBack }) => {
  return (
    <Title>
      {goBack && (
        <NavLink to={ROUTES.home}>
          <FiArrowLeft color={'var(--primary-color)'} />
        </NavLink>
      )}
      <h1>{title}</h1>
    </Title>
  );
};

export default TitlePrimary;
