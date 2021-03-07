import { combineReducers } from 'utils';
import busStopsReducer from './busStopsReducer';

/**
 * Reducers
 */
const reducers = combineReducers({
  busStops: busStopsReducer
});

export default reducers;
