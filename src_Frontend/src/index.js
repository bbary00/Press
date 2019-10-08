import 'bootstrap/dist/css/bootstrap.css';
import 'jquery';
import 'popper.js';
import * as serviceWorker from './serviceWorker';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import state from './redux/state';
import { subscribe, addSentencesFromSummarizedText, changeTextToProcess, changeNumberOfSentencesToProcess, changePercentOfSentencesToProcess, splitAndCalculateSentences } from './redux/state';


let reRenderEntireTree = (state) => {
    ReactDOM.render(
        <App state={state} 
            addSentencesFromSummarizedText={addSentencesFromSummarizedText} 
            splitAndCalculateSentences={splitAndCalculateSentences} 
            changeTextToProcess={changeTextToProcess} 
            changePercentOfSentencesToProcess={changePercentOfSentencesToProcess}
            changeNumberOfSentencesToProcess={changeNumberOfSentencesToProcess} />, document.getElementById('root'));
}

reRenderEntireTree(state);

subscribe(reRenderEntireTree);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


