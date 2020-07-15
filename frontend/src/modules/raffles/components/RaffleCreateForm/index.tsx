import React, { FC, useState } from 'react';
import { useFormik } from 'formik';
import { useHistory, generatePath } from 'react-router-dom';
import { Col, Row, Tooltip } from 'antd';
import moment from 'moment-timezone';

// Components
import Input from 'ui/components/Input';
import InputSearch from 'ui/components/InputSearch';
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

// Helpers
import { mergeRaffleDatetime } from 'lib/helpers/api';

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
  contact: string;
  weightedVote: boolean;
  eligibleEvents: number[];
  raffleDate: moment.Moment | undefined;
  raffleTime: moment.Moment | undefined;
};

const initialValues: RaffleCreateFormValue = {
  name: '',
  contact: '',
  eligibleEvents: [],
  weightedVote: false,
  raffleDate: undefined,
  raffleTime: undefined,
};

const RaffleCreateForm: FC = () => {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [description, setDescription] = useState<string>('');

  const { data: events } = useEvents();
  const { push } = useHistory();

  const handleOnSubmit = async ({
    name,
    contact,
    weightedVote,
    raffleDate,
    raffleTime,
    eligibleEvents,
  }: RaffleCreateFormValue) => {
    let submitPrizes: CreatePrize[] = prizes.map((prize) => ({ name: prize.name, order: prize.order }));
    let submitEvents: CreateEvent[] = eligibleEvents.map((event) => {
      let fullEvent = events ? events.find((each) => each.id === event) : null;
      let name = fullEvent ? fullEvent.name : 'POAP Name fetch failed';
      return { event_id: `${event}`, name };
    });

    // Combine dates and get timezone
    if (!raffleDate || !raffleTime) return;
    let raffleDatetime = mergeRaffleDatetime(raffleDate, raffleTime);

    let newRaffle: CreateRaffleValues = {
      name,
      description,
      contact,
      draw_datetime: raffleDatetime,
      one_address_one_vote: !weightedVote,
      prizes: submitPrizes,
      events: submitEvents,
    };

    // Submit raffle
    let raffle = await createRaffle(newRaffle);
    if (raffle) push(generatePath(ROUTES.raffleCreated, { id: raffle.id }));
  };

  // Hooks
  const [createRaffle, { isLoading }] = useCreateRaffle();

  // Lib hooks
  const { values, errors, touched, handleChange, submitForm, setFieldValue } = useFormik({
    initialValues,
    validationSchema: RaffleCreateFormSchema,
    onSubmit: handleOnSubmit,
  });

  const removePrize = (order: number) => {
    let newPrizes = prizes
      .filter((prize) => prize.order !== order)
      .map((prize, index) => {
        let newOrder = index + 1;
        return { ...prize, id: newOrder, order: newOrder };
      });
    setPrizes(newPrizes);
  };

  const addPrize = (value: string) => {
    if (!value || value.trim() === '') return;
    const position = prizes.length + 1;
    let newPrize: Prize = { id: position, order: position, name: value };
    setPrizes([...prizes, newPrize]);
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
            <Col offset={4} span={8}>
              <DatePicker
                setFieldValue={setFieldValue}
                name="raffleDate"
                label="Raffle Date"
                placeholder="Pick a date"
                futureDates
                touched={touched}
                errors={errors}
                values={values}
              />
            </Col>
            <Col span={8}>
              <TimePicker
                setFieldValue={setFieldValue}
                name="raffleTime"
                label={timeLabel}
                placeholder="Pick a time"
                touched={touched}
                errors={errors}
                values={values}
              />
            </Col>
            <Col span={24}>
              <Editor title={'Raffle description'} onChange={handleEditorChange} />
            </Col>
            <Col span={24}>
              <InputSearch
                name="prize"
                label="Prize"
                placeholder={`Enter whatever you want to raffle for the ${prizes.length + 1}º winner`}
                handleEnter={addPrize}
                buttonText={'Add'}
                helpText={'Add any amount of prizes you like to give away!'}
              />
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
                placeholder="Enter your email"
                helpText="Please, enter your email so the winners can contact you"
                touched={touched}
                values={values}
              />
            </Col>
          </Row>
        </Form>
      </Card>
      <Button onClick={handleSubmitClick} type="primary" margin loading={isLoading}>
        Submit
      </Button>
    </Container>
  );
};

export default RaffleCreateForm;
