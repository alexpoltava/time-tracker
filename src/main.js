import 'babel-polyfill';

import ReactDOM from 'react-dom';
import React from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';

import App from './components/App.jsx';

// styles
import 'normalize.css';
import './assets/main.css';

injectTapEventPlugin();

ReactDOM.render(<App />, document.getElementById('root'));
