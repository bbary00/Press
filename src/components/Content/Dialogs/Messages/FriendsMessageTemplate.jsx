import React from 'react';
import s from './Messages.module.css';

const FriendsMessageTemplate = (props) => {
	return (
		<div className={`${s.messageBlock} ${s.friendsMessage}`}>
			<div className={s.ava}><img src={`/images/avatar${props.userId}.jpg`} alt="avatar" /></div>
			<div className={`${s.message}`}>{props.message}</div>
		</div>
	)
}

export default FriendsMessageTemplate