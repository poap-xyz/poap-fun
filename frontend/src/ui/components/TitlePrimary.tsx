import React, { FC, ReactNode } from 'react';
import styled from '@emotion/styled';
import { FiEdit3 } from 'react-icons/fi';

// Components
import StatusTag from 'ui/components/StatusTag';

// Constants
import { BREAKPOINTS } from 'lib/constants/theme';

// Types
type TitlePrimaryProps = {
  title: string;
  activeTag?: string;
  editAction?: () => void;
  secondaryComponent?: ReactNode | null;
};

// Styled component
const Title = styled.div`
  width: 100%;
  padding: 60px 0 24px;
  position: relative;
  display: flex;
  flex-direction: column;

  @media (max-width: ${BREAKPOINTS.xs}) {
    padding: 10px 0 24px;
  }

  .sound-icons {
    text-align: center;
    svg {
      width: 24px;
      height: 24px;
      cursor: pointer;
      fill: var(--secondary-color);
    }
  }

  .navigation {
    position: absolute;
    left: -30px;
    top: 70px;

    @media (max-width: ${BREAKPOINTS.sm}) {
      width: 100%;
      position: relative;
      left: initial;
      top: initial;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding-bottom: 20px;
    }
    svg {
      transform: scale(2);
    }
    .tag {
      @media (min-width: ${BREAKPOINTS.sm}) {
        display: none;
      }
    }
  }

  .title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    @media (max-width: ${BREAKPOINTS.sm}) {
      flex-direction: column;
    }
    h1 {
      color: var(--primary-color);
      font-family: var(--main-font);
      font-weight: bold;
      font-size: 36px;
      line-height: 39px;
      margin: 0;
      width: 100%;
    }
    .edit-action {
      cursor: pointer;
      color: var(--secondary-color);
      font-family: var(--alt-font);
      font-size: 18px;
      line-height: 20px;
      margin-top: 10px;
    }
    .tag {
      margin: 5px 0;
      @media (max-width: ${BREAKPOINTS.sm}) {
        display: none;
      }
    }
  }
`;

const TitlePrimary: FC<TitlePrimaryProps> = ({ title, editAction, activeTag, secondaryComponent = null }) => {
  return (
    <Title>
      <div className={'navigation'}>
        {activeTag && (
          <div className={'tag'}>
            <StatusTag text={'active'} />
          </div>
        )}
      </div>
      <div className={'title'}>
        <div>
          <h1>{title}</h1>
          {activeTag && <StatusTag text={activeTag} className={'tag'} />}
        </div>
        <div>
          <div>
            {editAction && (
              <div className={'edit-action'} onClick={editAction}>
                Edit raffle <FiEdit3 color={'var(--secondary-color)'} />
              </div>
            )}
            {secondaryComponent}
          </div>
        </div>
      </div>
    </Title>
  );
};

export default TitlePrimary;
