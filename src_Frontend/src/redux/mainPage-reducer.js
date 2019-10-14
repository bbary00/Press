import Tokenizer from 'sentence-tokenizer'
var tokenizer = new Tokenizer('Chuck');

const CHANGE_TEXT_TO_PROCESS = 'CHANGE-TEXT-TO-PROCESS'
const ADD_SENTENCES_FROM_SUMMARIZED_TEXT = 'ADD-SENTENCES-FROM-SUMMARIZED-TEXT'
const CHANGE_NUMBER_OF_SENTENCES_TO_PROCESS = 'CHANGE-NUMBER-OF-SENTENCES-TO-PROCESS'
const CHANGE_PERCENT_OF_SENTENCES_TO_PROCESS = 'CHANGE-PERCENT-OF-SENTENCES-TO-PROCESS'
const MOVE_RANGE_TO_CLOSEST_STEP = 'MOVE-RANGE-TO-CLOSEST-STEP'

let initialState = {
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
}

const mainPageReducer = (state = initialState, action) => {
    // debugger;
    switch(action.type) {
        case CHANGE_TEXT_TO_PROCESS:
            changeTextToProcess(state, action)
            return state
        case ADD_SENTENCES_FROM_SUMMARIZED_TEXT: 
            addSentencesFromSummarizedText(state, action)
            return state
        case CHANGE_NUMBER_OF_SENTENCES_TO_PROCESS:
            changeNumberOfSentencesToProcess(state, action)
            return state
        case CHANGE_PERCENT_OF_SENTENCES_TO_PROCESS:
            changePercentOfSentencesToProcess(state, action)
            return state
        case MOVE_RANGE_TO_CLOSEST_STEP: 
            moveRangeToClosestStep(state, action)
            return state
        default: 
            return state
    }

    // if (action.type === CHANGE_TEXT_TO_PROCESS) {
    //     this._changeTextToProcess(action)
    // } else if (action.type === ADD_SENTENCES_FROM_SUMMARIZED_TEXT) {
    //     this._addSentencesFromSummarizedText(action)
    // } else if (action.type === CHANGE_NUMBER_OF_SENTENCES_TO_PROCESS) {
    //     this._changeNumberOfSentencesToProcess(action)
    // } else if (action.type === CHANGE_PERCENT_OF_SENTENCES_TO_PROCESS) {
    //     this._changePercentOfSentencesToProcess(action)
    // } else if (action.type === MOVE_RANGE_TO_CLOSEST_STEP) {
    //     this._moveRangeToClosestStep(action)
    // }
       
}

const changeTextToProcess = (state, action) => {    // 0. Calls every time user enter symbol in text area 1. Catches total string value entered by user in text area 2. Write new value to object "textToProcess" 3. ReRender SPA
        state.textToProcess = action.text
        splitAndCalculateSentences(state, action.text)
        countMaximumNumberOfSentencesToChoose(state, state.numberOfSentences)
        createArrayOfLabelsForDropdown(state, state.maxNumberOfSentencesToChoose)
        calculateOneStepInRange(state) 
        createCheckpointsForRange(state)
        return state
    }

// ______________________________
// RENDER SENTENCES FROM RESPONSE
const addSentencesFromSummarizedText = (state, action) => {
    state.textSummarized = []
    action.data.summary_text.map(item => state.textSummarized.push(item))
    return state
}

// ________________________
// DROPDOWN AND RANGE LOGIC
const changeNumberOfSentencesToProcess = (state, action) => { 
    // Executing after user set value in dropdown 
    state.numberOfSentencesToProcess = action.number
    // console.log("numberOfSentencesToProcess = " + state.numberOfSentencesToProcess)
    setPercentOfSentencesToProcess(state);
    return state
}

