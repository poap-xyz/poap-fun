import React, { FC } from 'react';

// Layouts
import MainLayout from 'ui/layouts/MainLayout';

// Components
import RaffleCreated from 'modules/raffles/components/RaffleCreated';

const RaffleCreate: FC = () => (
  <MainLayout>
    <RaffleCreated />
  </MainLayout>
);

export default RaffleCreate;
