// sagas
import { takeEvery, put } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';

// actions
import { SampleActions, sampleActionOneFailure, sampleActionOneSuccess, SampleActionOneRequestAction } from './actions';

// Workers
function* sampleWorker(action: SampleActionOneRequestAction): SagaIterator {
  try {
    yield put(sampleActionOneSuccess());
  } catch (error) {
    yield put(sampleActionOneFailure());
  }
}

// Watchers
export function* sampleSaga(): SagaIterator {
  yield takeEvery(SampleActions.SAMPLE_ACTION_ONE_REQUEST, sampleWorker);
}
