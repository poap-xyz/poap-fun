import React, { FC } from 'react';

// Layouts
import MainLayout from 'ui/layouts/MainLayout';

// Components
import Hero from 'ui/components/Hero';
import RaffleGrid from 'modules/raffles/components/RaffleGrid';

const Home: FC = () => (
  <MainLayout>
    <Hero />
    <RaffleGrid />
  </MainLayout>
);

export default Home;
