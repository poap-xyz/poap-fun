import React from 'react';
import { BannerHand } from './BannerHand';
import { BannerIconsLeft } from './BannerIconsLeft';
import { BannerIconsRight } from './BannerIconsRight';

import styles from './Banner.module.scss';

export const Banner: React.FC = () => {
  return (
    <div className={styles.bannerWrapper}>
      <BannerIconsLeft />
      <div className={styles.centerContainer}>
        <BannerHand className={styles.handIcon} />
        <span>
          <strong>POAP Fun</strong> is under maintenance
        </span>
      </div>
      <BannerIconsRight />
    </div>
  );
};
