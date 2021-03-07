import {
  BUS_STOPS_FETCH,
  BUS_STOPS_FETCH_SUCCESS,
  BUS_STOPS_FETCH_FAILURE,
  BUS_STOPS_FILTER,
  BUS_STOP_SET_SELECTED,
  BUS_STOP_FETCH,
  BUS_STOP_FETCH_SUCCESS,
  BUS_STOP_FETCH_FAILURE,
} from 'actions/types';

/**
 * Initial state
 *
 * States here are intended to be used for a global component,
 * but might not be utilized for this demo.
 */
const initialState = {
  busStops: [],
  filters: {},
  isLoading: false,
  isLastPage: false,
  errorMessage: '',
  selectedBusStop: null,
  selectedBusStopIndex: -1
};

const reducer = (state = initialState, action) => {
  switch (action.type) {

    /**
     * API-managed logic fetch
     */
    case BUS_STOPS_FETCH:
      return {
        ...state,
        isLoading: true,
        errorMessage: ''
      };

    case BUS_STOPS_FETCH_SUCCESS: {
      const { payload } = action;

      return {
        ...state,
        busStops: [...state.busStops, ...(payload?.data || [])],
        isLoading: false,
        isLastPage: payload?.isLastPage || state.isLastPage
      };
    }

    // Empty on failure
    case BUS_STOPS_FETCH_FAILURE:
      return {
        ...state,
        busStops: [],
        isLoading: false,
        errorMessage: action.payload
      };

    /**
     * Used the filter current list or reset when needed
     */
    case BUS_STOPS_FILTER: {
      const { reset, filters = {} } = action.payload;

      return {
        ...state,
        busStops: reset ? [] : state.busStops,
        isLastPage: reset ? false : state.isLastPage,
        filters
      };
    }

    case BUS_STOP_SET_SELECTED:
      return {
        ...state,
        selectedBusStop: {...state.busStops[action.payload]},
        selectedBusStopIndex: action.payload
      };

    // Reset is done via saga
    case BUS_STOP_FETCH:
      return {
        ...state,
        isLoading: true,
        errorMessage: ''
      };

    // Sending no data will leave the data untouched
    case BUS_STOP_FETCH_SUCCESS: {
      const { payload } = action;
      const updatedBusStops = state.busStops;
      const index = state.selectedBusStopIndex;
      const shouldUpdate = index >= 0 && payload?.data !== undefined;

      if (shouldUpdate) {
        updatedBusStops[index] = {
          ...updatedBusStops[index],
          details: {...payload.data}
        };
      }

      return {
        ...state,
        busStops: updatedBusStops,
        isLoading: false,
        selectedBusStop: shouldUpdate ? updatedBusStops[index] : state.selectedBusStop,
        selectedBusStopIndex: index
      };
    }

    case BUS_STOP_FETCH_FAILURE:
      return {
        ...state,
        isLoading: false,
        errorMessage: action.payload
      };

    default: return { ...state };
  }
}

export default { initialState, reducer };
