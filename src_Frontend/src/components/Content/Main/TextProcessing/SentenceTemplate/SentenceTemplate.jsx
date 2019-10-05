import React from 'react';
import s from './SentenceTemplate.module.css';

const SentenceTemplate = (props) => {
	return (
		<div>
			<div className={s.item}>
				<div className={s.postWrapper}>
					{/* <div className={s.title}>{props.title}</div> */}
					{/* <div className={s.date}><span className={s.time}>{props.time} &nbsp;</span> {props.date}</div> */}
					<div className={s.text}>{props.text}</div>
					{/* <span className={s.likes}>{props.likes} likes</span> */}
				</div>
			</div>
		</div>
	)
}

export default SentenceTemplate