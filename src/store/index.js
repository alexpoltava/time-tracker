import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';

import rootReducer from '../reducers/index';
import rootSaga from '../sagas';

const devtools = window.devToolsExtension || (() => noop => noop);

export default function configureStore(initialState = {}, history) {
    const sagaMiddleware = createSagaMiddleware();

    const middlewares = [
        thunk,
        routerMiddleware(history),
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
