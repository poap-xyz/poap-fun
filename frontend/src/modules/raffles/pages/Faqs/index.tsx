import React, { FC } from 'react';

// Layouts
import MainLayout from 'ui/layouts/MainLayout';

// Components
import FrecuentlyAskedQuestions from 'ui/components/FrecuentlyAskedQuestions';

const Faqs: FC = () => (
  <MainLayout>
    <FrecuentlyAskedQuestions />
  </MainLayout>
);

export default Faqs;
