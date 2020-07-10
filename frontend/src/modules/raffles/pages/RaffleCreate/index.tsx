import React, { FC } from 'react';

// Layouts
import MainLayout from 'ui/layouts/MainLayout';

// Components
import RaffleCreateForm from 'modules/raffles/components/RaffleCreateForm';

const RaffleCreate: FC = () => (
  <MainLayout>
    <RaffleCreateForm />
  </MainLayout>
);

export default RaffleCreate;
