import React from 'react';
import s from './TextProcessing.module.css';
import SentenceTemplate from './SentenceTemplate/SentenceTemplate';
import Select from 'react-select';

const TextProcessing = (props) => {
	// debugger;
	let summarizedTextElements = props.textSummarized.map(item => <SentenceTemplate title={item.id} text={item.text} />);
	let inputText = React.createRef();

	let sendRequest = () => {
		summarizedTextElements = [];
		let text = inputText.current.value;
		let reqObj = {
			original_text: text,
			number_of_sentences: 3,
			number_of_symbols: props.numberOfSymbols
		}

		let data = JSON.stringify(reqObj);

		fetch('/api/summarize/', {
			method: 'POST', // или 'PUT'
			body: data, // data может быть типа `string` или {object}!
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(res => res.json())
			.then((response) => {
				// console.log(JSON.stringify(response));
				console.log(response);
				props.addSentencesFromSummarizedText(response);
			})
			.catch(error => console.error('Ошибка:', error));
	}

	let onTextChange = () => {
		let text = inputText.current.value;
		props.changeTextToProcess(text)
		// console.log(text);
	}

	let inputNumber = React.createRef();
	let onDropdownChange = () => {
		let selectedNumber = inputNumber.current.value
		props.changeNumberOfSentencesToProcess(selectedNumber)
	}

	let options = [
		{ label: 1 },
		{ label: 2 },
		{ label: 3 },
		{ label: 4 },
	]
	let customStyles = {
		option: (provided, state) => ({
			...provided,
			borderBottom: '1px dotted pink',
			color: state.isSelected ? 'red' : 'blue',
			padding: 10,
		  }),
		container: () => ({
			width: "100%"
		}),
		control: () => ({
			// none of react-select's styles are passed to <Control />
			width: "100%",
		}),
		indicatorsContainer: () => ({
			width: "100%",
			border: '1px solid rgba(0,0,0,0.2)',
			borderRadius: '3px',
		}),
		// menu: () => ({
		// 	width: "inherit",
		// }),
		singleValue: (provided, state) => {
		const opacity = state.isDisabled ? 0.5 : 1;
		const transition = 'opacity 300ms';
	
		return { ...provided, opacity, transition };
		}
	}

	return (
		<div>
			<div className="row no-gutters">
				<div className={`${s.box}`}>
					<p className={s.headingLarge}>Process your text and get the most important information</p>
				</div>
			</div>
			<div className="row no-gutters">
				<div className="col">
					<div className={s.box}>
						<p className={s.heading}>1. Put your text here</p>
						<textarea ref={inputText} onChange={onTextChange} value={props.textToProcess} />
					</div>
					<div className={s.box}>
						<p className={s.heading}>2. How many sentences you want to get?</p>
						<div className="row no-gutters">
							<div className="col">
								<div className="row no-gutters">
									<Select
										// className={s.input}
										styles={customStyles}

										options={options}
										ref={inputNumber}
										// value={"Default"}
										placeholder={"Select number of sentences"}
										// isSearchable={false}
										// keepSelectedInList={false}
										// addPlaceholder={"Number of sentences"}
										// onChange={(values) => this.onChange(values)}
										onChange={onDropdownChange}
									/>
								</div>
							</div>
							<div className="col">
								<button type="button" onClick={sendRequest} className={`btn btn-outline-primary`}>Get summary</button>
							</div>
						</div>


					</div>
				</div>
				<div className="col">
					<div className={s.box}>
						<div>
							<p className={`${s.heading}`}>3. Pick up the result below</p>
						</div>
						<div className={s.posts}>
							{summarizedTextElements}
						</div>
					</div>
				</div>
			</div>


		</div>
	)
}

export default TextProcessing