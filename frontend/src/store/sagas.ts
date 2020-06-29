import { all } from 'redux-saga/effects';

// Sagas
import { sampleSaga } from 'modules/sample/sagas';

export function* rootSaga() {
  yield all([sampleSaga()]);
}
