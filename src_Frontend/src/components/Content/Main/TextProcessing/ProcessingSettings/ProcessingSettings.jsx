import s from './ProcessingSettings.module.css';
import React from 'react';
import InputRange from 'react-input-range';
import Select from 'react-select';
import 'react-input-range/lib/css/index.css';

const ProcessingSettings = (props) => {

    // debugger;
    // let inputNumber = React.createRef();

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

    let onRangeChange = (event) => {
        let selectedPercentOfSentences = event.value
        console.log("selectedPercentOfSentences = " + selectedPercentOfSentences)
    }
    
    let percentOfSentencesToProcess = props.rangeData.percentOfSentencesToProcess.currentValue;
    
    let rangeValue = {
        currentValue: percentOfSentencesToProcess
    }
    // debugger;
    let setRangeValue = (obj) => {
        // debugger;
        rangeValue = obj
    }

    return (
        <div>
            <Select
                className={s.hover}
                styles={customControlStyles}
                options={options}
                // ref={inputNumber}
                value={selectedValue}
                onChange={onDropdownChange.bind(this)}
                menuPlacement="top" />
            

            <div className={s.rangeBlock}>

                <InputRange
                    maxValue={props.rangeData.maxPercentSentencesToProcess}
                    minValue={props.rangeData.minPercentSentencesToProcess}
                    value={rangeValue.currentValue}
                    onChange={value => setRangeValue({ currentValue: value })} 
                    onChangeComplete={value => console.log(value)} />

                {/* <input type="range" min="0" max="50" step="1" value={currentRangeValue} onchange={changeRangeValue}></input> */}
            </div>
        </div>

    )
}

export default ProcessingSettings