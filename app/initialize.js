import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/App';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<App />, document.querySelector('#app'));
});
