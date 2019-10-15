// import React from 'react'
import { connect } from 'react-redux'
import { changeNumberOfSentencesToProcessCreator, changePercentOfSentencesToProcessCreator, moveRangeToClosestStepCreator} from '../../../../../redux/mainPage-reducer'
import ProcessingSettings from './ProcessingSettings'

let mapStateToProps = (state) => {
    return {
        mainPage: state.mainPage
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        changeNumberOfSentencesToProcess: (number) => {
            let action = changeNumberOfSentencesToProcessCreator(number)
            dispatch(action)
        },
        changePercentOfSentencesToProcess: (value) => {
            let action = changePercentOfSentencesToProcessCreator(value)
            dispatch(action)
        },
        moveRangeToClosestStep: (value) => {
            let action = moveRangeToClosestStepCreator(value)
            dispatch(action)
        }
    }
}

const ProcessingSettingsContainer = connect(mapStateToProps, mapDispatchToProps)(ProcessingSettings)

export default ProcessingSettingsContainer