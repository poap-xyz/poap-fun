import React, { FC, useEffect, useState, useMemo } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { generatePath } from 'react-router';
import styled from '@emotion/styled';
import Confetti from 'react-confetti';
import { GiSpeaker, GiSpeakerOff } from 'react-icons/gi';

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
import RaffleStartModal from 'ui/components/RaffleStartModal';
import ActionButton from 'ui/components/ActionButton';
import EthStats from 'ui/components/EthStats';
import { Button } from 'ui/styled/antd/Button';

// Constants
import { ROUTES } from 'lib/routes';

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

// Helpers
import { mergeRaffleEvent } from 'lib/helpers/api';
import { isRaffleActive, isRaffleOnGoing, isRaffleFinished } from 'lib/helpers/raffles';

// Types
import { CompleteRaffle, JoinRaffleValues, Participant } from 'lib/types';

const ContactContainer = styled.div`
  margin: 24px auto 24px auto;
  display: flex;
  justify-content: center;
`;

const ContactButton = styled(Button)`
  width: 300px;
`;

const ContactModal = ({ id }: { id: number }) => {
  const { data: raffle } = useRaffle({ id });

  return (
    <>
      <p>If you have won, please contact the raffle organizer at:</p>
      <p>
        <a href={`mailto:${raffle?.contact}`} target="_blank" rel="noopener noreferrer">
          {raffle?.contact}
        </a>
      </p>
      <p>If you want to send a proof that you're the address owner, you can sign a mesagge on MyCrypto</p>
      <a href="https://mycrypto.com/sign-and-verify-message/sign" target="_blank" rel="noopener noreferrer">
        Sign message
      </a>
    </>
  );
};

