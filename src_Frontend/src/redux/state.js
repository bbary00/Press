
let state = {
    // navbar: {
    //     friendsPreview: [
    //         { id: 4 },
    //         { id: 5 },
    //         { id: 6 }
    //     ]
    // },

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
            oneStepInRange: undefined,
            percentOfSentencesToProcess: { currentValue: 0 },
        },
        
        
        
        textSummarized: []
    },
    
}

window.state = state; // Allow to check state objects from console. Just enter "state" and object you want to find

export const changeTextToProcess = (text) => {    // 0. Calls every time user enter symbol in text area 1. Catches total string value entered by user in text area 2. Write new value to object "textToProcess" 3. ReRender SPA
    state.mainPage.textToProcess = text;
    splitAndCalculateSentences(text);
    reRenderEntireTree(state);
};

export const changeNumberOfSentencesToProcess = (number) => {
    state.mainPage.numberOfSentencesToProcess = number;
    console.log("numberOfSentencesToProcess = " + state.mainPage.numberOfSentencesToProcess);
    changePercentOfSentencesToProcess();
    // debugger;
    reRenderEntireTree(state);
}

export const changePercentOfSentencesToProcess = () => {
    // define one step value --> 100% / maximum number of sentences to choose
    state.mainPage.rangeData.oneStepInRange = Math.round(state.mainPage.rangeData.maxPercentSentencesToProcess / state.mainPage.maxNumberOfSentencesToChoose)
    console.log('One step in range = ' + state.mainPage.rangeData.oneStepInRange)
    let totalSteps = state.mainPage.rangeData.oneStepInRange * state.mainPage.numberOfSentencesToProcess
    
    // Hack - to show maximum value in range input when chosen max value in dropdown
    
    if (totalSteps > state.mainPage.rangeData.maxPercentSentencesToProcess && state.mainPage.numberOfSentencesToProcess === state.mainPage.dropdownOptions.length) {
        state.mainPage.rangeData.percentOfSentencesToProcess.currentValue = state.mainPage.rangeData.maxPercentSentencesToProcess
    } else if (totalSteps < state.mainPage.rangeData.maxPercentSentencesToProcess && state.mainPage.numberOfSentencesToProcess === state.mainPage.dropdownOptions.length) {
        state.mainPage.rangeData.percentOfSentencesToProcess.currentValue = state.mainPage.rangeData.maxPercentSentencesToProcess
    } else {
        state.mainPage.rangeData.percentOfSentencesToProcess.currentValue = state.mainPage.rangeData.oneStepInRange * state.mainPage.numberOfSentencesToProcess
    }
    
    // set new value to InputRange
    console.log('percentOfSentencesToProcess = ' + state.mainPage.rangeData.percentOfSentencesToProcess.currentValue +'%')
    
}

export let splitAndCalculateSentences = (text) => {
    let pattern = /(.+?([A-Z].)\.(?:['")\\\s][\"]?)+?\s?)/igm, match;
    let sentences = [];
    while( ( match = pattern.exec( text )) != null ) {
        if( match.index === pattern.lastIndex ) {
            pattern.lastIndex++;
        }
        sentences.push( match[0] )
    };
    state.mainPage.allSentences = sentences;
    state.mainPage.numberOfSymbols = text.length;
    // console.log('numberOfSentences = ' + state.mainPage.allSentences.length)
    
    if (/\s$/.test(text)) {
        state.mainPage.numberOfSentences = state.mainPage.allSentences.length;
        // console.log('first if is worked')
    } else {
        state.mainPage.numberOfSentences = state.mainPage.allSentences.length + 1;
        // console.log('second if is worked')
    };
    // console.log('numberOfSentences after if = ' + state.mainPage.numberOfSentences)
    countMaximumNumberOfSentencesToChoose(state.mainPage.numberOfSentences);
    createArrayOfLabelsForDropdown(state.mainPage.maxNumberOfSentencesToChoose);
    // console.log(sentences);
    // console.log('Text length: ' + text.length)
    // console.log('All sentences: ' + state.mainPage.allSentences);
    // console.log('Number of sentences: ' + state.mainPage.numberOfSentences);
};



const countMaximumNumberOfSentencesToChoose = (number) => {
    let value = number / 2;
    console.log('numberOfSentences / 2 = ' + value);
    let half = Math.floor(value);
    
    console.log('numberOfSentences / 2 and floor()= ' + half);
    if (half < 10) {
        state.mainPage.maxNumberOfSentencesToChoose = half;
    } else {
        state.mainPage.maxNumberOfSentencesToChoose = 10;
    }
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

export const addSentencesFromSummarizedText = (data) => {
    state.mainPage.textSummarized = [];
    data.summary_text.map(item => state.mainPage.textSummarized.push(item));
    reRenderEntireTree(state);
};

// export const addSentencesFromSummarizedText = (data) => {
//     let id = state.mainPage.textSummarized[state.mainPage.textSummarized.length - 1].id + 1;
//     let newSentence = {
//         id: id,
//         title: 'default',
//         text: data,
//         // text: state.mainPage.textToProcess,
//         likes: 0
//     };
//     state.mainPage.textSummarized.push(newSentence);
//     // state.mainPage.textToProcess = '';    // Set default empty string value to an object "newTextValue"
//     reRenderEntireTree(state);
// };

// export const addMessage = (dialogId, sender, userId, messageId, text) => {
//     let newMessage = {
//         sender: sender,
//         userId: userId,
//         id: messageId,
//         message: text
//     };
//     var dialogId = dialogId - 1;
//     state.dialogsPage.messagesData[dialogId].push(newMessage);
//     reRenderEntireTree(state);
// };

// let getDataFromServer = () => {
//     axios.post('/api/test/', {"dataRequest": "mainPage"}).then((response) => state.main)
// }

let reRenderEntireTree = (state) => {}

export const subscribe = (observer) =>{
    reRenderEntireTree = observer;
}


export default state;