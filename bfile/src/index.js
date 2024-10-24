import "@babel/polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
//import registerServiceWorker from './registerServiceWorker';

//[];(function(){var uv=document.createElement('script');uv.type='text/javascript';uv.async=true;uv.src='//widget.uservoice.com/fyty0Sqgib6x84aHdMGDqg.js';var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(uv,s)})();

//window.Raven.config('https://9cbb2c9056f9433d8499445c08501d95@sentry.io/1222713').install()

ReactDOM.render(<App />, document.getElementById('root'));
//registerServiceWorker();
