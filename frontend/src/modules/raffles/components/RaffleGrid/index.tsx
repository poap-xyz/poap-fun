import React, { FC, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Row, Col } from 'antd';
import { FiSearch } from 'react-icons/fi';

// Lib
import { injectErrorsFromBackend } from 'lib/helpers/formik';
import { useEvents } from 'lib/hooks/useEvents';
import { useRaffles } from 'lib/hooks/useRaffles';

// Helpers
import { mergeRaffleEvent } from 'lib/helpers/api';

// Components
import Input from 'ui/components/Input';
import Loading from 'ui/components/Loading';
import { Form } from 'ui/styled/antd/Form';
import { Button } from 'ui/styled/antd/Button';
import { Container } from 'ui/styled/Container';
import { SearchForm } from 'ui/styled/SearchForm';
import { LoadMore } from 'ui/styled/LoadMore';
import SectionTitle from 'ui/components/SectionTitle';
import RaffleCard from 'ui/components/RaffleCard';

/// Constants
import { API_PAGE_SIZE } from 'lib/constants/api';

// Schema
import RaffleSearchSchema from './schema';

// Types
import { CompleteRaffle } from 'lib/types';
export type RaffleSearchFormValue = {
  query: string;
};

const initialValues: RaffleSearchFormValue = {
  query: '',
};

const RaffleGrid: FC = () => {
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [query, setQuery] = useState<string>('');
  const [raffles, setRaffles] = useState<CompleteRaffle[]>([]);

  const { data: events } = useEvents();
  const [fetchRaffles, { isLoading }] = useRaffles();

  // Component methods
  const changePage = () => setPage(page + 1);

  const doFetch = (page: number, query: string, raffles: CompleteRaffle[]) => {
    fetchRaffles({ page, query }).then((response) => {
      if (response && response.results && events) {
        setRaffles([...raffles, ...mergeRaffleEvent(response.results, events)]);
        setTotalPages(Math.ceil(response.count / API_PAGE_SIZE));
      }
    });
  };

  const handleOnSubmit = async ({ query }: RaffleSearchFormValue) => {
    console.log('Query: ', query);
  };

  // Lib hooks
  const { values, errors, touched, handleChange } = useFormik({
    initialValues,
    validationSchema: RaffleSearchSchema,
    onSubmit: injectErrorsFromBackend<RaffleSearchFormValue>(handleOnSubmit),
  });

  // Effects
  useEffect(() => {
    // TODO - Add some Throttling
    if (values.query) {
      setQuery(values.query);
      setRaffles([]);
      if (page > 1) {
        setPage(1);
      } else {
        doFetch(page, values.query, []);
      }
    }
  }, [values]); //eslint-disable-line

  useEffect(() => {
    if (!events) return;
    doFetch(page, query, raffles);
  }, [events, page]); //eslint-disable-line

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
            <Col xs={24} sm={12} md={12} lg={8} key={raffle.id}>
              <RaffleCard raffle={raffle} />
            </Col>
          );
        })}
      </Row>
      {isLoading && <Loading />}
      {!isLoading && page < totalPages && (
        <LoadMore>
          <Button onClick={changePage} type={'primary'}>
            Load More
          </Button>
        </LoadMore>
      )}
    </Container>
  );
};

export default RaffleGrid;
