import React, { FC, useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { useHistory, generatePath } from 'react-router-dom';
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
import SelectEvent from 'ui/components/SelectEvent';
import Editor from 'ui/components/Editor';
import { HelpText } from 'ui/styled/HelpText';

// Helpers
import { mergeRaffleDatetime } from 'lib/helpers/api';
import { safeGetItem } from 'lib/helpers/localStorage';

// Constants
import { ROUTES } from 'lib/routes';

// Hooks
import { useEvents } from 'lib/hooks/useEvents';
import { useCreateRaffle } from 'lib/hooks/useCreateRaffle';

// Schema
import RaffleCreateFormSchema from './schema';

// Types
import { Prize, CreatePrize, CreateEvent, CreateRaffleValues } from 'lib/types';
export type RaffleCreateFormValue = {
  name: string;
  prize: string;
  contact: string;
  weightedVote: boolean;
  emailRequired: boolean;
  undefinedDrawDateTime: boolean;
  startDateHelper: string;
  eligibleEvents: number[];
  raffleDate: moment.Moment | undefined;
  raffleTime: moment.Moment | undefined;
  acceptedLegal: boolean;
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
    margin-top: 26px;
    flex-basis: 56px;
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }
`;

const TimeLabel = () => {
  const offset = moment().utcOffset() / 60;

  return (
    <Tooltip title={`Browser timezone: ${moment.tz.guess()}`}>
      <span>Raffle Time (UTC {offset > 0 ? `+${offset}` : offset})</span>
    </Tooltip>
  );
};

const RaffleCreateForm: FC = () => {
  // Constants
  const initialValuesFromLocalStorage = safeGetItem('create-raffle-form-values', 'null');
  const initialValuesParsed = initialValuesFromLocalStorage
    ? {
        ...initialValuesFromLocalStorage,
        raffleDate: moment(initialValuesFromLocalStorage.raffleDate),
        raffleTime: moment(initialValuesFromLocalStorage.raffleTime),
      }
    : null;

  const initialValues: RaffleCreateFormValue = initialValuesParsed || {
    name: '',
    contact: '',
    prize: '',
    eligibleEvents: [],
    weightedVote: false,
    emailRequired: false,
    undefinedDrawDateTime: false,
    acceptedLegal: false,
    startDateHelper: '',
    raffleDate: undefined,
    raffleTime: undefined,
  };

  // React hooks
  const [prizes, setPrizes] = useState<Prize[]>(safeGetItem('prizes-form-values', '[]'));
  const [description, setDescription] = useState<string>(safeGetItem('description-form-values', '""'));

  // Query hooks
  const { data: events } = useEvents();

  // Router hooks
  const { push } = useHistory();

  // Handlers
  const handleOnSubmit = async (
    {
      name,
      contact,
      weightedVote,
      emailRequired,
      raffleDate,
      raffleTime,
      eligibleEvents,
      startDateHelper,
      undefinedDrawDateTime,
      acceptedLegal,
    }: RaffleCreateFormValue,
    { setFieldError }: any,
  ) => {
    if (!prizes.length) {
      return setFieldError('prize', 'You should have at least one prize');
    }

    if (!acceptedLegal) {
      return setFieldError('acceptedLegal', 'Accepting the terms and conditions is required');
    }

    try {
      let submitPrizes: CreatePrize[] = prizes.map((prize) => ({ name: prize.name, order: prize.order }));
      let submitEvents: CreateEvent[] = eligibleEvents.map((event) => {
        let fullEvent = events ? events.find((each) => each.id === event) : null;
        let name = fullEvent ? fullEvent.name : 'POAP Name fetch failed';
        return { event_id: `${event}`, name };
      });

      // Combine dates and get timezone
      if (!undefinedDrawDateTime && (!raffleDate || !raffleTime)) return;
      let raffleDatetime = mergeRaffleDatetime(raffleDate, raffleTime);

      let newRaffle: CreateRaffleValues = {
        name,
        description,
        contact,
        start_date_helper: startDateHelper,
        draw_datetime: undefinedDrawDateTime ? null : raffleDatetime,
        one_address_one_vote: !weightedVote,
        email_required: emailRequired,
        prizes: submitPrizes,
        events: submitEvents,
      };

      // Submit raffle
      let raffle = await createRaffle(newRaffle);
      if (raffle) push(generatePath(ROUTES.raffleCreated, { id: raffle.id }));

      localStorage.removeItem('create-raffle-form-values');
      localStorage.removeItem('description-form-values');
      localStorage.removeItem('prizes-form-values');
    } catch (error) {
      console.log('RaffleCreateForm:FC -> error', error);
    }
  };

  // Hooks
  const [createRaffle, { isLoading }] = useCreateRaffle();

  // Lib hooks
  const { values, errors, touched, handleChange, submitForm, setFieldValue } = useFormik({
    initialValues,
    onSubmit: handleOnSubmit,
    validationSchema: RaffleCreateFormSchema,
  });

  // Effects
  useEffect(() => {
    localStorage.setItem('create-raffle-form-values', JSON.stringify(values));
  }, [values]);

  useEffect(() => {
    localStorage.setItem('description-form-values', JSON.stringify(description));
  }, [description]);

  useEffect(() => {
    localStorage.setItem('prizes-form-values', JSON.stringify(prizes));
  }, [prizes]);

  useEffect(() => {
    if (!isEmpty(errors)) {
      const formCardPosition = document.querySelector('.ant-card-body')?.getBoundingClientRect()?.top;

      if (formCardPosition) {
        const top = formCardPosition + window.scrollY - 100;
        window.scroll({ top, behavior: 'smooth' });
      }
    }
  }, [errors]); //eslint-disable-line

  // Methods
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

  // Handlers
  const handleEditorChange = (content: string, editor: any) => setDescription(content);

  const handleSubmitClick = () => submitForm();

  return (
    <Container sidePadding thinWidth>
      <TitlePrimary title={'Create New Raffle'} />
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
              <SelectEvent
                errors={errors}
                label="POAP Selection"
                name="eligibleEvents"
                options={events}
                placeholder="Select eligible events"
                setFieldValue={setFieldValue}
                touched={touched}
                values={values}
              />
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
                label={<TimeLabel />}
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
              <Editor title={'Raffle description'} initialValue={description} onChange={handleEditorChange} />
            </Col>
            <Col span={24}>
              <PrizeContainer>
                <Input
                  label="Prizes"
                  errors={errors}
                  handleChange={handleChange}
                  name="prize"
                  placeholder="Add prizes you'd like to raffle!"
                  touched={touched}
                  values={values}
                  secondaryAction={addPrize}
                />
                <Button onClick={addPrize} type="primary" disabled={!!(values?.prize?.length === 0)}>
                  Add
                </Button>
              </PrizeContainer>
            </Col>
            <Col span={24}>
              {Array.isArray(prizes) && prizes.length > 0 && (
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

            <Col span={24}>
              <Checkbox
                handleChange={handleChange}
                name="emailRequired"
                sideText="Email required for participants"
                helpText="Users will have to submit an email when registering for this raffle"
                values={values}
              />
            </Col>

            {/*Legal requirements */}
            <Col span={24}>
              <Checkbox
                handleChange={handleChange}
                name="acceptedLegal"
                sideText="Accept terms of service and privacy policy"
                helpText="Raffles must be conducted by you in compliance with all laws and may not be used for gambling or illegal lotteries. Issuer is solely responsible for ensuring that its raffle complies with all applicable laws, including all prizes, descriptions and for making all necessary disclosures to users.  Your use of this service is subject to the POAP Terms of Service and Privacy Policy as found on poap.xyz."
                values={values}
              />
            </Col>
          </Row>
        </Form>
      </Card>
      <Button onClick={handleSubmitClick} type="primary" margin loading={isLoading}>
        Create raffle
      </Button>
    </Container>
  );
};

export default RaffleCreateForm;
