import React, { FC, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { generatePath } from 'react-router';
import styled from '@emotion/styled';
import Confetti from 'react-confetti';
import { Tooltip } from 'antd';
import { GiSpeaker, GiSpeakerOff } from 'react-icons/gi';
import { FiCalendar, FiBellOff, FiBell } from 'react-icons/fi';

// Components
import { Container } from 'ui/styled/Container';
import TitlePrimary from 'ui/components/TitlePrimary';
import Loading from 'ui/components/Loading';
import Countdown from 'ui/components/Countdown';
import RaffleAnnouncement from 'ui/components/RaffleAnnouncement';
import RaffleContent from 'ui/components/RaffleContent';
import RaffleWinners from 'ui/components/RaffleWinners';
import RaffleBlocks from 'ui/components/RaffleBlocks';
import RaffleParticipants from 'ui/components/RaffleParticipants';
import BadgeParty from 'ui/components/BadgeParty';
import RaffleEditModal from 'ui/components/RaffleEditModal';
import RaffleParticipantEmailModal from 'ui/components/RaffleParticipantEmailModal';
import RaffleStartModal from 'ui/components/RaffleStartModal';
import ContactModal from 'ui/components/ContactModal';
import CalendarModal from 'ui/components/CalendarModal';
import ActionButton from 'ui/components/ActionButton';
import EthStats from 'ui/components/EthStats';
import { Button } from 'ui/styled/antd/Button';

// Constants
import { ROUTES } from 'lib/routes';
import { BREAKPOINTS } from 'lib/constants/theme';

// Hooks
import { useSounds } from 'lib/hooks/useSounds';
import { useEvents } from 'lib/hooks/useEvents';
import { useRaffle } from 'lib/hooks/useRaffle';
import { useModal } from 'lib/hooks/useModal';
import { useResults } from 'lib/hooks/useResults';
import { useBlocks } from 'lib/hooks/useBlocks';
import { useJoinRaffle } from 'lib/hooks/useJoinRaffle';
import { useParticipants } from 'lib/hooks/useParticipants';
import { useStateContext } from 'lib/hooks/useCustomState';
import { useSubscribe, useUnsubscribe } from 'lib/hooks/useNotifications';

// Helpers
import { mergeRaffleEvent } from 'lib/helpers/api';
import { isRaffleOnGoing, isRaffleFinished } from 'lib/helpers/raffles';
import { getToken } from 'lib/push-notifications';
import { safeGetItem } from 'lib/helpers/localStorage';

// Types
import { CompleteRaffle, JoinRaffleValues, Participant, SubscriptionValues } from 'lib/types';

const ContactContainer = styled.div`
  margin: 24px auto 24px auto;
  display: flex;
  justify-content: center;
`;

const ContactButton = styled(Button)`
  width: 300px;
`;

const ActionIcons = styled.div`
  text-align: center;
  @media (max-width: ${BREAKPOINTS.sm}) {
    padding: 10px 0;
  }
  svg {
    width: 20px;
    height: 20px;
    cursor: pointer;
    margin: 5px;

    @media (max-width: ${BREAKPOINTS.sm}) {
      width: 30px;
      height: 30px;
      margin: 5px 10px;
    }
  }
`;

const STATUS = {
  ACTIVE: 'active',
  ONGOING: 'ongoing',
  FINISHED: 'finished',
};

const RaffleDetail: FC = () => {
  // React hooks
  const [raffleStatus, setRaffleStatus] = useState<string>('');
  const [actionButtonText, setActionButtonText] = useState<string>('Join Raffle');
  const [raffleInitialStatus, setInitialRaffleStatus] = useState<string>('');
  const [completeRaffle, setRaffle] = useState<CompleteRaffle | null>(null);
  const [canJoinRaffle, setCanJoinRaffle] = useState<boolean>(true);
  const [participantEmail, setParticipantEmail] = useState<string>('');

  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [joinDisabledReason, setJoinDisabledReason] = useState<string>('');

  const [pollingEnabled, SetPollingEnabled] = useState<boolean>(false);
  const [lastResultsLength, setLastResultsLength] = useState(-1);
  const [shouldTriggerConfetti, setShouldTriggerConfetti] = useState<boolean>(false);
  const {
    rafflesInfo,
    isConnected,
    connectWallet,
    account,
    poaps,
    isFetchingPoaps,
    signMessage,
    token,
    saveToken,
  } = useStateContext();

  // Router hooks
  const { id } = useParams();
  const { push } = useHistory();

  if (isNaN(id)) push(ROUTES.home);

  // Query hooks
  const { data: events } = useEvents();
  const { data: raffle, refetch: refetchRaffle } = useRaffle({ id: parseInt(id, 10) });

  const { data: results, isLoading: isLoadingResults, refetch: refetchResults } = useResults({
    id: raffle?.results_table,
  });
  const { data: participantsData, isLoading: isLoadingParticipants, refetch: refetchParticipants } = useParticipants({
    raffle: id,
  });
  const { data: blocksData, isLoading: isLoadingBlocks, refetch: refetchBlocks } = useBlocks({
    raffle: id,
  });

  // Lib hooks
  let notifications = safeGetItem('pushs', '[]');
  const [pushEnabled, setPushEnabled] = useState<boolean>(notifications.indexOf(parseInt(id, 10)) > -1);

  const [soundEnabled, setSoundEnabled] = useState(safeGetItem('sound', 'false') === true);
  const { playBeganRaffle, playBlockPassed, playNewWinner } = useSounds({ soundEnabled });

  const { showModal: handleEdit } = useModal({
    component: RaffleEditModal,
    closable: true,
    className: '',
    footerButton: false,
    okButtonText: 'Close',
    width: 400,
    okButtonWidth: 70,
    id: parseInt(id, 10),
    onSuccess: (data: any) => {
      if (data?.id) push(generatePath(ROUTES.raffleEdit, { id: data.id }));
    },
  });
  const { showModal: handleCounterAction } = useModal({
    component: RaffleStartModal,
    closable: true,
    className: '',
    footerButton: false,
    okButtonText: 'Close',
    width: 400,
    okButtonWidth: 70,
    id: parseInt(id, 10),
    alert: !participantsData || participantsData?.length === 0,
    onSuccess: (data: any) => {
      refetchRaffle();
    },
  });
  const { showModal: handleContactModal } = useModal({
    component: ContactModal,
    closable: true,
    className: '',
    footerButton: false,
    okButtonText: 'Close',
    width: 400,
    okButtonWidth: 70,
    title: 'Contact organizer',
    id: parseInt(id, 10),
  });
  const { showModal: handleCalendarAction } = useModal({
    component: CalendarModal,
    closable: true,
    className: '',
    footerButton: false,
    okButtonText: 'Close',
    width: 400,
    okButtonWidth: 70,
    title: 'Add to calendar',
    id: parseInt(id, 10),
  });
  const { showModal: handleParticipantEmail, hideModal: hideParticipantEmailModal } = useModal({
    component: RaffleParticipantEmailModal,
    closable: true,
    className: '',
    footerButton: false,
    okButtonText: 'Close',
    width: 400,
    okButtonWidth: 70,
    id: parseInt(id, 10),
    onSuccess: (email: any) => {
      setParticipantEmail(email as string);
    },
  });
  const [joinRaffle, { isLoading: isJoiningRaffle }] = useJoinRaffle();

  // Notifications
  const [subscribe] = useSubscribe();
  const [unsubscribe] = useUnsubscribe();

  // Effects
  useEffect(() => {
    if (!events || !raffle) return;
    let completeRaffles = mergeRaffleEvent([raffle], events);
    if (completeRaffles.length > 0) {
      setRaffle(completeRaffles[0]);
    }
  }, [raffle, events]); //eslint-disable-line

  useEffect(() => {
    if (completeRaffle) calculateRaffleStatus(completeRaffle);
  }, [completeRaffle]); //eslint-disable-line

  useEffect(() => {
    if (participantEmail) {
      hideParticipantEmailModal();
      join();
    }
  }, [participantEmail]); //eslint-disable-line

  useEffect(() => {
    if (isConnected && isAccountParticipating()) {
      setJoinDisabledReason('You are already participating in this raffle');
      setCanJoinRaffle(false);
    }
  }, [account, participantsData]); //eslint-disable-line

  useEffect(() => {
    if (raffle && isConnected && !isFetchingPoaps && !canAccountParticipate()) {
      setJoinDisabledReason(`You don't have any eligible POAP${raffle.events.length > 1 ? 's' : ''}`);
      setCanJoinRaffle(false);
    }
  }, [poaps, raffle]); //eslint-disable-line

  useEffect(() => {
    if (!results) return;

    if (results.entries.length !== lastResultsLength && raffleStatus === STATUS.ONGOING) {
      setLastResultsLength((prevLastResultsLength) => prevLastResultsLength + 1);
      playNewWinner();
    }
  }, [setLastResultsLength, results]); //eslint-disable-line

  useEffect(() => {
    if (raffleStatus === STATUS.ONGOING) {
      const interval = setInterval(() => {
        refetchBlocks();
        if (completeRaffle?.results_table) refetchResults();
      }, 1000);
      return () => clearInterval(interval);
    }
    return;
  }, [pollingEnabled]); //eslint-disable-line

  useEffect(() => {
    localStorage.setItem('sound', soundEnabled.toString());
  }, [soundEnabled]); //eslint-disable-line

  useEffect(() => {
    if (raffleInitialStatus === '') {
      setInitialRaffleStatus(raffleStatus);
    } else if (raffleStatus === STATUS.FINISHED) {
      setShouldTriggerConfetti(true);
    }
  }, [raffleStatus]); //eslint-disable-line

  const calculateRaffleStatus = (raffle: CompleteRaffle) => {
    if (isRaffleFinished(raffle)) {
      setRaffleStatus(STATUS.FINISHED);
    } else if (isRaffleOnGoing(raffle)) {
      setRaffleStatus(STATUS.ONGOING);
    } else {
      setRaffleStatus(STATUS.ACTIVE);
    }
  };

  const isAccountParticipating = () => {
    if (account && participantsData && participantsData.length > 0) {
      return !!participantsData.find((each) => each.address.toLowerCase() === account.toLowerCase());
    }
    return false;
  };

  const canAccountParticipate = () => {
    if (raffle && poaps) {
      let events = raffle.events.map((event) => event.event_id);
      return poaps.filter((each) => events.includes(each.event.id.toString())).length > 0;
    }
    return false;
  };

  const join = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    if (raffle && account && !isAccountParticipating() && canAccountParticipate()) {
      if (raffle.email_required && !participantEmail) {
        handleParticipantEmail();
        return;
      }

      setIsSigning(true);
      setActionButtonText('Please follow instructions on your wallet');
      let typedSignedMessage = await signMessage(raffle);
      setIsSigning(false);
      setActionButtonText('Joining raffle');
      if (typedSignedMessage.length > 1) {
        if (typedSignedMessage[0] === '') return;

        let participant: JoinRaffleValues = {
          signature: typedSignedMessage[0],
          message: typedSignedMessage[1],
          address: account,
          raffle_id: raffle.id,
          email: participantEmail,
        };
        try {
          await joinRaffle(participant);
        } catch (e) {}
        await refetchParticipants();
      }
    }
    setActionButtonText('Join Raffle');
  };

  const onCountdownEnd = async () => {
    playBeganRaffle();
    setTimeout(() => {
      if (completeRaffle) calculateRaffleStatus(completeRaffle);
    }, 3000);
  };

  const onNewBlock = () => {
    playBlockPassed();
    if (!pollingEnabled) SetPollingEnabled(true);
  };

  const toggleNotification = async () => {
    if (!completeRaffle) return;

    setPushEnabled(!pushEnabled);

    let notifications = safeGetItem('pushs', '[]');
    if (pushEnabled) {
      // remove from local
      notifications = notifications.filter((each: number) => each !== completeRaffle.id);
      // remove subscription
      if (token) {
        const data: SubscriptionValues = {
          token,
          raffle_id: completeRaffle.id,
        };
        try {
          unsubscribe(data);
        } catch (e) {
          console.log(e);
        }
      }
    } else {
      // add to local
      notifications.push(completeRaffle.id);
      // subscribe
      let data: SubscriptionValues = {
        token: '',
        raffle_id: completeRaffle.id,
      };
      if (!token) {
        let _token = await getToken();
        saveToken(_token);
        data.token = _token;
      } else {
        data.token = token;
      }
      try {
        if (data.token) subscribe(data);
      } catch (e) {
        console.log(e);
      }
    }
    localStorage.setItem('pushs', JSON.stringify(notifications));
  };

  // Constants
  const resultParticipantsAddress = results?.entries?.map((entry: any) => entry.participant.id) ?? [];
  const activeParticipants: Participant[] =
    participantsData?.filter((participant: any) => !resultParticipantsAddress.includes(participant.id)) ?? [];

  const confettiWidth = (document.querySelector('#root') as HTMLElement)?.offsetWidth || 300;
  const confettiHeight = (document.querySelector('#root') as HTMLElement)?.offsetHeight || 200;

  // Effects
  useEffect(() => {
    if (!results || !participantsData) return;
    refetchRaffle();
  }, [participantsData, results, refetchRaffle]);

  const hasPushApi = 'PushManager' in window;
  const IconsComponent = (
    <ActionIcons>
      {hasPushApi && (
        <>
          {pushEnabled ? (
            <Tooltip title={'Disable push notifications'}>
              <FiBell onClick={toggleNotification} color={'var(--secondary-color)'} />
            </Tooltip>
          ) : (
            <Tooltip title={'Enable push notifications'}>
              <FiBellOff onClick={toggleNotification} color={'var(--secondary-color)'} />
            </Tooltip>
          )}
        </>
      )}
      {completeRaffle?.draw_datetime && raffleStatus === STATUS.ACTIVE && (
        <Tooltip title={'Add to calendar'}>
          <FiCalendar onClick={handleCalendarAction} color={'var(--secondary-color)'} />
        </Tooltip>
      )}
      {soundEnabled ? (
        <Tooltip title={'Mute raffle sounds'}>
          <GiSpeaker onClick={() => setSoundEnabled(false)} color={'var(--secondary-color)'} />
        </Tooltip>
      ) : (
        <Tooltip title={'Turn on raffle sounds!'}>
          <GiSpeakerOff onClick={() => setSoundEnabled(true)} color={'var(--secondary-color)'} />
        </Tooltip>
      )}
    </ActionIcons>
  );

  if (!completeRaffle) {
    return (
      <Container sidePadding thinWidth>
        <Loading />
      </Container>
    );
  }

  if (raffleStatus === STATUS.ACTIVE) {
    return (
      <Container sidePadding thinWidth>
        <TitlePrimary
          secondaryComponent={IconsComponent}
          title={completeRaffle.name}
          activeTag={'Active'}
          editAction={handleEdit}
        />
        {completeRaffle.draw_datetime ? (
          <Countdown
            datetime={completeRaffle.draw_datetime}
            finishAction={onCountdownEnd}
            action={rafflesInfo[completeRaffle.id]?.token ? handleCounterAction : undefined}
          />
        ) : (
          <RaffleAnnouncement message={completeRaffle.start_date_helper} />
        )}

        <RaffleContent raffle={completeRaffle} />
        <ActionButton
          action={join}
          text={actionButtonText}
          disabled={!canJoinRaffle}
          helpText={joinDisabledReason}
          loading={isJoiningRaffle || isSigning}
        />

        <RaffleParticipants
          participants={activeParticipants}
          isLoading={isLoadingParticipants}
          canJoin={canJoinRaffle}
        />
        <BadgeParty />
      </Container>
    );
  }

  if (raffleStatus === STATUS.ONGOING) {
    return (
      <Container sidePadding thinWidth>
        <TitlePrimary secondaryComponent={IconsComponent} title={completeRaffle.name} />
        <EthStats raffle={completeRaffle.id} onBlockAction={onNewBlock} />

        <RaffleParticipants
          participants={activeParticipants}
          isLoading={isLoadingParticipants}
          canJoin={canJoinRaffle}
        />

        <RaffleWinners
          accountAddress={account}
          winners={results}
          isLoading={isLoadingResults}
          prizes={completeRaffle.prizes}
        />

        <RaffleBlocks isLoading={isLoadingBlocks} blocks={blocksData} />

        <BadgeParty />
      </Container>
    );
  }

  if (raffleStatus === STATUS.FINISHED) {
    return (
      <Container sidePadding thinWidth>
        <TitlePrimary title={completeRaffle.name} activeTag={'Finished'} />
        <RaffleContent raffle={completeRaffle} />

        <RaffleWinners
          accountAddress={account}
          winners={results}
          isLoading={isLoadingResults}
          prizes={completeRaffle.prizes}
        />

        <ContactContainer>
          <ContactButton type="primary" margin onClick={handleContactModal}>
            Winner? Contact raffle organizer
          </ContactButton>
        </ContactContainer>
        <Confetti run={shouldTriggerConfetti} width={confettiWidth} height={confettiHeight} />

        <BadgeParty />
      </Container>
    );
  }

  return null;
};

export default RaffleDetail;
