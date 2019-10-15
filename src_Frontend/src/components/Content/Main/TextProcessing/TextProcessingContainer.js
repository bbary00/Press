import React from 'react'
import { connect } from 'react-redux'
import TextProcessing from './TextProcessing'
import { changeTextToProcessCreator, addSentencesFromSummarizedTextCreator } from '../../../../redux/mainPage-reducer'


let mapStateToProps = (state) => {
    return {
        mainPage: state.mainPage
    }
}
let mapDispatchToProps = (dispatch) => {
    return {
        changeTextToProcess: (text) => {
            let action = changeTextToProcessCreator(text)
            dispatch(action)
        },
        addSentencesFromSummarizedText: (value) => {
            let action = addSentencesFromSummarizedTextCreator(value)
            dispatch(action)
        }
    }
}
const TextProcessingContainer = connect(mapStateToProps, mapDispatchToProps)(TextProcessing)

export default TextProcessingContainer