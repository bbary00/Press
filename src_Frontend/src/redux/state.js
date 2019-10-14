import Tokenizer from 'sentence-tokenizer'
var tokenizer = new Tokenizer('Chuck');

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

    _changeTextToProcess(action) {    // 0. Calls every time user enter symbol in text area 1. Catches total string value entered by user in text area 2. Write new value to object "textToProcess" 3. ReRender SPA
        this._state.mainPage.textToProcess = action.text
        this._splitAndCalculateSentences(action.text)
        this._countMaximumNumberOfSentencesToChoose(this._state.mainPage.numberOfSentences)
        this._createArrayOfLabelsForDropdown(this._state.mainPage.maxNumberOfSentencesToChoose)
        this._calculateOneStepInRange() 
        this._createCheckpointsForRange()
        this._callSubscriber(this._state)
    },

    // ______________________________
    // RENDER SENTENCES FROM RESPONSE
    _addSentencesFromSummarizedText(action) {
        this._state.mainPage.textSummarized = []
        action.data.summary_text.map(item => this._state.mainPage.textSummarized.push(item))
        this._callSubscriber(this._state)
    },

    // ________________________
    // DROPDOWN AND RANGE LOGIC
    _changeNumberOfSentencesToProcess(action) { 
        // Executing after user set value in dropdown 
        this._state.mainPage.numberOfSentencesToProcess = action.number
        // console.log("numberOfSentencesToProcess = " + this._state.mainPage.numberOfSentencesToProcess)
        this._setPercentOfSentencesToProcess();
        this._callSubscriber(this._state)
    },
    _changePercentOfSentencesToProcess(action) {
        // Executing after user set value in range input 
        this._state.mainPage.rangeData.percentOfSentencesToProcess = action.value
        // console.log('percentOfSentencesToProcess = ' + this._state.mainPage.rangeData.percentOfSentencesToProcess)
        this._callSubscriber(this._state)
    },
    _moveRangeToClosestStep(action) {
        // Executing after user released mouse button in range input 
        console.log('Range drag is finished on value ' + action.value )
        this._state.mainPage.rangeData.percentOfSentencesToProcess = action.value
        let closest = this._state.mainPage.rangeData.checkPoints.sort( (a, b) => Math.abs(action.value - a) - Math.abs(action.value - b) )[0]
        console.log('Closest checkpoint = ' + closest)
        this._state.mainPage.rangeData.percentOfSentencesToProcess = closest
        this._setNumberOfSentencesToProcess(closest)
        this._callSubscriber(this._state)
    },

    // ___________________________________________________________
    // DROPDOWN OR RANGE AUTO SELECT (WHEN ONE OF THEM IS CHANGED)
    _setNumberOfSentencesToProcess(value) {
        let x = value / this._state.mainPage.rangeData.oneStepInRange
        this._state.mainPage.numberOfSentencesToProcess = Math.round(x)
    },
    _setPercentOfSentencesToProcess() {
        // console.log('One step in range = ' + this._state.mainPage.rangeData.oneStepInRange)
        let totalSteps = this._state.mainPage.rangeData.oneStepInRange * this._state.mainPage.numberOfSentencesToProcess
        let maxPercentSentencesToProcess = this._state.mainPage.rangeData.maxPercentSentencesToProcess
        let numberOfSentencesToProcess = this._state.mainPage.numberOfSentencesToProcess
        let dropdownOptionsLength = this._state.mainPage.dropdownOptions.length
        
        // Checking if user choose max number of sentences and total steps not equal to 100%
        // and if not, anyway set the 100% value
        if (totalSteps !== maxPercentSentencesToProcess && numberOfSentencesToProcess === dropdownOptionsLength) {
            this._state.mainPage.rangeData.percentOfSentencesToProcess = maxPercentSentencesToProcess
        } else {
            this._state.mainPage.rangeData.percentOfSentencesToProcess = totalSteps
        } 
        console.log('percentOfSentencesToProcess = ' + this._state.mainPage.rangeData.percentOfSentencesToProcess +'%')
    },

    // _______________________
    // ANALYZE TEXT FROM INPUT
    _splitAndCalculateSentences(text) {
        let newText = text.replace(/\n/gmi, " ")
        tokenizer.setEntry(newText)
        this._state.mainPage.allSentences = tokenizer.getSentences()
        this._state.mainPage.numberOfSymbols = text.length
        this._state.mainPage.numberOfSentences = this._state.mainPage.allSentences.length
        // console.log('This is all sentences ' + this._state.mainPage.allSentences)
        // console.log('Number of sentences: ' + this._state.mainPage.numberOfSentences);
    },
    _calculateOneStepInRange() {
        this._state.mainPage.rangeData.oneStepInRange = Math.round(this._state.mainPage.rangeData.maxPercentSentencesToProcess / this._state.mainPage.maxNumberOfSentencesToChoose)
        // debugger
    },
    _countMaximumNumberOfSentencesToChoose(number) {
        let value = number / 2
        // console.log('numberOfSentences / 2 = ' + value);
        let half = Math.floor(value)
        // console.log('numberOfSentences / 2 and floor()= ' + half);
        if (half < 10) {
            this._state.mainPage.maxNumberOfSentencesToChoose = half
        } else {
            this._state.mainPage.maxNumberOfSentencesToChoose = 10
        }
        // debugger
    },
    _createArrayOfLabelsForDropdown(number) {
        if (number) {
            this._state.mainPage.dropdownOptions = []
            for ( let e = 0; e < number ; ++e) {
                let item = { label: e+1, value: e+1 }
                this._state.mainPage.dropdownOptions.push(item)
                // console.log(this._state.mainPage.dropdownOptions);
            }
        } else {
            return false;
        }
    },
    _createCheckpointsForRange() {
        let newCheckPoints = []
        for ( let step = 0; step <= 100; ) {
            if (newCheckPoints.length < this._state.mainPage.dropdownOptions.length) {
                step += this._state.mainPage.rangeData.oneStepInRange
                newCheckPoints.push(step)
                continue;
            } else {
                console.log('Break!!!')
                break;
            }
        }
        newCheckPoints[newCheckPoints.length - 1] = 100
        this._state.mainPage.rangeData.checkPoints = []
        this._state.mainPage.rangeData.checkPoints = newCheckPoints
        console.log(this._state.mainPage.rangeData.checkPoints)
    },
    
    // ________
    // DISPATCH
    dispatch(action) {
            if (action.type === CHANGE_TEXT_TO_PROCESS) {
                this._changeTextToProcess(action)
            } else if (action.type === ADD_SENTENCES_FROM_SUMMARIZED_TEXT) {
                this._addSentencesFromSummarizedText(action)
            } else if (action.type === CHANGE_NUMBER_OF_SENTENCES_TO_PROCESS) {
                this._changeNumberOfSentencesToProcess(action)
            } else if (action.type === CHANGE_PERCENT_OF_SENTENCES_TO_PROCESS) {
                this._changePercentOfSentencesToProcess(action)
            } else if (action.type === MOVE_RANGE_TO_CLOSEST_STEP) {
                this._moveRangeToClosestStep(action)
            }
    }
}

