
let state = {
    navbar: {
        friendsPreview: [
            { id: 4 },
            { id: 5 },
            { id: 6 }
        ]
    },

    mainPage: {
        allSentences: [],
        numberOfSymbols: 0,
        numberOfSentences: 0,

        textToProcess: '',
        numberOfSentencesToProcess: undefined,

        textSummarized: []
    },
    dialogsPage: {
        dialogsData: [
            { id: 2, name: 'Sherlock Holmes' },
            { id: 3, name: 'Neutury' },
            { id: 4, name: 'Mrs. Hudson' },
            { id: 5, name: 'Agent Smith' },
            { id: 6, name: 'Collin McMerfy' },
            { id: 7, name: 'Benjamin Gabin' }
        ],
        messagesData: [
            [
                { sender: 1, userId: 2, id: 1, message: 'How often have I said that when you have excluded the impossible whatever remains, however improbable, must be the truth.' },
                { sender: 0, userId: 1, id: 2, message: 'What?' },
                { sender: 1, userId: 2, id: 3, message: 'You know my methods, Max' },
                { sender: 1, userId: 2, id: 4, message: 'Never trust to general impressions, my boy, but concentrate yourself upon details.' },
                { sender: 0, userId: 1, id: 5, message: 'Thank you mr Holmes' }
            ],
            [
                { sender: 1, userId: 3, id: 1, message: 'Hi=)' },
                { sender: 1, userId: 3, id: 2, message: 'Lets go to the cinema today?' },
                { sender: 1, userId: 3, id: 3, message: 'mmm? ;)' },
            ],
            [
                { sender: 1, userId: 4, id: 1, message: 'Great day to drink some tea!)' },
                { sender: 1, userId: 4, id: 2, message: 'Isn`t it?' }
            ],
            [
                { sender: 1, userId: 5, id: 1, message: 'Never send a human to do a machine`s job.' },
                { sender: 0, userId: 1, id: 2, message: 'And who are you mr Smith?' },
                { sender: 1, userId: 5, id: 3, message: 'Doesn`t matter.' }
            ],
            [
                { sender: 0, userId: 1, id: 1, message: 'Hohoho!' },
                { sender: 1, userId: 6, id: 2, message: 'Bla bla?' },
                { sender: 0, userId: 1, id: 3, message: 'Gusto, could you please send invitation to all members?' }
            ],
            [
                { sender: 0, userId: 1, id: 1, message: 'Hohoho!' },
                { sender: 1, userId: 7, id: 2, message: 'Bla bla?' },
            ]
        ]
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
    console.log(number);
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
    console.log(sentences);
    console.log('Text length: ' + text.length)
    console.log('All sentences: ' + state.mainPage.allSentences);
    console.log('Number of sentences: ' + state.mainPage.numberOfSentences);
};

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

export const addMessage = (dialogId, sender, userId, messageId, text) => {
    let newMessage = {
        sender: sender,
        userId: userId,
        id: messageId,
        message: text
    };
    var dialogId = dialogId - 1;
    state.dialogsPage.messagesData[dialogId].push(newMessage);
    reRenderEntireTree(state);
};

// let getDataFromServer = () => {
//     axios.post('/api/test/', {"dataRequest": "mainPage"}).then((response) => state.main)
// }

let reRenderEntireTree = (state) => {}

export const subscribe = (observer) =>{
    reRenderEntireTree = observer;
}


export default state;