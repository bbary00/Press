import mainPageReducer from './mainPage-reducer.js'

let store = {
    _state: {
        mainPage: {
            allSentences: [],
            numberOfSymbols: 0,
            numberOfSentences: 0,
            textToProcess: '',
            maxNumberOfSentencesToChoose: undefined,
            dropdownOptions: [],
            numberOfSentencesToProcess: 'Select',
            rangeData: {
                maxPercentSentencesToProcess: 100,
                minPercentSentencesToProcess: 0,
                oneStepInRange: 0,
                checkPoints: [],
                percentOfSentencesToProcess: 0,
            },
            textSummarized: []
        },
    },
    getState() {
        return this._state;
    },
    _callSubscriber(state) {
    },

    subscribe(observer) {
        this._callSubscriber = observer
    },
    
    dispatch(action) {
        this._state.mainPage = mainPageReducer(this._state.mainPage, action);
        this._callSubscriber(this._state)
    }
}

window.store = store; 

export default store;