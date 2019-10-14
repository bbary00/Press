import React from 'react';
import s from './TextProcessing.module.css';
import SentenceTemplate from './SentenceTemplate/SentenceTemplate';
import ProcessingSettings from "./ProcessingSettings/ProcessingSettings";
import { changeTextToProcessCreator, addSentencesFromSummarizedTextCreator } from '../../../../redux/mainPage-reducer'

const TextProcessing = (props) => {
	// debugger;
	let summarizedTextElements = props.textSummarized.map(item => <SentenceTemplate title={item.id} text={item.text} />);

	let sendRequest = () => {
		summarizedTextElements = [];
		let text = inputText.current.value;
		let reqObj = {
			original_text: text,
			number_of_sentences: props.numberOfSentencesToProcess,
			number_of_symbols: props.numberOfSymbols
		}

		let data = JSON.stringify(reqObj);

		fetch('https://presstextapp.herokuapp.com/api/summarize/', {
			method: 'POST', // или 'PUT'
			body: data, // data может быть типа `string` или {object}!
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(res => res.json())
			.then((response) => {
				// console.log(JSON.stringify(response));
				console.log(response);
				let action = addSentencesFromSummarizedTextCreator(response)
				props.dispatch(action);
			})
			.catch(error => console.error('Ошибка:', error));
	}

	let inputText = React.createRef();

	let onInputTextChange = (e) => {
		let text = e.target.value
		let action = changeTextToProcessCreator(text)
		props.dispatch(action)
	}

	let numberOfSentences = props.numberOfSentences
	let numberOfSymbols = props.numberOfSymbols

	return (
		<div>
			{/* <div className="row no-gutters">
				<div className={`${s.box}`}>
					<p className={s.headingLarge}>Process your text and get the most important information</p>
				</div>
			</div> */}
			<div className="row no-gutters">
				<div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
					<div className={s.box}>
						<p className={s.heading}>1. Put the text below &nbsp;&nbsp;
							<span style={{ fontWeight: '400', fontSize: '1rem' }}>or &nbsp;&nbsp;</span>
							<span>
								<button className={`btn btn-sm sunny-morning-gradient ${s.btnSmall} ${s.btnUpload}`}>
									<i className="fas fa-file-upload" style={{ marginRight: '10px', top: '2px' }}></i>Upload file
								</button>
							</span>
						</p>
						<textarea ref={inputText} onChange={onInputTextChange} value={props.textToProcess} />
						<div className={s.countBlock}>
							<ul>
								<li>Sentences: <span>{numberOfSentences}</span></li>
								<li>Symbols: <span>{numberOfSymbols}</span></li>
							</ul>
						</div>
					</div>
					<div className={s.box}>
						<p className={s.heading}>2. How many sentences you want to get?</p>
						<div className="row no-gutters">
							<div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
								<ProcessingSettings
									numberOfSentencesToProcess={props.numberOfSentencesToProcess}
									dropdownOptions={props.dropdownOptions}
									rangeData={props.rangeData}
									dispatch={props.dispatch}
								/>
							</div>
							<div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">

								<button type="button" onClick={sendRequest} className={`btn peach-gradient ${s.btnMain}`}>Get summary</button>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
					<div className={s.box}>
						<div>
							<p className={`${s.heading}`}>3. Pick up the result</p>
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