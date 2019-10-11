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



// CHECK TEXT FROM INPUT
// _____________________

export const changeTextToProcess = (text) => {    // 0. Calls every time user enter symbol in text area 1. Catches total string value entered by user in text area 2. Write new value to object "textToProcess" 3. ReRender SPA
    state.mainPage.textToProcess = text
    splitAndCalculateSentences(text)
    countMaximumNumberOfSentencesToChoose(state.mainPage.numberOfSentences)
    createArrayOfLabelsForDropdown(state.mainPage.maxNumberOfSentencesToChoose)
    calculateOneStepInRange() 
    createCheckpointsForRange()
    reRenderEntireTree(state)
};


// DROPDOWN AND RANGE LOGIC
// ________________________

// Executing after user set value in dropdown 
export const changeNumberOfSentencesToProcess = (number) => {
    state.mainPage.numberOfSentencesToProcess = number
    // console.log("numberOfSentencesToProcess = " + state.mainPage.numberOfSentencesToProcess)
    setPercentOfSentencesToProcess();
    reRenderEntireTree(state)
}

export const changePercentOfSentencesToProcess = (value) => {
    state.mainPage.rangeData.percentOfSentencesToProcess = value
    // console.log('percentOfSentencesToProcess = ' + state.mainPage.rangeData.percentOfSentencesToProcess)
    reRenderEntireTree(state)
}


export const moveRangeToClosestStep = (value) => {
    console.log('Range drag is finished on value ' + value )
    state.mainPage.rangeData.percentOfSentencesToProcess = value
    let closest = state.mainPage.rangeData.checkPoints.sort( (a, b) => Math.abs(value - a) - Math.abs(value - b) )[0]
    console.log('Closest checkpoint = ' + closest)
    state.mainPage.rangeData.percentOfSentencesToProcess = closest
    setNumberOfSentencesToProcess(closest)
    reRenderEntireTree(state)
}

export const setNumberOfSentencesToProcess = (closest) => {
    let x = closest / state.mainPage.rangeData.oneStepInRange
    state.mainPage.numberOfSentencesToProcess = Math.round(x)
}


// Checking if user choose max number of sentences and if total steps are more than 100%
// and if so, set the 100% value, if no set current value of range
export const setPercentOfSentencesToProcess = () => {
    console.log('One step in range = ' + state.mainPage.rangeData.oneStepInRange)
    let totalSteps = state.mainPage.rangeData.oneStepInRange * state.mainPage.numberOfSentencesToProcess
    // Hack - to show maximum value in range input when chosen max value in dropdown
    // Sets new value to InputRange
    if ((totalSteps > state.mainPage.rangeData.maxPercentSentencesToProcess || totalSteps < state.mainPage.rangeData.maxPercentSentencesToProcess)  && (state.mainPage.numberOfSentencesToProcess === state.mainPage.dropdownOptions.length)) {
        state.mainPage.rangeData.percentOfSentencesToProcess = state.mainPage.rangeData.maxPercentSentencesToProcess
    } else {
        state.mainPage.rangeData.percentOfSentencesToProcess = state.mainPage.rangeData.oneStepInRange * state.mainPage.numberOfSentencesToProcess
    } 
    console.log('percentOfSentencesToProcess = ' + state.mainPage.rangeData.percentOfSentencesToProcess +'%')
}





// ANALYZE TEXT FROM INPUT
// _______________________

const splitAndCalculateSentences = (text) => {
    // console.log('Text before replace = ' + text)

    let newText = text.replace(/\n/gmi, " ")
   
    // console.log('Text after replacement = ' + newText)
    tokenizer.setEntry(newText)
    state.mainPage.allSentences = tokenizer.getSentences()
    state.mainPage.numberOfSymbols = text.length
    state.mainPage.numberOfSentences = state.mainPage.allSentences.length
    console.log('This is all sentences ' + state.mainPage.allSentences)
    // debugger;
    // console.log('numberOfSentences after if = ' + state.mainPage.numberOfSentences)
    // console.log(sentences);
    // console.log('Text length: ' + text.length)
    // console.log('All sentences: ' + state.mainPage.allSentences);
    console.log('Number of sentences: ' + state.mainPage.numberOfSentences);
};

// const splitAndCalculateSentences = (text) => {
//     let pattern = /(.+?([A-Za-z]|[А-Яа-яїіь].)\.(?:['")\\\s][\"]?)+?\s?)/igm, match
//     let sentences = []
//     while( ( match = pattern.exec( text )) != null ) {
//         if( match.index === pattern.lastIndex ) {
//             pattern.lastIndex++
//         }
//         sentences.push( match[0] )
//     };
//     state.mainPage.allSentences = sentences
//     state.mainPage.numberOfSymbols = text.length
//     console.log('This is all sentences ' + state.mainPage.allSentences)
//     
//     // console.log('numberOfSentences = ' + state.mainPage.allSentences.length)
//     if (/\s$/.test(text)) {
//         state.mainPage.numberOfSentences = state.mainPage.allSentences.length
//         // console.log('first if is worked')
//     } else {
//         state.mainPage.numberOfSentences = state.mainPage.allSentences.length + 1
//         // console.log('second if is worked')
//     };
//     // console.log('numberOfSentences after if = ' + state.mainPage.numberOfSentences)
//     // console.log(sentences);
//     // console.log('Text length: ' + text.length)
//     // console.log('All sentences: ' + state.mainPage.allSentences);
//     // console.log('Number of sentences: ' + state.mainPage.numberOfSentences);
// };

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


// RENDER SENTENCES FROM RESPONSE
// ______________________________

export const addSentencesFromSummarizedText = (data) => {
    state.mainPage.textSummarized = []
    data.summary_text.map(item => state.mainPage.textSummarized.push(item))
    reRenderEntireTree(state)
};

// Allow to check state objects from console. Just enter "state" and object you want to find
// _________________________________________________________________________________________

window.state = state; 

// OBSERVER PATTERN
// ________________

let reRenderEntireTree = (state) => {}

export const subscribe = (observer) =>{
    reRenderEntireTree = observer
}


export default state;