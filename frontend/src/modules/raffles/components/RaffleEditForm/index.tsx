import React, { FC, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useHistory, useParams, generatePath } from 'react-router-dom';
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
import Editor from 'ui/components/Editor';
import InputTitle from 'ui/styled/InputTitle';
import EventDisplay from 'ui/components/EventDisplay';

// Helpers
import { injectErrorsFromBackend } from 'lib/helpers/formik';
import { mergeRaffleEvent } from 'lib/helpers/api';

// Constants
import { ROUTES } from 'lib/routes';

// Hooks
import { useEvents } from 'lib/hooks/useEvents';
import { useEditRaffle } from 'lib/hooks/useEditRaffle';
import { useStateContext } from 'lib/hooks/useCustomState';

// Schema
import RaffleEditFormSchema from './schema';

// Types
import { Prize, CompleteRaffle } from 'lib/types';
export type RaffleEditFormValue = {
  name: string;
  contact: string;
  weightedVote: boolean;
  raffleDate: moment.Moment | undefined;
  raffleTime: moment.Moment | undefined;
};

const RaffleEditForm: FC = () => {
  const { push } = useHistory();
  const { id } = useParams();
  const { rafflesInfo } = useStateContext();
  const raffle = rafflesInfo[id];

  const { data: events } = useEvents();

  const [prizes, setPrizes] = useState<Prize[]>(raffle.prizes);
  const [description, setDescription] = useState<string>(raffle.description);
  const [completeRaffle, setCompleteRaffle] = useState<CompleteRaffle | null>(null);

  const handleOnSubmit = async ({ name, contact, weightedVote, raffleDate, raffleTime }: RaffleEditFormValue) => {
    console.log('name: ', name);
    console.log('contact: ', contact);
    console.log('weightedVote: ', weightedVote);
    console.log('Submit PATCH');
  };

  // Hooks
  const [patchRaffle, { isLoading }] = useEditRaffle();

  const initialValues: RaffleEditFormValue = {
    name: raffle.name,
    contact: raffle.contact,
    weightedVote: !raffle.one_address_one_vote,
    raffleDate: moment.utc(raffle.draw_datetime).local(),
    raffleTime: moment.utc(raffle.draw_datetime).local(),
  };

  // Lib hooks
  const { values, errors, touched, handleChange, submitForm, setFieldValue } = useFormik({
    initialValues,
    validationSchema: RaffleEditFormSchema,
    onSubmit: injectErrorsFromBackend<RaffleEditFormValue>(handleOnSubmit),
  });

  useEffect(() => {
    if (!events || !raffle) return;
    let completeRaffles = mergeRaffleEvent([raffle], events);
    if (completeRaffles.length > 0) setCompleteRaffle(completeRaffles[0]);
  }, [events]); //eslint-disable-line

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
              <Editor title={'Raffle description'} onChange={handleEditorChange} initialValue={description} />
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

export default RaffleEditForm;
