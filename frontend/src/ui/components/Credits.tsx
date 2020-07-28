import React, { FC } from 'react';
import styled from '@emotion/styled';

const Credit = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  color: var(--secondary-color);

  svg {
    margin: 0 2px 2px 2px;
    transform: scale(0.85);
    transition: all 400ms ease-in-out;
    rect {
      fill: transparent;
    }

    path {
      fill: var(--tertiary-color);
    }
  }

  &:hover svg {
    transform: scale(1.1);
  }

  .made-by-link {
    color: var(--secondary-color);
    font-weight: 500;
    margin-left: 3px;
    text-decoration: none;
    pointer-events: auto;

    &:hover {
      color: var(--primary-color);
    }
  }
`;

const Credits: FC = () => (
  <Credit>
    Made with{' '}
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <g data-name="Layer 2">
        <g data-name="heart">
          <rect width="24" height="24" />
          <path d="M12 21a1 1 0 0 1-.71-.29l-7.77-7.78a5.26 5.26 0 0 1 0-7.4 5.24 5.24 0 0 1 7.4 0L12 6.61l1.08-1.08a5.24 5.24 0 0 1 7.4 0 5.26 5.26 0 0 1 0 7.4l-7.77 7.78A1 1 0 0 1 12 21z" />
        </g>
      </g>
    </svg>
    by
    <a target="_blank" href="https://xivis.com" rel="noopener noreferrer" className="made-by-link">
      Xivis
    </a>
  </Credit>
);

export default Credits;
