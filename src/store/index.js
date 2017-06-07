import { createStore, applyMiddleware, compose } from 'redux';

import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';

import rootReducer from '../reducers/index';
import rootSaga from '../sagas';

const devtools = window.devToolsExtension || (() => noop => noop);

export default function configureStore(initialState = {}) {
    const sagaMiddleware = createSagaMiddleware();

    const middlewares = [
        thunk,
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
