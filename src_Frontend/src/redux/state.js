import Tokenizer from 'sentence-tokenizer'

var tokenizer = new Tokenizer('Chuck');

let state = {
    
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

}



// _____________________
// CHECK TEXT FROM INPUT

export const changeTextToProcess = (action) => {    // 0. Calls every time user enter symbol in text area 1. Catches total string value entered by user in text area 2. Write new value to object "textToProcess" 3. ReRender SPA
    state.mainPage.textToProcess = action.text
    splitAndCalculateSentences(action.text)
    countMaximumNumberOfSentencesToChoose(state.mainPage.numberOfSentences)
    createArrayOfLabelsForDropdown(state.mainPage.maxNumberOfSentencesToChoose)
    calculateOneStepInRange() 
    createCheckpointsForRange()
    reRenderEntireTree(state)
};

// ______________________________
// RENDER SENTENCES FROM RESPONSE

export const addSentencesFromSummarizedText = (action) => {
    state.mainPage.textSummarized = []
    action.data.summary_text.map(item => state.mainPage.textSummarized.push(item))
    reRenderEntireTree(state)
}

// ________________________
// DROPDOWN AND RANGE LOGIC

export const changeNumberOfSentencesToProcess = (action) => { 
    // Executing after user set value in dropdown 
    state.mainPage.numberOfSentencesToProcess = action.number
    // console.log("numberOfSentencesToProcess = " + state.mainPage.numberOfSentencesToProcess)
    setPercentOfSentencesToProcess();
    reRenderEntireTree(state)
}
export const changePercentOfSentencesToProcess = (action) => {
    // Executing after user set value in range input 
    state.mainPage.rangeData.percentOfSentencesToProcess = action.value
    // console.log('percentOfSentencesToProcess = ' + state.mainPage.rangeData.percentOfSentencesToProcess)
    reRenderEntireTree(state)
}
export const moveRangeToClosestStep = (action) => {
    // Executing after user released mouse button in range input 
    console.log('Range drag is finished on value ' + action.value )
    state.mainPage.rangeData.percentOfSentencesToProcess = action.value
    let closest = state.mainPage.rangeData.checkPoints.sort( (a, b) => Math.abs(action.value - a) - Math.abs(action.value - b) )[0]
    console.log('Closest checkpoint = ' + closest)
    state.mainPage.rangeData.percentOfSentencesToProcess = closest
    setNumberOfSentencesToProcess(closest)
    reRenderEntireTree(state)
}

// ___________________________________________________________
// DROPDOWN OR RANGE AUTO SELECT (WHEN ONE OF THEM IS CHANGED)

const setNumberOfSentencesToProcess = (closest) => {
    let x = closest / state.mainPage.rangeData.oneStepInRange
    state.mainPage.numberOfSentencesToProcess = Math.round(x)
}

const setPercentOfSentencesToProcess = () => {
    console.log('One step in range = ' + state.mainPage.rangeData.oneStepInRange)
    let totalSteps = state.mainPage.rangeData.oneStepInRange * state.mainPage.numberOfSentencesToProcess
    
    // Checking if user choose max number of sentences and if total steps are more than 100%
    // and if so, set the 100% value, if not set current value of range
    if ((totalSteps > state.mainPage.rangeData.maxPercentSentencesToProcess || totalSteps < state.mainPage.rangeData.maxPercentSentencesToProcess)  && (state.mainPage.numberOfSentencesToProcess === state.mainPage.dropdownOptions.length)) {
        state.mainPage.rangeData.percentOfSentencesToProcess = state.mainPage.rangeData.maxPercentSentencesToProcess
    } else {
        state.mainPage.rangeData.percentOfSentencesToProcess = state.mainPage.rangeData.oneStepInRange * state.mainPage.numberOfSentencesToProcess
    } 
    console.log('percentOfSentencesToProcess = ' + state.mainPage.rangeData.percentOfSentencesToProcess +'%')
}

// _______________________
// ANALYZE TEXT FROM INPUT

const splitAndCalculateSentences = (text) => {
    let newText = text.replace(/\n/gmi, " ")
    tokenizer.setEntry(newText)
    state.mainPage.allSentences = tokenizer.getSentences()
    state.mainPage.numberOfSymbols = text.length
    state.mainPage.numberOfSentences = state.mainPage.allSentences.length
    // console.log('This is all sentences ' + state.mainPage.allSentences)
    // console.log('Number of sentences: ' + state.mainPage.numberOfSentences);
}
const calculateOneStepInRange = () => {
    state.mainPage.rangeData.oneStepInRange = Math.round(state.mainPage.rangeData.maxPercentSentencesToProcess / state.mainPage.maxNumberOfSentencesToChoose)
    // debugger
}
const countMaximumNumberOfSentencesToChoose = (number) => {
    let value = number / 2
    // console.log('numberOfSentences / 2 = ' + value);
    let half = Math.floor(value)
    // console.log('numberOfSentences / 2 and floor()= ' + half);
    if (half < 10) {
        state.mainPage.maxNumberOfSentencesToChoose = half
    } else {
        state.mainPage.maxNumberOfSentencesToChoose = 10
    }
    // debugger
}
const createArrayOfLabelsForDropdown = (number) => {
    if (number) {
        state.mainPage.dropdownOptions = []
        for ( let e = 0; e < number ; ++e) {
            let item = { label: e+1, value: e+1 }
            state.mainPage.dropdownOptions.push(item)
            // console.log(state.mainPage.dropdownOptions);
        }
    } else {
        return false;
    }
}
const createCheckpointsForRange = () => {
    let newCheckPoints = []
    for ( let step = 0; step <= 100; ) {
        if (newCheckPoints.length < state.mainPage.dropdownOptions.length) {
            step += state.mainPage.rangeData.oneStepInRange
            newCheckPoints.push(step)
            continue;
        } else {
            console.log('Break!!!')
            break;
        }
    }
    newCheckPoints[newCheckPoints.length - 1] = 100
    state.mainPage.rangeData.checkPoints = []
    state.mainPage.rangeData.checkPoints = newCheckPoints
    console.log(state.mainPage.rangeData.checkPoints)
}

// ________________
// OBSERVER PATTERN

let reRenderEntireTree = (state) => {}
export const subscribe = (observer) =>{
    reRenderEntireTree = observer
}

// ________
// DISPATCH

export let dispatch = (action) => { // { type: ADD_POST }
        if (action.type === CHANGE_TEXT_TO_PROCESS) {
            changeTextToProcess(action)
        } else if (action.type === ADD_SENTENCES_FROM_SUMMARIZED_TEXT) {
            addSentencesFromSummarizedText(action)
        } else if (action.type === CHANGE_NUMBER_OF_SENTENCES_TO_PROCESS) {
            changeNumberOfSentencesToProcess(action)
        } else if (action.type === CHANGE_PERCENT_OF_SENTENCES_TO_PROCESS) {
            changePercentOfSentencesToProcess(action)
        } else if (action.type === MOVE_RANGE_TO_CLOSEST_STEP) {
            moveRangeToClosestStep(action)
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

window.state = state; 
export default state;