import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';
import 'promise-polyfill/src/polyfill';
import './styles/portal.css';

import App from './components/App';

ReactDOM.render(<App />, document.getElementById('root'));
