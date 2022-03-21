import moment, { Moment } from 'moment-timezone';
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
  let eventListComplete = events.length > 0;

  let completeRaffles: CompleteRaffle[] = [];
  raffles.forEach((raffle) => {
    let completeRaffle = {
      ...raffle,
      events: raffle.events.map((each) => {
        if (eventListComplete) {
          return eventDict[parseInt(each.event_id, 10)];
        }
        let _event: PoapEvent = {
          id: parseInt(each.event_id, 10),
          fancy_id: '',
          name: each.name,
          event_url: '',
          image_url: '',
          country: '',
          city: '',
          description: '',
          year: 0,
          start_date: '',
          end_date: '',
        };
        return _event;
      }),
    };
    completeRaffles.push(completeRaffle);
  });
  return completeRaffles;
};

export const regenerateRaffleEvents = (raffles: CompleteRaffle[], events: PoapEvent[]): CompleteRaffle[] => {
  let eventDict = transformEventDictionary(events);
  let completeRaffles: CompleteRaffle[] = [];
  raffles.forEach((raffle) => {
    let completeRaffle = {
      ...raffle,
      events: raffle.events.map((each) => eventDict[each.id]),
    };
    completeRaffles.push(completeRaffle);
  });
  return completeRaffles;
};

export const mergeRaffleDatetime = (raffleDate: Moment | undefined, raffleTime: Moment | undefined): string => {
  if (!raffleDate || !raffleTime) return '';
  try {
    let raffleDatetime = raffleDate
      .hours(raffleTime.hours())
      .minutes(raffleTime.minutes())
      .seconds(0)
      .format('YYYY-MM-DD HH:mm:ss');
    let tz = moment().utcOffset() / 60;
    let offset = tz > 0 ? `+${tz.toString().padStart(2, '0')}` : `-${(tz * -1).toString().padStart(2, '0')}`;
    return `${raffleDatetime}${offset}:00`;
  } catch (e) {
    return '';
  }
};
