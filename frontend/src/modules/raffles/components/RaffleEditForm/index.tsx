import React, { FC, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useHistory, useParams } from 'react-router-dom';
import { Col, Row, Tooltip } from 'antd';
import moment from 'moment-timezone';
import styled from '@emotion/styled';
import isEmpty from 'lodash.isempty';

// Components
import Input from 'ui/components/Input';
import { Card } from 'ui/styled/antd/Card';
import { Form } from 'ui/styled/antd/Form';
import { Button } from 'ui/styled/antd/Button';
import { Container } from 'ui/styled/Container';
import Separator from 'ui/styled/Separator';
import Checkbox from 'ui/components/Checkbox';
import TitlePrimary from 'ui/components/TitlePrimary';
import PrizeRowForm from 'ui/components/PrizeRowForm';
import DatePicker from 'ui/components/DatePicker';
import TimePicker from 'ui/components/TimePicker';
import Editor from 'ui/components/Editor';
import InputTitle from 'ui/styled/InputTitle';
import EventDisplay from 'ui/components/EventDisplay';

// Helpers
import { mergeRaffleEvent, mergeRaffleDatetime } from 'lib/helpers/api';
import { createRaffleLink } from 'lib/helpers/raffles';

// Constants

// Hooks
import { useEvents } from 'lib/hooks/useEvents';
import { useEditRaffle } from 'lib/hooks/useEditRaffle';
import { useDeletePrize } from 'lib/hooks/usePrizes';
import { useStateContext } from 'lib/hooks/useCustomState';

// Schema
import RaffleEditFormSchema from './schema';

// Types
import { Prize, CompleteRaffle, CreatePrize } from 'lib/types';
export type RaffleEditFormValue = {
  prize: string;
  name: string;
  contact: string;
  weightedVote: boolean;
  undefinedDrawDateTime: boolean;
  startDateHelper: string;
  raffleDate: moment.Moment | undefined;
  raffleTime: moment.Moment | undefined;
};

const PrizeContainer = styled.div`
  display: flex;

  > div {
    flex: 1;

    input {
      border-top-right-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
    }
  }

  > button {
    flex-basis: 56px;
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }
`;

