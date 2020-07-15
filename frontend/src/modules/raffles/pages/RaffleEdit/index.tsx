import React, { FC } from 'react';

// Layouts
import MainLayout from 'ui/layouts/MainLayout';

// Components
import RaffleEditForm from 'modules/raffles/components/RaffleEditForm';

const RaffleCreate: FC = () => (
  <MainLayout>
    <RaffleEditForm />
  </MainLayout>
);

export default RaffleCreate;
