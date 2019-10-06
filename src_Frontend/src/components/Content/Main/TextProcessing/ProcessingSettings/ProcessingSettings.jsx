import s from './ProcessingSettings.module.css';
import React from 'react';
import InputRange from 'react-input-range';
import Select from 'react-select';
import 'react-input-range/lib/css/index.css';

const ProcessingSettings = (props) => {

    let inputNumber = React.createRef();

    let onDropdownChange = (event) => {
        let selectedNumberOfSentences = event.value
        console.log("selectedNumberOfSentences = " + selectedNumberOfSentences)
        props.changeNumberOfSentencesToProcess(selectedNumberOfSentences)
        // debugger;
    }

    let selectedValue = {
        value: props.numberOfSentencesToProcess,
        label: props.numberOfSentencesToProcess
    };

    let onRangeChange = (event) => {
        let selectedPercentOfSentences = event.value
        console.log("selectedPercentOfSentences = " + selectedPercentOfSentences)
    }

    // let currentRangeValue = 35
    // let changeRangeValue = (event) => {
    //     currentRangeValue = event.target.value
    // }

    let options = props.dropdownOptions;

    const customControlStyles = {
        control: (base) => ({
            ...base,
            // height: 50,
            
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

    let rangeValue = {
        currentValue: 15
    }
    let setRangeValue = (obj) => {
        debugger;
        rangeValue = obj
    }

    return (
        <div>
            <Select
                styles={customControlStyles}
                options={options}
                ref={inputNumber}
                value={selectedValue}
                onChange={onDropdownChange.bind(this)}
                menuPlacement="top" />
            

            <div className={s.rangeBlock}>

                <InputRange
                    maxValue={20}
                    minValue={0}
                    value={rangeValue.currentValue}
                    onChange={value => setRangeValue({ currentValue: value })} 
                    onChangeComplete={value => console.log(value)} />

                {/* <input type="range" min="0" max="50" step="1" value={currentRangeValue} onchange={changeRangeValue}></input> */}
            </div>
        </div>

    )
}

export default ProcessingSettings