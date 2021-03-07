import config from 'config';

/**
 * Await-able HtML5 get location
 */
export const getCurrentLocation = () => {
  return new Promise(function(resolve, reject) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      reject(new Error('Your browser doesn\'t support geolocation.'));
    }
  });
}

/**
 * Combines reducers to generate a { initialState, reducer } object just like in redux-saga
 */
export const combineReducers = (nameReducerMap) => {
  const initialState = {};
  for (const key in nameReducerMap) {
    initialState[key] = nameReducerMap[key]?.initialState;
  }

  const reducer = (state = initialState, action) => {
    const newState = {...state};

    if (config.store.debug) {
      console.info(`Action ${action.type}: %O`, JSON.parse(JSON.stringify(action)));
    }

    for (var key in nameReducerMap) {
      if (nameReducerMap[key].reducer) {
        newState[key] = nameReducerMap[key].reducer(state[key], action);
      }
    }

    if (config.store.debug) {
      console.info(`State ${action.type}: %O`, JSON.parse(JSON.stringify(newState)));
    }

    // Mutate to trigger an effect
    return { ...newState };
  };

  return { initialState, reducer };
}

/**
 * Creates a hook that returns the actions just like redux-saga
 */
export const useActions = (actions, dispatch) => {
  const dispatchActions = {};

  for (const key in actions) {
    dispatchActions[key] = (payload) => {
      dispatch(actions[key](payload));
    }
  }

  return dispatchActions;
}

/**
 * Higher-order function that creates a middleware hook for our functional sagas
 */
export const applyMiddleware = (sagaActions, dispatch) => {
  return async (action) => {
    sagaActions.current.push(action);
    dispatch(action);
  };
}

/**
 * Coverts object to query
 *
 * @param Object data key as key and value as value
 */
export const toQuery = (data) => {
  return Object.keys(data).reduce((acc, key) => (
    `${acc}${acc ? '&' : ''}${key}=${encodeURIComponent(data[key])}`
  ), '');
}