const changePercentOfSentencesToProcess = (state, action) => {
    // Executing after user set value in range input 
    state.rangeData.percentOfSentencesToProcess = action.value
    // console.log('percentOfSentencesToProcess = ' + state.rangeData.percentOfSentencesToProcess)
    return state
}
const moveRangeToClosestStep = (state, action) => {
    // Executing after user released mouse button in range input 
    console.log('Range drag is finished on value ' + action.value )
    state.rangeData.percentOfSentencesToProcess = action.value
    let closest = state.rangeData.checkPoints.sort( (a, b) => Math.abs(action.value - a) - Math.abs(action.value - b) )[0]
    console.log('Closest checkpoint = ' + closest)
    state.rangeData.percentOfSentencesToProcess = closest
    setNumberOfSentencesToProcess(state, closest)
    return state
}

// ___________________________________________________________
// DROPDOWN OR RANGE AUTO SELECT (WHEN ONE OF THEM IS CHANGED)
const setNumberOfSentencesToProcess = (state, value) => {
    let x = value / state.rangeData.oneStepInRange
    state.numberOfSentencesToProcess = Math.round(x)
    return state
}
const setPercentOfSentencesToProcess = (state) => {
    // console.log('One step in range = ' + state.rangeData.oneStepInRange)
    let totalSteps = state.rangeData.oneStepInRange * state.numberOfSentencesToProcess
    let maxPercentSentencesToProcess = state.rangeData.maxPercentSentencesToProcess
    let numberOfSentencesToProcess = state.numberOfSentencesToProcess
    let dropdownOptionsLength = state.dropdownOptions.length
    
    // Checking if user choose max number of sentences and total steps not equal to 100%
    // and if not, anyway set the 100% value
    if (totalSteps !== maxPercentSentencesToProcess && numberOfSentencesToProcess === dropdownOptionsLength) {
        state.rangeData.percentOfSentencesToProcess = maxPercentSentencesToProcess
    } else {
        state.rangeData.percentOfSentencesToProcess = totalSteps
    } 
    console.log('percentOfSentencesToProcess = ' + state.rangeData.percentOfSentencesToProcess +'%')
    return state
}

// _______________________
// ANALYZE TEXT FROM INPUT
const splitAndCalculateSentences = (state, text) => {
    let newText = text.replace(/\n/gmi, " ")
    tokenizer.setEntry(newText)
    state.allSentences = tokenizer.getSentences()
    state.numberOfSymbols = text.length
    state.numberOfSentences = state.allSentences.length
    // console.log('This is all sentences ' + state.allSentences)
    // console.log('Number of sentences: ' + state.numberOfSentences);
    return state
}
const calculateOneStepInRange = (state) => {
    state.rangeData.oneStepInRange = Math.round(state.rangeData.maxPercentSentencesToProcess / state.maxNumberOfSentencesToChoose)
    // debugger
    return state
}
const countMaximumNumberOfSentencesToChoose = (state, number) => {
    let value = number / 2
    // console.log('numberOfSentences / 2 = ' + value);
    let half = Math.floor(value)
    // console.log('numberOfSentences / 2 and floor()= ' + half);
    if (half < 10) {
        state.maxNumberOfSentencesToChoose = half
    } else {
        state.maxNumberOfSentencesToChoose = 10
    }
    // debugger
    return state
}
const createArrayOfLabelsForDropdown = (state, number) => {
    if (number) {
        state.dropdownOptions = []
        for ( let e = 0; e < number ; ++e) {
            let item = { label: e+1, value: e+1 }
            state.dropdownOptions.push(item)
            // console.log(state.dropdownOptions);
        }
    } else {
        return false;
    }
    return state
}
const createCheckpointsForRange = (state) => {
    let newCheckPoints = []
    for ( let step = 0; step <= 100; ) {
        if (newCheckPoints.length < state.dropdownOptions.length) {
            step += state.rangeData.oneStepInRange
            newCheckPoints.push(step)
            continue;
        } else {
            console.log('Break!!!')
            break;
        }
    }
    newCheckPoints[newCheckPoints.length - 1] = 100
    state.rangeData.checkPoints = []
    state.rangeData.checkPoints = newCheckPoints
    console.log(state.rangeData.checkPoints)
    return state
}



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

export default mainPageReducer