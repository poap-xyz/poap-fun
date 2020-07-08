import { PoapEvent, Raffle, CompleteRaffle } from 'lib/types';

export const mergeRaffleEvent = (raffles: Raffle[], events: PoapEvent[]): CompleteRaffle[] => {
  let eventDict: { [id: number]: PoapEvent } = {};
  events.forEach((event) => {
    eventDict[event.id] = event;
  });

  let completeRaffles: CompleteRaffle[] = [];
  raffles.forEach((raffle) => {
    let completeRaffle = {
      ...raffle,
      events: raffle.events.map((each) => eventDict[parseInt(each.event_id, 10)]),
    };
    completeRaffles.push(completeRaffle);
  });
  return completeRaffles;
};
