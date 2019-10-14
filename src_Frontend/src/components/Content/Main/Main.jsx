import React from 'react';
import s from './Main.module.css';
import TextProcessing from './TextProcessing/TextProcessing';


const Main = (props) => {
	// debugger;
	return (
		<div className={s.profile}>
			
			<TextProcessing 	
				textSummarized={props.mainPage.textSummarized}
				textToProcess={props.mainPage.textToProcess}
				numberOfSentences={props.mainPage.numberOfSentences}
				numberOfSymbols={props.mainPage.numberOfSymbols}
				numberOfSentencesToProcess={props.mainPage.numberOfSentencesToProcess}
				dropdownOptions={props.mainPage.dropdownOptions}
				rangeData={props.mainPage.rangeData}
				dispatch={props.dispatch}
			/>
		</div>
	)
}

export default Main