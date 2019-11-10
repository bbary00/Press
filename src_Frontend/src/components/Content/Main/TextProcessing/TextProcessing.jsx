import React from 'react';
import s from './TextProcessing.module.scss';
import SentenceTemplate from './SentenceTemplate/SentenceTemplate';
import ProcessingSettingsContainer from "./ProcessingSettings/ProcessingSettingsContainer.js";
// import { changeTextToProcessCreator, addSentencesFromSummarizedTextCreator } from '../../../../redux/mainPage-reducer'

const TextProcessing = (props) => {
	// debugger;

	let inputText = React.createRef();

	let onInputTextChange = (e) => {
		let text = e.target.value
		props.changeTextToProcess(text)
	}

	let sendRequest = () => {
		summarizedTextElements = [];
		let text = inputText.current.value;
		let reqObj = {
			original_text: text,
			number_of_sentences: props.mainPage.numberOfSentencesToProcess,
			number_of_symbols: props.mainPage.numberOfSymbols
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
				props.addSentencesFromSummarizedText(response)
			})
			.catch(error => console.error('Ошибка:', error));
	}
	let summarizedTextElements = props.mainPage.textSummarized.map(item => <SentenceTemplate title={item.id} text={item.text} />);

	return (
		<div>
			<div className="row no-gutters">
				<div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
					<div className={s.box}>
						<p className={s.heading}>1. Put the text below &nbsp;&nbsp;
							<span style={{ fontWeight: '400', fontSize: '1rem' }}>or &nbsp;&nbsp;</span>
							<span>
								<button className={`btn btn-sm sunny-morning-gradient ${s.btnSmall} ${s.btnUpload}`}>
									<i className={`${s.uploadIcon} fas fa-file-upload`} style={window.innerWidth < 420 ? { marginRight: "0px" } : {}} ></i>{window.innerWidth > 420 ? 'Upload file' : null}
								</button>
							</span>
						</p>
						<textarea ref={inputText} onChange={onInputTextChange} value={props.mainPage.textToProcess} />
						<div className={s.countBlock}>
							<ul>
								<li>Sentences: <span>{props.mainPage.numberOfSentences}</span></li>
								<li>Symbols: <span>{props.mainPage.numberOfSymbols}</span></li>
							</ul>
						</div>
					</div>
					<div className={s.box}>
						<p className={s.heading}>2. How many sentences you want to get?</p>
						<div className="row no-gutters">
							<div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
								<ProcessingSettingsContainer />
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