import { PoapEvent, PoapEventDictionary, Raffle, CompleteRaffle } from 'lib/types';
import moment, { Moment } from 'moment-timezone';

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

export const mergeRaffleDatetime = (raffleDate: Moment, raffleTime: Moment): string => {
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
