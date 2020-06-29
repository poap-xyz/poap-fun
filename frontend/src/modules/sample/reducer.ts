import {
  SampleActionOneRequestAction,
  SampleActionOneSuccessAction,
  SampleActionOneFailureAction,
  SampleActions,
} from './actions';

// initial state
export const INITIAL_STATE = {
  data: '',
};

// initial state types
export type SampleState = {
  data: string;
};

// reducer types
export type SampleAction = SampleActionOneRequestAction | SampleActionOneSuccessAction | SampleActionOneFailureAction;

function sampleReducer(state: SampleState = INITIAL_STATE, action: SampleAction) {
  switch (action.type) {
    case SampleActions.SAMPLE_ACTION_ONE_REQUEST: {
      return {
        ...state,
      };
    }
    case SampleActions.SAMPLE_ACTION_ONE_SUCCESS: {
      return {
        ...state,
      };
    }
    case SampleActions.SAMPLE_ACTION_ONE_FAILURE: {
      return {
        ...state,
      };
    }
    default: {
      return state;
    }
  }
}

export default sampleReducer;
