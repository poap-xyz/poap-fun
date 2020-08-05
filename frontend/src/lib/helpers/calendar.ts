import moment from 'moment';

// Types
import { CalendarEvent } from 'lib/types';

const formatTime = (date: string) => {
  let formattedDate = moment.utc(date).format('YYYYMMDDTHHmmssZ');
  return formattedDate.replace('+00:00', 'Z');
};

const calculateDuration = (startTime: string, endTime: string) => {
  // snag parameters and format properly in UTC
  let end = moment.utc(endTime).format('DD/MM/YYYY HH:mm:ss');
  let start = moment.utc(startTime).format('DD/MM/YYYY HH:mm:ss');

  // calculate the difference in milliseconds between the start and end times
  let difference = moment(end, 'DD/MM/YYYY HH:mm:ss').diff(moment(start, 'DD/MM/YYYY HH:mm:ss'));

  // convert difference from above to a proper momentJs duration object
  let duration = moment.duration(difference);

  return Math.floor(duration.asHours()) + moment.utc(difference).format(':mm');
};

export const buildUrl = (event: CalendarEvent, type: string) => {
  let calendarUrl = '';

  switch (type) {
    case 'google':
      calendarUrl = 'https://calendar.google.com/calendar/render';
      calendarUrl += '?action=TEMPLATE';
      calendarUrl += '&dates=' + formatTime(event.startTime);
      calendarUrl += '/' + formatTime(event.endTime);
      calendarUrl += '&location=' + encodeURIComponent(event.location);
      calendarUrl += '&text=' + encodeURIComponent(event.title);
      calendarUrl += '&details=' + encodeURIComponent(event.description);
      break;

    case 'yahoo':
      // yahoo doesn't utilize endTime so we need to calulate duration
      let duration = calculateDuration(event.startTime, event.endTime);
      calendarUrl = 'https://calendar.yahoo.com/?v=60&view=d&type=20';
      calendarUrl += '&title=' + encodeURIComponent(event.title);
      calendarUrl += '&st=' + formatTime(event.startTime);
      calendarUrl += '&dur=' + duration;
      calendarUrl += '&desc=' + encodeURIComponent(event.description);
      calendarUrl += '&in_loc=' + encodeURIComponent(event.location);
      break;

    default:
      calendarUrl = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        'URL:' + document.URL,
        'DTSTART:' + formatTime(event.startTime),
        'DTEND:' + formatTime(event.endTime),
        'SUMMARY:' + event.title,
        'DESCRIPTION:' + event.description,
        'LOCATION:' + event.location,
        'END:VEVENT',
        'END:VCALENDAR',
      ].join('\n');
      calendarUrl = encodeURI('data:text/calendar;charset=utf8,' + calendarUrl);
  }

  return calendarUrl;
};