// ____________
// ACTION TYPES
const CHANGE_TEXT_TO_PROCESS = 'CHANGE-TEXT-TO-PROCESS'
const ADD_SENTENCES_FROM_SUMMARIZED_TEXT = 'ADD-SENTENCES-FROM-SUMMARIZED-TEXT'
const CHANGE_NUMBER_OF_SENTENCES_TO_PROCESS = 'CHANGE-NUMBER-OF-SENTENCES-TO-PROCESS'
const CHANGE_PERCENT_OF_SENTENCES_TO_PROCESS = 'CHANGE-PERCENT-OF-SENTENCES-TO-PROCESS'
const MOVE_RANGE_TO_CLOSEST_STEP = 'MOVE-RANGE-TO-CLOSEST-STEP'

// _______________
// ACTION CREATORS 
export const changeTextToProcessCreator = (text) => {
    return {
        type: CHANGE_TEXT_TO_PROCESS,
        text: text
    }
}
export const addSentencesFromSummarizedTextCreator = (data) => {
    return {
        type: ADD_SENTENCES_FROM_SUMMARIZED_TEXT,
        data: data
    }
}
export const changeNumberOfSentencesToProcessCreator = (number) => {
    return {
        type: CHANGE_NUMBER_OF_SENTENCES_TO_PROCESS,
        number: number
    }
}
export const changePercentOfSentencesToProcessCreator = (value) => {
    return {
        type: CHANGE_PERCENT_OF_SENTENCES_TO_PROCESS,
        value: value
    }
}
export const moveRangeToClosestStepCreator = (value) => {
    return {
        type: MOVE_RANGE_TO_CLOSEST_STEP,
        value: value
    }
}

window.store = store; 

export default store;