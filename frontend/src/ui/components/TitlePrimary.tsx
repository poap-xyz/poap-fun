import React, { FC, ReactNode } from 'react';
import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

// Components
import { Button } from 'ui/styled/antd/Button';

// Constants
import { ROUTES } from 'lib/routes';
import { BREAKPOINTS } from 'lib/constants/theme';

// Types
type TitlePrimaryProps = {
  title: string | ReactNode;
  goBack?: boolean;
  editAction?: () => void;
};

// Styled component
const Title = styled.div`
  width: 100%;
  padding: 60px 0 24px;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .active-raffle {
    width: calc(100% - 140px);
    flex-direction: row;
    display: flex;
    align-items: center;
    .title {
      width: auto;
      margin-right: 10px;
    }
  }
  h1,
  .title {
    color: var(--primary-color);
    font-family: var(--main-font);
    font-weight: bold;
    font-size: 36px;
    line-height: 39px;
    margin: 0;
    width: 100%;
  }
  svg {
    position: absolute;
    left: -30px;
    top: 70px;
    transform: scale(2);

    @media (max-width: ${BREAKPOINTS.xs}) {
      left: 5px;
      top: 10px;
    }
  }
  button {
    width: 120px;
  }
`;

const TitlePrimary: FC<TitlePrimaryProps> = ({ title, goBack, editAction }) => {
  return (
    <Title>
      {goBack && (
        <NavLink to={ROUTES.home}>
          <FiArrowLeft color={'var(--primary-color)'} />
        </NavLink>
      )}
      {typeof title === 'string' ? <h1>{title}</h1> : title}
      {editAction && (
        <Button type={'default'} onClick={editAction}>
          Edit raffle
        </Button>
      )}
    </Title>
  );
};

export default TitlePrimary;
