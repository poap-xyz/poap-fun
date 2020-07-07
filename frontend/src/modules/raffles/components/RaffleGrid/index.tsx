import React, { FC, useEffect } from 'react';
import { useFormik } from 'formik';
import { Row, Col } from 'antd';
import { FiSearch } from 'react-icons/fi';

// Lib
import { injectErrorsFromBackend } from 'lib/helpers/formik';

// Components
import Input from 'ui/components/Input';
import { Form } from 'ui/styled/antd/Form';
import { Container } from 'ui/styled/Container';
import { SearchForm } from 'ui/styled/SearchForm';
import SectionTitle from 'ui/components/SectionTitle';
import RaffleCard from 'ui/components/RaffleCard';

// Schema
import RaffleSearchSchema from './schema';

// Types
export type RaffleSearchFormValue = {
  query: string;
};

const initialValues: RaffleSearchFormValue = {
  query: '',
};

const RaffleGrid: FC = () => {
  const handleOnSubmit = async ({ query }: RaffleSearchFormValue) => {
    console.log('QUery: ', query);
  };

  // Lib hooks
  const { values, errors, touched, handleChange } = useFormik({
    initialValues,
    validationSchema: RaffleSearchSchema,
    onSubmit: injectErrorsFromBackend<RaffleSearchFormValue>(handleOnSubmit),
  });

  // Effects
  useEffect(() => {
    console.log(values.query);
    // TODO - Search async
  }, [values]); //eslint-disable-line

  const raffles = [1, 2, 3, 4, 5, 6, 7];

  return (
    <Container sidePadding>
      <SectionTitle title={'Last raffle'} />
      <SearchForm>
        <Form>
          <Input
            errors={errors}
            handleChange={handleChange}
            label=""
            name="query"
            placeholder="Search by name"
            touched={touched}
            values={values}
            prefix={<FiSearch color={'var(--system-placeholder)'} />}
          />
        </Form>
      </SearchForm>

      <Row gutter={16}>
        {raffles.map((raffle) => {
          return (
            <Col span={8} key={raffle}>
              <RaffleCard title={`Raffle #${raffle}`} active={raffle < 5} prize={'Awesome book'} />
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default RaffleGrid;
