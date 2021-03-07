import {
  BUS_STOPS_FETCH,
  BUS_STOPS_FETCH_SUCCESS,
  BUS_STOPS_FETCH_FAILURE,
  BUS_STOPS_FILTER,
  BUS_STOP_SET_SELECTED,
  BUS_STOP_FETCH,
  BUS_STOP_FETCH_SUCCESS,
  BUS_STOP_FETCH_FAILURE,
} from './types';

/**
 * Action Get bus stops
 */
export const getBusStops = (filters) => ({
  type: BUS_STOPS_FETCH,
  payload: filters
});


/**
 * Action Get bus stops success
 */
export const getBusStopsSuccess = ({ data, isLastPage = false }) => ({
  type: BUS_STOPS_FETCH_SUCCESS,
  payload: { data, isLastPage }
});

/**
 * Action Get bus stops failure
 */
export const getBusStopsFailure = (error) => ({
  type: BUS_STOPS_FETCH_FAILURE,
  payload: error
});

/**
 * Action Set bus stops filter
 */
export const setBusStopsFilter = ({ filters, reset = false }) => ({
  type: BUS_STOPS_FILTER,
  payload: { filters, reset }
});

/**
 * Action Set a bus stop from the bus stop list
 */
export const setSelectedBusStop = (index) => ({
  type: BUS_STOP_SET_SELECTED,
  payload: index
});

/**
 * Action Get single bus stop info
 *
 * byId can be used to override the index property currently set
 */
export const getBusStop = (byId, reset = false) => ({
  type: BUS_STOP_FETCH,
  payload: { byId, reset }
});


/**
 * Action Get single bus stop info success
 */
export const getBusStopSuccess = ({ data }) => ({
  type: BUS_STOP_FETCH_SUCCESS,
  payload: { data }
});

/**
 * Action Get single bus stop info failure
 */
export const getBusStopFailure = (error) => ({
  type: BUS_STOP_FETCH_FAILURE,
  payload: error
});
