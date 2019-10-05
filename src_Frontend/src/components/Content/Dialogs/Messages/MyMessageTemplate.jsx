import React from 'react';
import s from './Messages.module.css';

const MyMessageTemplate = (props) => {
	return (
		<div className={`${s.messageBlock} ${s.myMessage}`}>
			<div className={`${s.message}`}>{props.message}</div>
			<div className={s.ava}><img src={`/images/avatar${props.userId}.jpg`} alt="avatar" /></div>
		</div>
	)
}

export default MyMessageTemplate