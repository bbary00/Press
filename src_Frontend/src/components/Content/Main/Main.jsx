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
				changeTextToProcess={props.changeTextToProcess}
				

				numberOfSentencesToProcess={props.mainPage.numberOfSentencesToProcess}
				changeNumberOfSentencesToProcess={props.changeNumberOfSentencesToProcess}
				changePercentOfSentencesToProcess={props.changePercentOfSentencesToProcess}
				moveRangeToClosestStep={props.moveRangeToClosestStep}

				dropdownOptions={props.mainPage.dropdownOptions}
				rangeData={props.mainPage.rangeData}
			/>
		</div>
	)
}

export default Main