const RaffleDetail: FC = () => {
  // React hooks
  const [completeRaffle, setRaffle] = useState<CompleteRaffle | null>(null);
  const [canJoinRaffle, setCanJoinRaffle] = useState<boolean>(true);

  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [joinDisabledReason, setJoinDisabledReason] = useState<string>('');

  const [lastResultsLength, setLastResultsLength] = useState(-1);
  const [shouldTriggerConfetti, setShouldTriggerConfetti] = useState<boolean>(false);
  const { rafflesInfo, isConnected, connectWallet, account, poaps, isFetchingPoaps, signMessage } = useStateContext();

  // Router hooks
  const { id } = useParams();
  const { push } = useHistory();

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
  const [soundEnabled, setSoundEnabled] = useState(false);
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
  const [joinRaffle, { isLoading: isJoiningRaffle }] = useJoinRaffle();

  // Effects
  useEffect(() => {
    if (!events || !raffle) return;
    let completeRaffles = mergeRaffleEvent([raffle], events);
    if (completeRaffles.length > 0) setRaffle(completeRaffles[0]);
  }, [raffle, events]); //eslint-disable-line

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

    if (results.entries.length !== lastResultsLength) {
      playNewWinner();
      setLastResultsLength((prevLastResultsLength) => prevLastResultsLength + 1);
    }
  }, [setLastResultsLength, results]); //eslint-disable-line

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
      setIsSigning(true);
      let typedSignedMessage = await signMessage(raffle);
      setIsSigning(false);
      if (typedSignedMessage.length > 1) {
        if (typedSignedMessage[0] === '') return;

        let participant: JoinRaffleValues = {
          signature: typedSignedMessage[0],
          message: typedSignedMessage[1],
          address: account,
          raffle_id: raffle.id,
        };
        try {
          await joinRaffle(participant);
        } catch (e) {}
        await refetchParticipants();
      }
    }
  };

  const onNewBlock = () => {
    if (soundEnabled) playBlockPassed();

    setTimeout(() => {
      if (raffle?.results_table) refetchResults();
      refetchBlocks();
    }, 6000);
  };

  // Constants
  const isActive: boolean = completeRaffle ? isRaffleActive(completeRaffle) : false;
  const isOngoing: boolean = completeRaffle ? isRaffleOnGoing(completeRaffle) : false;
  const isFinished: boolean = completeRaffle ? isRaffleFinished(completeRaffle) : false;

  const raffleStatus = useMemo(
    () =>
      new Proxy(
        { isActive, isOngoing },
        {
          set: function (target, key, value) {
            const shouldTriggerActionFromIsActive =
              target['isActive'] === false && key === 'isOngoing' && value === true;
            const shouldTriggerActionFromIsOngoing =
              target['isOngoing'] === false && key === 'isActive' && value === true;

            if (shouldTriggerActionFromIsActive || shouldTriggerActionFromIsOngoing) {
              playBeganRaffle();
            }

            target[key] = value;
            return true;
          },
        },
      ),
    [], //eslint-disable-line
  );

  useEffect(() => {
    raffleStatus.isOngoing = isOngoing;
    raffleStatus.isActive = isActive;
  }, [isActive, isOngoing]); //eslint-disable-line

  const resultParticipantsAddress = results?.entries?.map((entry: any) => entry.participant.address) ?? [];
  const activeParticipants: Participant[] =
    participantsData?.filter((participant: any) => !resultParticipantsAddress.includes(participant.address)) ?? [];

  const confettiWidth = (document.querySelector('#root') as HTMLElement)?.offsetWidth || 300;
  const confettiHeight = (document.querySelector('#root') as HTMLElement)?.offsetHeight || 200;

  // Effects
  useEffect(() => {
    if (!isOngoing || !results || !participantsData) return;
    setShouldTriggerConfetti(results?.entries?.length === participantsData.length);
    refetchRaffle();
  }, [isOngoing, participantsData, results, refetchRaffle]);

  const SoundComponent = (
    <div className="sound-icons">
      {soundEnabled ? (
        <GiSpeaker onClick={() => setSoundEnabled(false)} />
      ) : (
        <GiSpeakerOff onClick={() => setSoundEnabled(true)} />
      )}
    </div>
  );

  if (!completeRaffle) {
    return (
      <Container sidePadding thinWidth>
        <Loading />
      </Container>
    );
  }

  if (isActive) {
    return (
      <Container sidePadding thinWidth>
        <TitlePrimary
          secondaryComponent={SoundComponent}
          title={completeRaffle.name}
          activeTag={'Active'}
          editAction={handleEdit}
        />
        {completeRaffle.draw_datetime ? (
          <Countdown
            datetime={completeRaffle.draw_datetime}
            finishAction={refetchRaffle}
            action={rafflesInfo[completeRaffle.id]?.token ? handleCounterAction : undefined}
          />
        ) : (
          <RaffleAnnouncement message={completeRaffle.start_date_helper} />
        )}

        <RaffleContent raffle={completeRaffle} />
        <ActionButton
          action={join}
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

  if (isOngoing) {
    return (
      <Container sidePadding thinWidth>
        <TitlePrimary secondaryComponent={SoundComponent} title={completeRaffle.name} />
        <EthStats raffle={completeRaffle.id} onBlockAction={onNewBlock} />

        <RaffleParticipants
          participants={activeParticipants}
          isLoading={isLoadingParticipants}
          canJoin={canJoinRaffle}
        />

        <RaffleWinners accountAddress={account} winners={results} isLoading={isLoadingResults} />

        <RaffleBlocks isLoading={isLoadingBlocks} blocks={blocksData} />

        <BadgeParty />
      </Container>
    );
  }

  if (isFinished) {
    return (
      <Container sidePadding thinWidth>
        <TitlePrimary title={completeRaffle.name} activeTag={'Finished'} />
        <RaffleContent raffle={completeRaffle} />

        <RaffleWinners accountAddress={account} winners={results} isLoading={isLoadingResults} />

        <ContactContainer>
          <ContactButton type="primary" margin onClick={handleContactModal}>
            Contact Event Organizer
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
