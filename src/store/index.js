import { createStore, applyMiddleware, compose } from 'redux';

import createSagaMiddleware from 'redux-saga';

import rootReducer from '../reducers/index';
import rootSaga from '../sagas';

const devtools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || (() => noop => noop);

export default function configureStore(initialState = {}) {
    const sagaMiddleware = createSagaMiddleware();

    const middlewares = [
        sagaMiddleware,
    ];

    const enhancers = [
        applyMiddleware(...middlewares),
        devtools(),
    ];

    const store = createStore(
        rootReducer,
        initialState,
        compose(...enhancers),
    );

    sagaMiddleware.run(rootSaga);

    return store;
}
