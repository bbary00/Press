import s from './ProcessingSettings.module.css';
import React from 'react';
import InputRange from 'react-input-range';
import Select from 'react-select';
import 'react-input-range/lib/css/index.css';

const ProcessingSettings = (props) => {

    // debugger;

    let onDropdownChange = (event) => {
        let selectedNumberOfSentences = event.value
        // console.log("selectedNumberOfSentences = " + selectedNumberOfSentences)
        props.changeNumberOfSentencesToProcess(selectedNumberOfSentences)
        // debugger;
    }

    // Before rendering html
    let selectedValue = {
        value: props.numberOfSentencesToProcess,
        label: props.numberOfSentencesToProcess
    };

    let options = props.dropdownOptions;

    // Styles for Dropdown input
    const customControlStyles = {
        control: (base) => ({
            ...base,
        }),
        menuList: (base) => ({
            ...base,
            maxHeight: 160,
        }),
        valueContainer: (base) => ({
            ...base,
            height: 50,
        }),
        input: (base) => ({
            ...base,
            height: 43,
            input: (base) => ({
                ...base,
                marginTop: 0
            })
        })
    }

    // Before rendering html
    let rangeValue = props.rangeData.percentOfSentencesToProcess

    // Disabling range if there is no data to choose
    let rangeIsDisabled = () => {
        if (props.dropdownOptions.length === 0) {
            return true
        } else {
            return false
        }
    }

    // When scrolling the range
    let onChangeRangeValue = (value) => {
        // debugger;
        props.changePercentOfSentencesToProcess(value)
    }
    // When scroll is finished 
    let moveToClosestStep = (value) => {
        props.moveRangeToClosestStep(value)
    }

    return (
        <div className={s.settingsBlock}>
            <div>
                <Select
                    className={s.hover}
                    styles={customControlStyles}
                    options={options}
                    // ref={inputNumber}
                    value={selectedValue}
                    onChange={onDropdownChange.bind(this)}
                    // menuPlacement="top"
                    isSearchable={false} />
            </div>
            
            <div className={s.rangeBlock}>
                <InputRange
                    disabled={rangeIsDisabled()}
                    maxValue={props.rangeData.maxPercentSentencesToProcess}
                    minValue={props.rangeData.minPercentSentencesToProcess}
                    value={rangeValue}
                    onChange={value => onChangeRangeValue(value)} 
                    onChangeComplete={value => moveToClosestStep(value)} />
            </div>
        </div>

    )
}

export default ProcessingSettings