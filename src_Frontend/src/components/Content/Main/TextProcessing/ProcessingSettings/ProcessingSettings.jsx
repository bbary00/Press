import s from './ProcessingSettings.module.css';
import React from 'react';
import InputRange from 'react-input-range';
import Select from 'react-select';
import 'react-input-range/lib/css/index.css';

const ProcessingSettings = (props) => {
    // debugger;
    
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
    let selectedValue = {
        value: props.mainPage.numberOfSentencesToProcess,
        label: props.mainPage.numberOfSentencesToProcess
    };
    let options = props.mainPage.dropdownOptions;
    let rangeValue = props.mainPage.rangeData.percentOfSentencesToProcess

    // Disabling range if there is no data to choose
    let rangeIsDisabled = () => {
        if (props.mainPage.dropdownOptions.length === 0) {
            return true
        } else {
            return false
        }
    }

    // ______________
    // EVENT HANDLERS
    
    // When dropdown is changed
    let onDropdownChange = (event) => {
        let number = event.value
        props.changeNumberOfSentencesToProcess(number)
    }
    // When scrolling the range
    let onChangeRangeValue = (value) => {
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
                    value={selectedValue}
                    onChange={onDropdownChange.bind(this)}
                    isSearchable={false} />
            </div>
            <div className={s.rangeBlock}>
                <InputRange
                    disabled={rangeIsDisabled()}
                    maxValue={props.mainPage.rangeData.maxPercentSentencesToProcess}
                    minValue={props.mainPage.rangeData.minPercentSentencesToProcess}
                    value={rangeValue}
                    onChange={value => onChangeRangeValue(value)} 
                    onChangeComplete={value => moveToClosestStep(value)} />
            </div>
        </div>

    )
}

export default ProcessingSettings