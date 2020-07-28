import * as yup from 'yup';
import moment from 'moment';

export default yup.object().shape({
  name: yup.string().required('This field is required'),
  contact: yup.string().email('Invalid email').required('This field is required'),
  eligibleEvents: yup.array().required('This field is required'),
  raffleDate: yup
    .date()
    .required('This field is required')
    .min(moment().utc().subtract(1, 'days').toDate(), 'Raffle date should be at least in 10 minutes')
    .max(moment().add(1, 'year').toDate(), 'Raffle date should be within a year'),
  raffleTime: yup
    .date()
    .required('This field is required')
    .test('Future Date', 'Raffle time should be at least in 10 minutes', function (item) {
      let today = moment(new Date()).startOf('day');
      if (moment(this.parent.raffleDate).startOf('day').isSame(today)) {
        // if the date is today, validate hours
        let now = moment(new Date());
        let difference = moment(this.parent.raffleTime).diff(now, 'minute');
        return difference > 10;
      }
      return true;
    }),
});
