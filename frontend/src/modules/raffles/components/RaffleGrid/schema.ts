import * as yup from 'yup';

export default yup.object().shape({
  search: yup.string().required('Este campo es requerido'),
});
