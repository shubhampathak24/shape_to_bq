import {createStore, combineReducers, applyMiddleware, compose, Store} from 'redux';
// @ts-ignore
import keplerGlReducer from 'kepler.gl/reducers';
// @ts-ignore
import {taskMiddleware} from 'kepler.gl/middleware';

export function configureKeplerStore(): Store<any, any> {
  const reducers = combineReducers({
    keplerGl: keplerGlReducer
  });

  const middlewares = [taskMiddleware()];
  // redux devtools
  const enhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({trace: true, traceLimit: 25})(applyMiddleware(...middlewares))
    : compose(applyMiddleware(...middlewares));

  return createStore(reducers, enhancers);
}
