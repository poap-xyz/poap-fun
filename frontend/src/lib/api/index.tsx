import { message } from 'antd';
import { useHistory } from 'react-router-dom';
import wretch, { WretcherError } from 'wretch';

// Lib
import { ROUTES } from 'lib/routes';

// env
const { REACT_APP_API_FUN, REACT_APP_API_POAP } = process.env;

// Endpoints
export const endpoints = {
  poap: {
    events: `${REACT_APP_API_POAP}/events`,
  },
  fun: {
    raffles: {
      all: `${REACT_APP_API_FUN}/api/v1/raffles/`,
      detail: (id: number) => `${REACT_APP_API_FUN}/api/v1/raffles/${id}/`,
      images: `${REACT_APP_API_FUN}/api/v1/raffles/text-editor-image/`,
    },
  },
};

// Handlers
const handleHttpError = (errorCode: number) => (error: WretcherError) => {
  try {
    const errorMessage = error?.message;

    if (error) {
      const parsedMessage = JSON.parse(errorMessage);

      for (const key in parsedMessage) {
        const value: string | string[] = parsedMessage[key];

        if (Array.isArray(value)) {
          value.forEach((valueString) => message.error(valueString));
        } else if (typeof value === 'string') {
          message.error(value);
        }
      }
    }
  } catch (error) {
    console.error(`Fetch error on ${errorCode} code parsing`, error);
  }

  throw error;
};

const handleGenericError = () => (error: WretcherError) => {
  message.error('An error ocurred');
  throw error;
};

const handleExpiredToken = () => (error: WretcherError) => {
  message.error('Forbidden access');
  const history = useHistory();

  history.push(ROUTES.home);

  throw error;
};

// Custom fetch
export const api = () => {
  return wretch()
    .catcher(401, handleExpiredToken())
    .catcher(404, handleGenericError())
    .catcher(405, handleHttpError(405))
    .catcher(400, handleHttpError(400));
};
