import React, { FC } from 'react';

// Layouts
import MainLayout from 'ui/layouts/MainLayout';

// Components
import RaffleDetail from 'modules/raffles/components/RaffleDetail';

const RafflePage: FC = () => (
  <MainLayout paddedContent={false}>
    <RaffleDetail />
  </MainLayout>
);

export default RafflePage;
