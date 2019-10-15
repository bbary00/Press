import React from 'react';
import s from './Main.module.css';
import TextProcessing from './TextProcessing/TextProcessing';
import TextProcessingContainer from './TextProcessing/TextProcessingContainer';


const Main = (props) => {
	return (
		<div className={s.profile}>
			<TextProcessingContainer />
		</div>
	)
}

export default Main