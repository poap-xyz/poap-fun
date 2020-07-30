import * as yup from 'yup';
import moment from 'moment';

export default yup.object().shape({
  name: yup.string().required('This field is required'),
  contact: yup.string().email('Invalid email').required('This field is required'),
  eligibleEvents: yup.array().required('This field is required'),
  undefinedDrawDateTime: yup.boolean(),
  startDateHelper: yup.string().test('Undefined date', 'This field is required', function (value) {
    return !this.parent.undefinedDrawDateTime || (this.parent.undefinedDrawDateTime && value);
  }),
  raffleDate: yup
    .date()
    .test('Defined date', 'This field is required', function (value) {
      return this.parent.undefinedDrawDateTime || value;
    })
    .min(moment().utc().subtract(1, 'days').toDate(), 'Raffle date should be a future date')
    .max(moment().add(1, 'year').toDate(), 'Raffle date should be within a year'),
  raffleTime: yup
    .date()
    .test('Defined date', 'This field is required', function (value) {
      return this.parent.undefinedDrawDateTime || value;
    })
    .test('Future Date', 'Raffle time should be a future time', function (value) {
      if (!this.parent.undefinedDrawDateTime) {
        let today = moment(new Date()).startOf('day');
        if (moment(this.parent.raffleDate).startOf('day').isSame(today)) {
          // if the date is today, validate hours
          let now = moment(new Date());
          let difference = moment(value).diff(now, 'seconds');
          return difference > 0;
        }
      }
      return true;
    }),
});
