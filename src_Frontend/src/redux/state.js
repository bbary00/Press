
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
    console.log("changeNumberOfSentencesToProcess() => " + number);
    reRenderEntireTree(state);
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
    if (text[text.length - 1] !== /\s/g) {
        state.mainPage.numberOfSentences = state.mainPage.allSentences.length + 1;
    } else {
        state.mainPage.numberOfSentences = state.mainPage.allSentences.length;
    };
    countMaximumNumberOfSentencesToChoose(state.mainPage.numberOfSentences);
    createArrayOfLabelsForDropdown(state.mainPage.maxNumberOfSentencesToChoose);
    // console.log(sentences);
    // console.log('Text length: ' + text.length)
    // console.log('All sentences: ' + state.mainPage.allSentences);
    // console.log('Number of sentences: ' + state.mainPage.numberOfSentences);
};



const countMaximumNumberOfSentencesToChoose = (number) => {
    let half = Math.round(number / 2);
    console.log(half);
    if (half < 10) {
        state.mainPage.maxNumberOfSentencesToChoose = half;
    } else {
        state.mainPage.maxNumberOfSentencesToChoose = 10;
    }
}

const createArrayOfLabelsForDropdown = (number) => {
    
    if (number) {

        state.mainPage.dropdownOptions = []

        for ( let e = 0; e <= number ; e++) {
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