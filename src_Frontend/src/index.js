// import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";

// import 'jquery';
// import 'popper.js';
import * as serviceWorker from './serviceWorker';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import store from './redux/state';
import { } from './redux/state';



let reRenderEntireTree = (state) => {
    ReactDOM.render(
        <App state={state}
            dispatch={store.dispatch.bind(store)} />, document.getElementById('root'));
}

reRenderEntireTree(store.getState());

store.subscribe(reRenderEntireTree);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


