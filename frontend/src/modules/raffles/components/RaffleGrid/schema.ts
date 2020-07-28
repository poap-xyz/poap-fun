import * as yup from 'yup';

export default yup.object().shape({
  search: yup.string().required('This field is required'),
});
