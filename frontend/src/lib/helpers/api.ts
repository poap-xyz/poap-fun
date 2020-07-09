import { PoapEvent, PoapEventDictionary, Raffle, CompleteRaffle } from 'lib/types';

export const transformEventDictionary = (events: PoapEvent[]): PoapEventDictionary => {
  let eventDict: PoapEventDictionary = {};
  events.forEach((event) => {
    eventDict[event.id] = event;
  });
  return eventDict;
};

export const mergeRaffleEvent = (raffles: Raffle[], events: PoapEvent[]): CompleteRaffle[] => {
  let eventDict = transformEventDictionary(events);

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
