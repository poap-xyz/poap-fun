import * as yup from 'yup';

const today = new Date();
const aYearFromNow = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());

export default yup.object().shape({
  name: yup.string().required('This field is required'),
  description: yup.string().required('This field is required'),
  contact: yup.string().email('Invalid email').required('This field is required'),
  raffleDate: yup
    .date()
    .required('This field is required')
    .min(new Date(), 'Raffle date should be at least in 20 minutes')
    .max(aYearFromNow, 'Raffle date should be within a year'),
});
