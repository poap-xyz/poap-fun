import React, { FC } from 'react';

// Layouts
import MainLayout from 'ui/layouts/MainLayout';

// Components
import Hero from 'ui/components/Hero';

const Home: FC = () => (
  <MainLayout>
    <Hero />
  </MainLayout>
);

export default Home;