const RaffleEditForm: FC = () => {
  const { push } = useHistory();
  const { id } = useParams();
  const { rafflesInfo } = useStateContext();
  const raffle = rafflesInfo[id];

  const { data: events } = useEvents();

  let sortedPrizes: Prize[] = raffle.prizes
    .sort((a, b) => a.id - b.id)
    .map((prize, i) => {
      let each: Prize = { id: i + 1, name: prize.name, order: i + 1 };
      return each;
    });

  const [prizes, setPrizes] = useState<Prize[]>(sortedPrizes);
  const [description, setDescription] = useState<string>(raffle.description);
  const [completeRaffle, setCompleteRaffle] = useState<CompleteRaffle | null>(null);

  const handleOnSubmit = async (
    {
      name,
      contact,
      weightedVote,
      raffleDate,
      raffleTime,
      startDateHelper,
      undefinedDrawDateTime,
    }: RaffleEditFormValue,
    { setFieldError }: any,
  ) => {
    if (!prizes.length) {
      return setFieldError('prize', 'You should have at least one prize');
    }

    if (raffle.token) {
      // Combine dates and get timezone
      if (!undefinedDrawDateTime && (!raffleDate || !raffleTime)) return;
      let raffleDatetime = mergeRaffleDatetime(raffleDate, raffleTime);

      // Delete all prizes
      if (raffle.prizes.length > 0) {
        await Promise.all(raffle.prizes.map((prize) => deletePrize({ id: prize.id, token: raffle.token })));
      }
      let submitPrizes: CreatePrize[] = prizes.map((prize) => ({ name: prize.name, order: prize.order }));

      let patchedRaffle = await patchRaffle({
        id: raffle.id,
        token: raffle.token,
        name,
        description,
        contact,
        start_date_helper: startDateHelper,
        draw_datetime: undefinedDrawDateTime ? null : raffleDatetime,
        one_address_one_vote: !weightedVote,
        prizes: submitPrizes,
      });
      if (patchedRaffle) push(createRaffleLink(patchedRaffle, true));
    }
  };

  // Hooks
  const [patchRaffle, { isLoading }] = useEditRaffle();
  const [deletePrize] = useDeletePrize();
  const localDrawDateTime = raffle.draw_datetime ? moment.utc(raffle.draw_datetime).local() : undefined;

  const initialValues: RaffleEditFormValue = {
    prize: '',
    name: raffle.name,
    contact: raffle.contact,
    weightedVote: !raffle.one_address_one_vote,
    undefinedDrawDateTime: !localDrawDateTime,
    startDateHelper: raffle.start_date_helper || '',
    raffleDate: localDrawDateTime,
    raffleTime: localDrawDateTime
      ? moment(new Date()).hours(localDrawDateTime.hours()).minutes(localDrawDateTime.minutes())
      : undefined,
  };

  // Lib hooks
  const { values, errors, touched, handleChange, submitForm, setFieldValue } = useFormik({
    initialValues,
    onSubmit: handleOnSubmit,
    validationSchema: RaffleEditFormSchema,
  });

  // Effects
  useEffect(() => {
    if (!events || !raffle) return;
    let completeRaffles = mergeRaffleEvent([raffle], events);
    if (completeRaffles.length > 0) setCompleteRaffle(completeRaffles[0]);
  }, [events]); //eslint-disable-line

  useEffect(() => {
    if (!isEmpty(errors)) {
      const formCardPosition = document.querySelector('.ant-card-body')?.getBoundingClientRect()?.top;

      if (formCardPosition) {
        const top = formCardPosition + window.scrollY - 100;
        window.scroll({ top, behavior: 'smooth' });
      }
    }
  }, [errors]); //eslint-disable-line

  const removePrize = (order: number) => {
    let newPrizes = prizes
      .filter((prize) => prize.order !== order)
      .map((prize, index) => {
        let newOrder = index + 1;
        return { ...prize, id: newOrder, order: newOrder };
      });
    setPrizes(newPrizes);
  };

  const addPrize = (): void => {
    const { prize } = values;
    if (!prize || prize.trim() === '') return;

    const position = prizes.length + 1;
    let newPrize: Prize = { id: position, order: position, name: prize };

    setPrizes([...prizes, newPrize]);
    setFieldValue('prize', '');
  };

  const handleEditorChange = (content: string, editor: any) => setDescription(content);

  const handleSubmitClick = () => submitForm();

  const offset = moment().utcOffset() / 60;
  const timeLabel = (
    <>
      <Tooltip title={`Browser timezone: ${moment.tz.guess()}`}>
        <span>Raffle Time (UTC {offset > 0 ? `+${offset}` : offset})</span>
      </Tooltip>
    </>
  );

  return (
    <Container sidePadding thinWidth>
      <TitlePrimary title={'Edit Raffle'} />
      <Card>
        <Form>
          <Row gutter={24}>
            <Col span={24}>
              <Input
                errors={errors}
                handleChange={handleChange}
                label="Raffle Name"
                name="name"
                placeholder="Enter a name so players can find it"
                touched={touched}
                values={values}
              />
            </Col>
            <Col span={24}>
              <InputTitle>POAP{raffle.prizes.length > 1 && `s`}</InputTitle>
              {completeRaffle && <EventDisplay events={completeRaffle.events} />}
            </Col>
            <Col span={24}>
              <Checkbox
                handleChange={handleChange}
                name="weightedVote"
                sideText="Weighted chance"
                helpText="Users with multiple POAPs have one ticket per POAP"
                values={values}
              />
            </Col>
            <Col xs={{ offset: 0, span: 24 }} md={{ offset: 0, span: 12 }} lg={{ offset: 4, span: 8 }}>
              <DatePicker
                setFieldValue={setFieldValue}
                name="raffleDate"
                label="Raffle Date"
                placeholder="Pick a date"
                futureDates
                touched={touched}
                errors={errors}
                values={values}
                disabled={values['undefinedDrawDateTime']}
              />
            </Col>
            <Col xs={{ offset: 0, span: 24 }} md={{ offset: 0, span: 12 }} lg={{ offset: 0, span: 8 }}>
              <TimePicker
                setFieldValue={setFieldValue}
                name="raffleTime"
                label={timeLabel}
                placeholder="Pick a time"
                touched={touched}
                errors={errors}
                values={values}
                disabled={values['undefinedDrawDateTime']}
              />
            </Col>
            <Col span={24}>
              <Checkbox
                handleChange={handleChange}
                name="undefinedDrawDateTime"
                sideText="Decide raffle date time later"
                helpText="If you're not sure when the raffle will start, you can edit the raffle later"
                values={values}
              />
            </Col>
            {values['undefinedDrawDateTime'] && (
              <Col span={24}>
                <Input
                  errors={errors}
                  handleChange={handleChange}
                  label="Raffle start date time helper"
                  name="startDateHelper"
                  placeholder="i.e: the raffle will start near the month's end"
                  touched={touched}
                  values={values}
                />
              </Col>
            )}
            <Col span={24}>
              <Editor title={'Raffle description'} onChange={handleEditorChange} initialValue={description} />
            </Col>
            <Col span={24}>
              <PrizeContainer>
                <Input
                  label=""
                  errors={errors}
                  handleChange={handleChange}
                  name="prize"
                  placeholder="Add prizes you'd like to raffle!"
                  touched={touched}
                  values={values}
                />
                <Button onClick={addPrize} type="primary" disabled={values.prize.length === 0}>
                  Add
                </Button>
              </PrizeContainer>
            </Col>
            <Col span={24}>
              {prizes.length > 0 && (
                <>
                  <Separator />
                  {prizes.map((prize) => {
                    return (
                      <PrizeRowForm
                        key={prize.order}
                        order={prize.order}
                        prize={prize.name}
                        deleteAction={() => removePrize(prize.order)}
                      />
                    );
                  })}
                  <Separator />
                </>
              )}
            </Col>
            <Col span={24}>
              <Input
                errors={errors}
                handleChange={handleChange}
                label="Contact"
                name="contact"
                placeholder="Enter your email so the winners can get in touch"
                touched={touched}
                values={values}
              />
            </Col>
          </Row>
        </Form>
      </Card>
      <Button onClick={handleSubmitClick} type="primary" margin loading={isLoading}>
        Update raffle
      </Button>
    </Container>
  );
};

export default RaffleEditForm;
