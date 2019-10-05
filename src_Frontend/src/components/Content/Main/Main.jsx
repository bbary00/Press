import React from 'react';
import s from './Main.module.css';
import TextProcessing from './TextProcessing/TextProcessing';


const Main = (props) => {
	// debugger;
	return (
		<div className={s.profile}>
			
			<TextProcessing 
				textSummarized={props.mainPage.textSummarized}
				addSentencesFromSummarizedText={props.addSentencesFromSummarizedText}
				textToProcess={props.mainPage.textToProcess}
				numberOfSentencesToProcess={props.mainPage.numberOfSentencesToProcess}
				changeTextToProcess={props.changeTextToProcess}
				changeNumberOfSentencesToProcess={props.changeNumberOfSentencesToProcess}
				splitAndCalculateSentences={props.splitAndCalculateSentences}
				dropdownOptions={props.mainPage.dropdownOptions}
			/>
		</div>
	)
}

export default Main