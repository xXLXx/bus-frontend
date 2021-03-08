import React, { createContext, useReducer, useEffect, useCallback, useRef } from 'react';
import combinedReducers from './reducers';
import sagas from './sagas';
import * as actionTemplates from './actions';
import { useActions, applyMiddleware } from 'utils';
import config from 'config';

const StoreContext = createContext();

const StoreProvider = ({ children }) => {
  const { initialState, reducer } = combinedReducers;
  const [state, dispatch] = useReducer(reducer, initialState);
  const sagaActions = useRef([]);
  const enhancedDispatch = applyMiddleware(sagaActions, dispatch);
  const actions = useActions(actionTemplates, enhancedDispatch);

  const runSagas = useCallback(async () => {
    if (sagaActions?.current && sagaActions?.current.length >= 1) {
      const action = sagaActions.current.splice(0, 1)[0];
      if (config.store.debug) {
        console.info(`Saga ${action.type}`);
      }
      await Promise.all(sagas.map((saga) => saga(action, state, enhancedDispatch)));
      runSagas();
    }
  }, [enhancedDispatch, state]);

  /**
   * Not the preferred way to do this.
   * @TODO find a better solution to enchance the dispatch instead of using effect
   * where await can be inserted into the logic
   */
  useEffect(() => {
    runSagas();
  }, [state, runSagas]);

  return (
    <StoreContext.Provider value={{ state, actions }}>
      {children}
    </StoreContext.Provider>
  )
}

export { StoreContext, StoreProvider };
