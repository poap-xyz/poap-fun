// action types
export enum SampleActions {
  SAMPLE_ACTION_ONE_REQUEST = 'SAMPLE_ACTION_ONE_REQUEST',
  SAMPLE_ACTION_ONE_SUCCESS = 'SAMPLE_ACTION_ONE_SUCCESS',
  SAMPLE_ACTION_ONE_FAILURE = 'SAMPLE_ACTION_ONE_FAILURE',
}

// action creators
export const sampleActionOneRequest = (): SampleActionOneRequestAction => ({
  type: SampleActions.SAMPLE_ACTION_ONE_REQUEST,
  payload: {},
});

export const sampleActionOneSuccess = (): SampleActionOneSuccessAction => ({
  type: SampleActions.SAMPLE_ACTION_ONE_SUCCESS,
  payload: {},
});

export const sampleActionOneFailure = (): SampleActionOneFailureAction => ({
  type: SampleActions.SAMPLE_ACTION_ONE_FAILURE,
  payload: {},
});

export interface SampleActionOneRequestAction {
  type: SampleActions.SAMPLE_ACTION_ONE_REQUEST;
  payload: {};
}

// types
export interface SampleActionOneSuccessAction {
  type: SampleActions.SAMPLE_ACTION_ONE_SUCCESS;
  payload: {};
}

export interface SampleActionOneFailureAction {
  type: SampleActions.SAMPLE_ACTION_ONE_FAILURE;
  payload: {};
}
